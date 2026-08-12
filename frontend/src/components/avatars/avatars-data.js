/**
 * Avatar data — constants and helpers shared across avatar consumers.
 *
 * Kept separate from avatars.jsx so that file only exports components,
 * which lets Fast Refresh apply cleanly.
 */
import {
  Farmer,
  Gardener,
  Cow,
  Hen,
  Pig,
  Lamb,
  Horse,
  Bee,
  Fox,
  Scarecrow,
  Mushroom,
  Pumpkin,
  Rooster,
  Goat,
  Owl,
  Strawberry,
  Tomato,
  Wheat,
} from "./avatars";

export const FARM_AVATARS = [
  { id: "farmer", label: "Farmer", Component: Farmer },
  { id: "gardener", label: "Gardener", Component: Gardener },
  { id: "cow", label: "Cow", Component: Cow },
  { id: "hen", label: "Hen", Component: Hen },
  { id: "pig", label: "Pig", Component: Pig },
  { id: "lamb", label: "Lamb", Component: Lamb },
  { id: "horse", label: "Horse", Component: Horse },
  { id: "bee", label: "Bee", Component: Bee },
  { id: "fox", label: "Fox", Component: Fox },
  { id: "scarecrow", label: "Scarecrow", Component: Scarecrow },
  { id: "mushroom", label: "Mushroom", Component: Mushroom },
  { id: "pumpkin", label: "Pumpkin", Component: Pumpkin },
  { id: "rooster", label: "Rooster", Component: Rooster },
  { id: "goat", label: "Goat", Component: Goat },
  { id: "owl", label: "Owl", Component: Owl },
  { id: "strawberry", label: "Strawberry", Component: Strawberry },
  { id: "tomato", label: "Tomato", Component: Tomato },
  { id: "wheat", label: "Wheat", Component: Wheat },
];

export const DEFAULT_AVATAR_ID = "farmer";

export function getAvatar(id) {
  return FARM_AVATARS.find((a) => a.id === id) || FARM_AVATARS[0];
}
