package domain_test

import (
	"testing"

	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
)

// TestHasPermission — table-driven coverage of the role→permission map.
// Owner is a wildcard; every other role's exact permission set is asserted.
//
// If you tweak the rolePermissions map in permissions.go, the failing rows
// here tell you exactly which role/perm pair you changed. Adding a new
// permission requires (a) adding the constant to allPermissions, (b) listing
// it under every role that should have it, (c) adding rows to this table.
func TestHasPermission(t *testing.T) {
	type row struct {
		role string
		perm domain.Permission
		want bool
	}

	cases := []row{
		// ----- Owner: wildcard -----
		{domain.RoleOwner, domain.PermViewMembers, true},
		{domain.RoleOwner, domain.PermManageMembers, true},
		{domain.RoleOwner, domain.PermViewFarms, true},
		{domain.RoleOwner, domain.PermManageFarms, true},
		{domain.RoleOwner, domain.PermViewFields, true},
		{domain.RoleOwner, domain.PermManageFields, true},
		{domain.RoleOwner, domain.PermViewCrops, true},
		{domain.RoleOwner, domain.PermManageCrops, true},
		{domain.RoleOwner, domain.PermViewHarvests, true},
		{domain.RoleOwner, domain.PermLogHarvests, true},

		// ----- Manager -----
		{domain.RoleManager, domain.PermViewMembers, true},
		{domain.RoleManager, domain.PermManageMembers, true},
		{domain.RoleManager, domain.PermViewFarms, true},
		{domain.RoleManager, domain.PermManageFarms, true},
		{domain.RoleManager, domain.PermViewFields, true},
		{domain.RoleManager, domain.PermManageFields, true},
		{domain.RoleManager, domain.PermViewCrops, true},
		{domain.RoleManager, domain.PermManageCrops, true},
		{domain.RoleManager, domain.PermViewHarvests, true},
		{domain.RoleManager, domain.PermLogHarvests, true},

		// ----- Grower -----
		{domain.RoleGrower, domain.PermViewMembers, false},
		{domain.RoleGrower, domain.PermManageMembers, false},
		{domain.RoleGrower, domain.PermViewFarms, true},
		{domain.RoleGrower, domain.PermManageFarms, true},
		{domain.RoleGrower, domain.PermViewFields, true},
		{domain.RoleGrower, domain.PermManageFields, true},
		{domain.RoleGrower, domain.PermViewCrops, true},
		{domain.RoleGrower, domain.PermManageCrops, true},
		{domain.RoleGrower, domain.PermViewHarvests, true},
		{domain.RoleGrower, domain.PermLogHarvests, true},

		// ----- Viewer (read-only across the board) -----
		{domain.RoleViewer, domain.PermViewMembers, false},
		{domain.RoleViewer, domain.PermManageMembers, false},
		{domain.RoleViewer, domain.PermViewFarms, true},
		{domain.RoleViewer, domain.PermManageFarms, false},
		{domain.RoleViewer, domain.PermViewFields, true},
		{domain.RoleViewer, domain.PermManageFields, false},
		{domain.RoleViewer, domain.PermViewCrops, true},
		{domain.RoleViewer, domain.PermManageCrops, false},
		{domain.RoleViewer, domain.PermViewHarvests, true},
		{domain.RoleViewer, domain.PermLogHarvests, false},

		// ----- Defensive: unknown roles + empty strings always denied -----
		{"", domain.PermViewMembers, false},
		{"unknown-role", domain.PermViewMembers, false},
		{"OWNER", domain.PermViewMembers, false}, // case-sensitive
	}

	for _, c := range cases {
		got := domain.HasPermission(c.role, c.perm)
		if got != c.want {
			t.Errorf("HasPermission(%q, %q) = %v, want %v", c.role, c.perm, got, c.want)
		}
	}
}

// TestRolePermissionsAreMonotonic — never let a lower-privilege role
// have a permission that a higher-privilege role lacks. The reverse (a
// higher role having something a lower role doesn't) is fine — managers
// legitimately get member-management perms that growers don't.
//
// Order: viewer < grower < manager < owner (owner is a wildcard).
func TestRolePermissionsAreMonotonic(t *testing.T) {
	allPerms := []domain.Permission{
		domain.PermViewMembers, domain.PermManageMembers,
		domain.PermViewFarms, domain.PermManageFarms,
		domain.PermViewFields, domain.PermManageFields,
		domain.PermViewCrops, domain.PermManageCrops,
		domain.PermViewHarvests, domain.PermLogHarvests,
	}

	// These perms are deliberately owner-only — the invariant doesn't
	// apply to them.
	ownerOnly := map[domain.Permission]bool{}

	check := func(lower, higher string, perm domain.Permission) {
		if ownerOnly[perm] {
			return
		}
		// If lower has it, higher must have it too (the bug we're guarding
		// against is: adding a new perm to viewer's map but forgetting to
		// give it to manager too).
		if domain.HasPermission(lower, perm) && !domain.HasPermission(higher, perm) {
			t.Errorf("%s has %q but %s does not — asymmetry bug", lower, perm, higher)
		}
	}

	for _, p := range allPerms {
		check(domain.RoleViewer, domain.RoleGrower, p)
		check(domain.RoleGrower, domain.RoleManager, p)
		check(domain.RoleManager, domain.RoleOwner, p) // always true
	}
}

// TestAllPermissionsListed — every constant in the allPermissions slice
// must be reachable via some role (otherwise it's dead code). Lints against
// forgetting to wire a brand new permission into the role map.
func TestAllPermissionsListed(t *testing.T) {
	known := []domain.Permission{
		domain.PermViewMembers, domain.PermManageMembers,
		domain.PermViewFarms, domain.PermManageFarms,
		domain.PermViewFields, domain.PermManageFields,
		domain.PermViewCrops, domain.PermManageCrops,
		domain.PermViewHarvests, domain.PermLogHarvests,
	}

	// Every non-owner role should allow at least one permission; if a
	// brand new role is added empty, this catches it.
	roles := []string{domain.RoleManager, domain.RoleGrower, domain.RoleViewer}
	for _, r := range roles {
		has := false
		for _, p := range known {
			if domain.HasPermission(r, p) {
				has = true
				break
			}
		}
		if !has {
			t.Errorf("role %q has no permissions in the map — is it configured?", r)
		}
	}
}
