import { useCallback, useMemo, useState } from "react";
import { members as seedMembers } from "@/mocks";
import { MembersContext } from "./context";

/**
 * MembersProvider — local source of truth for the workspace member list.
 *
 * Data is seeded from the shared mock and lives in React state so add /
 * update / remove actions from any sub-page (Members, AddMember, EditMember)
 * stay in sync without prop-drilling. When the real API lands, swap the
 * internal `useState` for an RTK Query slice and keep the same surface.
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

export function MembersProvider({ children }) {
  const [members, setMembers] = useState(seedMembers);

  const addMember = useCallback((values) => {
    const id = makeId();
    setMembers((prev) => [
      {
        id,
        fullName: values.fullName?.trim() || deriveNameFromEmail(values.emailId),
        emailId: values.emailId,
        role: values.role,
        status: "active",
        joinedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      },
      ...prev,
    ]);
    return id;
  }, []);

  const updateMember = useCallback((id, patch) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
    );
  }, []);

  const suspendMember = useCallback((id) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "suspended" } : m))
    );
  }, []);

  const reinviteMember = useCallback((id) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "invited" } : m))
    );
  }, []);

  const getMember = useCallback(
    (id) => members.find((m) => m.id === id) || null,
    [members]
  );

  const value = useMemo(
    () => ({
      members,
      addMember,
      updateMember,
      suspendMember,
      reinviteMember,
      getMember,
    }),
    [
      members,
      addMember,
      updateMember,
      suspendMember,
      reinviteMember,
      getMember,
    ]
  );

  return (
    <MembersContext.Provider value={value}>{children}</MembersContext.Provider>
  );
}
