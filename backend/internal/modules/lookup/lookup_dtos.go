package lookup

import "github.com/google/uuid"

type FarmTypeResponse struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	DisplayName string    `json:"displayName"`
	Description *string   `json:"description"`
}
