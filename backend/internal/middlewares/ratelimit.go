package middlewares

import (
	"math"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/response"
	"github.com/harshal5-dev/farm-deck/backend/pkg/ctxutil"
	"github.com/harshal5-dev/farm-deck/backend/pkg/ratelimit"
)

// KeyFunc derives the rate limit bucket key from the request context.
// Bucketing by different keys (IP vs user) lets routes apply the same
// limiter with different scopes.
type KeyFunc func(ctx *gin.Context) string

// IPKey buckets by the resolved client IP. Suitable for public endpoints
// (login, register) where requests are anonymous.
func IPKey(ctx *gin.Context) string {
	return "ip:" + ctx.ClientIP()
}

// UserKey buckets by the authenticated user ID, falling back to the client
// IP for anonymous requests. Meant for protected routes that run after
// AuthMiddleware, so all activity by one account shares a single bucket
// even across devices.
func UserKey(ctx *gin.Context) string {
	userID, err := ctxutil.GetUserID(ctx)
	if err != nil {
		return IPKey(ctx)
	}
	return "user:" + userID.String()
}

// RateLimitMiddleware throttles requests through the given limiter using
// keyFn to decide whose bucket to spend from. Exceeded requests get a 429
// with the standard error envelope plus a Retry-After header.
func RateLimitMiddleware(limiter *ratelimit.Limiter, keyFn KeyFunc) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ok, retryAfter := limiter.Allow(keyFn(ctx))
		if !ok {
			seconds := int(math.Ceil(retryAfter.Seconds()))
			if seconds < 1 {
				seconds = 1
			}

			ctx.Header("Retry-After", strconv.Itoa(seconds))
			response.ErrorWithDetails(ctx, http.StatusTooManyRequests, "RATE_LIMITED",
				"too many requests, please retry later",
				gin.H{"retryAfterSeconds": seconds})
			ctx.Abort()
			return
		}

		ctx.Next()
	}
}
