import { createSlice, createSelector } from "@reduxjs/toolkit";
import { members as seedMembers } from "@/mocks";

/**
 * membersSlice — Redux source of truth for the workspace member list.
 *
 * Replaces the former MembersProvider context. State is seeded from the shared
 * mock and consumed in the members pages via useSelector / useDispatch. When
 * the real API lands, the reducers below become async thunks against
 * /tenants/{id}/members without changing the page-level call sites.
 *
 * Shape mirrors the @Member typedef in the old context.
 */

function makeId() {
  return `local-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

function deriveNameFromEmail(email) {
  const local = String(email).split("@")[0] || "user";
  return local
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const membersSlice = createSlice({
  name: "members",
  initialState: seedMembers,
  reducers: {
    // Prepend a new member built from the form values. id/timestamps are
    // generated in the prepare callback so the reducer stays pure.
    addMember: {
      reducer(state, action) {
        state.unshift(action.payload);
      },
      prepare(values) {
        const now = new Date().toISOString();
        return {
          payload: {
            id: makeId(),
            fullName:
              values.fullName?.trim() || deriveNameFromEmail(values.emailId),
            emailId: values.emailId,
            role: values.role,
            status: "active",
            joinedAt: now,
            lastActive: now,
          },
        };
      },
    },
    // Patch an existing member by id. Accepts (id, patch) at the call site,
    // matching the old context API.
    updateMember: {
      reducer(state, action) {
        const { id, ...patch } = action.payload;
        const member = state.find((m) => m.id === id);
        if (member) Object.assign(member, patch);
      },
      prepare(id, patch) {
        return { payload: { id, ...patch } };
      },
    },
    suspendMember(state, action) {
      const member = state.find((m) => m.id === action.payload);
      if (member) member.status = "suspended";
    },
    reinviteMember(state, action) {
      const member = state.find((m) => m.id === action.payload);
      if (member) member.status = "invited";
    },
  },
});

export const { addMember, updateMember, suspendMember, reinviteMember } =
  membersSlice.actions;

/** All members (root state shape: state.members is the array). */
export const selectMembers = (state) => state.members;

/** Look up a single member by id; null when not found. */
export const selectMemberById = createSelector(
  [selectMembers, (_state, id) => id],
  (members, id) => members.find((m) => m.id === id) || null,
);

export default membersSlice.reducer;
