package slug

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
)

func GenerateTenantDomain(name string) string {
	slug := strings.ToLower(name)

	regInvalidChars := regexp.MustCompile(`[^a-z0-9-]+`)
	slug = regInvalidChars.ReplaceAllString(slug, "-")

	regMultiHyphen := regexp.MustCompile(`-+`)
	slug = regMultiHyphen.ReplaceAllString(slug, "-")

	slug = strings.Trim(slug, "-")
	if slug == "" {
		return ""
	}
	return fmt.Sprintf("%s.%s", slug, domain.SlugDomain)
}
