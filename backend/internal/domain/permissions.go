package domain

type Permission string

const (
	PermViewMembers   Permission = "members.view"
	PermManageMembers Permission = "members.manage"

	PermViewFarms   Permission = "farms.view"
	PermManageFarms Permission = "farms.manage"

	PermViewFields   Permission = "fields.view"
	PermManageFields Permission = "fields.manage"

	PermViewCrops   Permission = "crops.view"
	PermManageCrops Permission = "crops.manage"

	PermViewHarvests Permission = "harvests.view"
	PermLogHarvests  Permission = "harvests.log"

	PermManageWorkspace Permission = "workers.manage"
)

const (
	RoleOwner   = "owner"
	RoleManager = "manager"
	RoleGrower  = "grower"
	RoleViewer  = "viewer"
)

var allPermissions = []Permission{
	PermViewMembers, PermManageMembers,
	PermViewFarms, PermManageFarms,
	PermViewFields, PermManageFields,
	PermViewCrops, PermManageCrops,
	PermViewHarvests, PermLogHarvests,
	PermManageWorkspace,
}

var rolePermissions = func() map[string]map[Permission]struct{} {
	owner := make(map[Permission]struct{}, len(allPermissions))
	for _, p := range allPermissions {
		owner[p] = struct{}{}
	}

	set := func(ps ...Permission) map[Permission]struct{} {
		m := make(map[Permission]struct{}, len(ps))
		for _, p := range ps {
			m[p] = struct{}{}
		}
		return m
	}

	rolePermissions := map[string]map[Permission]struct{}{
		RoleOwner: owner,
		RoleManager: set(
			PermViewMembers, PermManageMembers,
			PermViewFarms, PermManageFarms,
			PermViewFields, PermManageFields,
			PermViewCrops, PermManageCrops,
			PermViewHarvests, PermLogHarvests,
		),
		RoleGrower: set(
			PermViewFarms, PermManageFarms,
			PermViewFields, PermManageFields,
			PermViewCrops, PermManageCrops,
			PermViewHarvests, PermLogHarvests,
		),
		RoleViewer: set(
			PermViewFarms, PermViewFields,
			PermViewCrops, PermViewHarvests,
		),
	}
	return rolePermissions
}()

func HasPermission(role string, perm Permission) bool {
	if role == RoleOwner {
		return true
	}
	perms, ok := rolePermissions[role]
	if !ok {
		return false
	}
	_, has := perms[perm]
	return has
}
