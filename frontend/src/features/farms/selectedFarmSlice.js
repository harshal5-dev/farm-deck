import { createSlice } from "@reduxjs/toolkit";

const selectedFarmSlice = createSlice({
  name: "selectedFarm",
  initialState: {
    farm: null,
  },
  reducers: {
    setSelectedFarm: (state, action) => {
      state.farm = action.payload;
    },
    clearSelectedFarm: (state) => {
      state.farm = null;
    },
  },
});

export const { setSelectedFarm, clearSelectedFarm } =
  selectedFarmSlice.actions;

export const selectSelectedFarm = (state) => state.selectedFarm.farm;

export default selectedFarmSlice.reducer;
