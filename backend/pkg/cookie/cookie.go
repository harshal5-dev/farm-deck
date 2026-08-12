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
	// SetSameSite must run before SetCookie: gin bakes c.sameSite into the
	// http.Cookie at SetCookie time, so setting it afterwards has no effect.
	ctx.SetSameSite(http.SameSiteLaxMode)
	ctx.SetCookie(name, value, int(ttl.Seconds()), "/", cfg.CookieDomain, cfg.CookieSecure, cfg.CookieHttpOnly)
}

func clearCookie(ctx *gin.Context, name string, cfg Config) {
	// SetSameSite must run before SetCookie (see setCookie for details).
	ctx.SetSameSite(http.SameSiteLaxMode)
	ctx.SetCookie(name, "", -1, "/", cfg.CookieDomain, cfg.CookieSecure, cfg.CookieHttpOnly)
}
