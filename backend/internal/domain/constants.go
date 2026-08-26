package domain

import "time"

const (
	// --------- User Constants ---------
	UserStatusActive    = "active"
	UserStatusPending   = "pending"
	UserStatusSuspended = "suspended"
	UserStatusInvited   = "invited"

	UserRoleOwner   = "owner"
	UserRoleManager = "manager"
	UserRoleGrower  = "grower"
	UserRoleViewer  = "viewer"

	SlugDomain = "farmdeck.app"

	DefaultInvitationTokenDuration = 7 * 24 * time.Hour

	ZoneTypeSoil  = "soil"
	ZoneTypeHydro = "hydro"
)
