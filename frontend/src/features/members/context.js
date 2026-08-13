import { createContext } from "react";

/**
 * MembersContext — bare context holding the workspace member store.
 *
 * The provider (`MembersProvider`) supplies the value; consumers read it via
 * the `useMembers()` hook. Splitting the context out (matching the theme/auth
 * provider convention) keeps the `createContext` reference stable so fast
 * refresh and memoization behave predictably.
 *
 * @typedef {Object} Member
 * @property {string} id
 * @property {string} fullName
 * @property {string} emailId
 * @property {"manager"|"grower"|"viewer"} role
 * @property {"active"|"invited"|"suspended"} status
 * @property {string} [avatarId]
 * @property {string} joinedAt
 * @property {string} [lastActive]
 * @property {string} [invitedBy]
 */
export const MembersContext = createContext(null);
