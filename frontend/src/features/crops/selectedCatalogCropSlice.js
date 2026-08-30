import { createSlice } from "@reduxjs/toolkit";

/**
 * Holds the catalog crop being edited, set from the catalog list
 * right before navigating to /app/crops/edit-crop. Same pattern as
 * selectedFarm/Zone/Member/Cycle.
 */
const selectedCatalogCropSlice = createSlice({
  name: "selectedCatalogCrop",
  initialState: {
    crop: null,
  },
  reducers: {
    setSelectedCatalogCrop: (state, action) => {
      state.crop = action.payload;
    },
    clearSelectedCatalogCrop: (state) => {
      state.crop = null;
    },
  },
});

export const { setSelectedCatalogCrop, clearSelectedCatalogCrop } =
  selectedCatalogCropSlice.actions;

export const selectSelectedCatalogCrop = (state) =>
  state.selectedCatalogCrop.crop;

export default selectedCatalogCropSlice.reducer;