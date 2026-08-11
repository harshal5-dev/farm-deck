package tenant

import (
	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/pkg/slug"

	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
)

func toUpdateTenantParams(tenantID uuid.UUID, req UpdateTenantRequest) db.UpdateTenantParams {
	return db.UpdateTenantParams{
		ID:          tenantID,
		Name:        req.Name,
		Description: req.Description,
		Subdomain:   slug.GenerateTenantDomain(req.Name),
	}
}
