import { createSlice } from "@reduxjs/toolkit";

/**
 * Holds the cycle being edited, set from the list right before
 * navigating to /app/crops/edit. Same pattern as
 * selectedFarm/Zone/Member — the page reads it to populate the form
 * defaults, and clears it on submit/cancel.
 */
const selectedCycleSlice = createSlice({
  name: "selectedCycle",
  initialState: {
    cycle: null,
  },
  reducers: {
    setSelectedCycle: (state, action) => {
      state.cycle = action.payload;
    },
    clearSelectedCycle: (state) => {
      state.cycle = null;
    },
  },
});

export const { setSelectedCycle, clearSelectedCycle } =
  selectedCycleSlice.actions;

export const selectSelectedCycle = (state) => state.selectedCycle.cycle;

export default selectedCycleSlice.reducer;