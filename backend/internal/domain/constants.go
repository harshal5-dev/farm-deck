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

	// DefaultInvitationTokenDuration is how long an invitation stays valid
	// before it can no longer be accepted. Matches the "+ 7 days" comment in
	// the user_invitations migration.
	DefaultInvitationTokenDuration = 7 * 24 * time.Hour
)
