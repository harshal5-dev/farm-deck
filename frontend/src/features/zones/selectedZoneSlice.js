import { createSlice } from "@reduxjs/toolkit";

/**
 * Holds the zone being edited, set from the list right before
 * navigating to /app/fields/edit — same pattern as selectedFarm.
 */
const selectedZoneSlice = createSlice({
  name: "selectedZone",
  initialState: {
    zone: null,
  },
  reducers: {
    setSelectedZone: (state, action) => {
      state.zone = action.payload;
    },
    clearSelectedZone: (state) => {
      state.zone = null;
    },
  },
});

export const { setSelectedZone, clearSelectedZone } =
  selectedZoneSlice.actions;

export const selectSelectedZone = (state) => state.selectedZone.zone;

export default selectedZoneSlice.reducer;
