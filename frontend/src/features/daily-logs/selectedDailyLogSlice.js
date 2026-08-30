import { createSlice } from "@reduxjs/toolkit";

/**
 * Holds the daily log being edited, set from the list right before
 * navigating to /app/crops/cycle/:cycleId/logs/edit. Same pattern
 * as selectedFarm/Zone/Member/Cycle.
 */
const selectedDailyLogSlice = createSlice({
  name: "selectedDailyLog",
  initialState: {
    log: null,
  },
  reducers: {
    setSelectedDailyLog: (state, action) => {
      state.log = action.payload;
    },
    clearSelectedDailyLog: (state) => {
      state.log = null;
    },
  },
});

export const { setSelectedDailyLog, clearSelectedDailyLog } =
  selectedDailyLogSlice.actions;

export const selectSelectedDailyLog = (state) =>
  state.selectedDailyLog.log;

export default selectedDailyLogSlice.reducer;