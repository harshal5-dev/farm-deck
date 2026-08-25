import { createSlice } from "@reduxjs/toolkit";

/**
 * Holds the crop being edited, set from the list right before
 * navigating to /app/crops/edit — same pattern as selectedFarm/Zone.
 */
const selectedCropSlice = createSlice({
  name: "selectedCrop",
  initialState: {
    crop: null,
  },
  reducers: {
    setSelectedCrop: (state, action) => {
      state.crop = action.payload;
    },
    clearSelectedCrop: (state) => {
      state.crop = null;
    },
  },
});

export const { setSelectedCrop, clearSelectedCrop } =
  selectedCropSlice.actions;

export const selectSelectedCrop = (state) => state.selectedCrop.crop;

export default selectedCropSlice.reducer;
