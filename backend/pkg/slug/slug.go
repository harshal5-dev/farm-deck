package slug

import (
	"regexp"
	"strings"
)

func GenerateTenantSlug(name string) string {
	slug := strings.ToLower(name)

	regInvalidChars := regexp.MustCompile(`[^a-z0-9-]+`)
	slug = regInvalidChars.ReplaceAllString(slug, "-")

	regMultiHyphen := regexp.MustCompile(`-+`)
	slug = regMultiHyphen.ReplaceAllString(slug, "-")

	return strings.Trim(slug, "-")
}
