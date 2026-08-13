import { useContext } from "react";
import { MembersContext } from "./context";

/**
 * useMembers — read the workspace member store + actions.
 * Must be used inside a <MembersProvider>.
 *
 * @returns {{
 *   members: import("./context").Member[],
 *   addMember: (values: Partial<import("./context").Member>) => string,
 *   updateMember: (id: string, patch: Partial<import("./context").Member>) => void,
 *   suspendMember: (id: string) => void,
 *   reinviteMember: (id: string) => void,
 *   getMember: (id: string) => import("./context").Member | null,
 * }}
 */
export function useMembers() {
  const ctx = useContext(MembersContext);
  if (!ctx) {
    throw new Error("useMembers must be used within a <MembersProvider>");
  }
  return ctx;
}
