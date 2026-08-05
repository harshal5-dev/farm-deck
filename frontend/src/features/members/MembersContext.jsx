import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { members as seedMembers } from "@/data/mock";

/**
 * MembersContext — local source of truth for the workspace member list.
 *
 * The data is seeded from the shared mock and lives in React state so add /
 * update / remove actions from any sub-page (Members, AddMember, EditMember)
 * stay in sync without prop-drilling. When the real API lands, swap the
 * internal `useState` for an RTK Query slice and keep the same surface.
 *
 * @typedef {Object} Member
 * @property {string} id
 * @property {string} fullName
 * @property {string} emailId
 * @property {"owner"|"manager"|"grower"|"viewer"} role
 * @property {"active"|"invited"|"suspended"} status
 * @property {string} [avatarId]
 * @property {string} joinedAt
 * @property {string} [lastActive]
 * @property {string} [invitedBy]
 */

const MembersContext = createContext(null);

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

  const removeMember = useCallback((id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const getMember = useCallback(
    (id) => members.find((m) => m.id === id) || null,
    [members]
  );

  const value = useMemo(
    () => ({ members, addMember, updateMember, removeMember, getMember }),
    [members, addMember, updateMember, removeMember, getMember]
  );

  return (
    <MembersContext.Provider value={value}>{children}</MembersContext.Provider>
  );
}

export function useMembers() {
  const ctx = useContext(MembersContext);
  if (!ctx) {
    throw new Error("useMembers must be used within a <MembersProvider>");
  }
  return ctx;
}
