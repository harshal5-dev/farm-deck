package cookie

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type CookieConfig struct {
	CookieSecure    bool
	CookieHttpOnly  bool
	CookieTokenAge  int
	CookieDomain    string
	CookieTokenName string
}

func SetAuthCookie(ctx *gin.Context, token string, cfg CookieConfig) {
	ctx.SetCookie(
		cfg.CookieTokenName,
		token,
		cfg.CookieTokenAge*60,
		"/",
		cfg.CookieDomain,
		cfg.CookieSecure, // Secure: set to true in production if using HTTPS
		cfg.CookieHttpOnly,
	)
	ctx.SetSameSite(http.SameSiteLaxMode)
}

func ClearAuthCookie(ctx *gin.Context, cfg CookieConfig) {
	ctx.SetCookie(
		cfg.CookieTokenName,
		"",
		-1,
		"/",
		"",
		cfg.CookieSecure, // Secure: set to true in production if using HTTPS
		cfg.CookieHttpOnly,
	)
	ctx.SetSameSite(http.SameSiteLaxMode)
}
