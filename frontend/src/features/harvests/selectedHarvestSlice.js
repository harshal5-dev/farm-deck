import { createSlice } from "@reduxjs/toolkit";

/**
 * Holds the harvest being edited, set from the list right before
 * navigating to /app/harvests/edit. Same pattern as
 * selectedFarm/Zone/Member/Cycle/DailyLog.
 */
const selectedHarvestSlice = createSlice({
  name: "selectedHarvest",
  initialState: {
    harvest: null,
  },
  reducers: {
    setSelectedHarvest: (state, action) => {
      state.harvest = action.payload;
    },
    clearSelectedHarvest: (state) => {
      state.harvest = null;
    },
  },
});

export const { setSelectedHarvest, clearSelectedHarvest } =
  selectedHarvestSlice.actions;

export const selectSelectedHarvest = (state) =>
  state.selectedHarvest.harvest;

export default selectedHarvestSlice.reducer;
