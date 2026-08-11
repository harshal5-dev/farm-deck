package cookie

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type Config struct {
	CookieSecure           bool
	CookieHttpOnly         bool
	CookieDomain           string
	CookieTokenName        string
	CookieRefreshTokenName string
}

func SetAuthCookie(ctx *gin.Context, token string, ttl time.Duration, cfg Config) {
	setCookie(ctx, cfg.CookieTokenName, token, ttl, cfg)
}

func SetRefreshCookie(ctx *gin.Context, token string, ttl time.Duration, cfg Config) {
	setCookie(ctx, cfg.CookieRefreshTokenName, token, ttl, cfg)
}

func ClearAuthCookie(ctx *gin.Context, cfg Config) {
	clearCookie(ctx, cfg.CookieTokenName, cfg)
}

func ClearRefreshCookie(ctx *gin.Context, cfg Config) {
	clearCookie(ctx, cfg.CookieRefreshTokenName, cfg)
}

func setCookie(ctx *gin.Context, name, value string, ttl time.Duration, cfg Config) {
	ctx.SetCookie(name, value, int(ttl.Seconds()), "/", cfg.CookieDomain, cfg.CookieSecure, cfg.CookieHttpOnly)
	ctx.SetSameSite(http.SameSiteLaxMode)
}

func clearCookie(ctx *gin.Context, name string, cfg Config) {
	ctx.SetCookie(name, "", -1, "/", cfg.CookieDomain, cfg.CookieSecure, cfg.CookieHttpOnly)
	ctx.SetSameSite(http.SameSiteLaxMode)
}
