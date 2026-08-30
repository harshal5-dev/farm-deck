import CropsList from "./pages/CropsList";
import AddCycle from "./pages/AddCycle";
import EditCycle from "./pages/EditCycle";
import AddCrop from "./pages/AddCrop";
import EditCrop from "./pages/EditCrop";
import { cropApi } from "./cropApi";
import selectedCycleReducer, {
  setSelectedCycle,
  clearSelectedCycle,
  selectSelectedCycle,
} from "./selectedCycleSlice";
import selectedCatalogCropReducer, {
  setSelectedCatalogCrop,
  clearSelectedCatalogCrop,
  selectSelectedCatalogCrop,
} from "./selectedCatalogCropSlice";

export {
  /* Page components */
  CropsList,
  AddCycle,
  EditCycle,
  AddCrop,
  EditCrop,
  /* API slice */
  cropApi,
  /* Cycle slice */
  selectedCycleReducer,
  setSelectedCycle,
  clearSelectedCycle,
  selectSelectedCycle,
  /* Catalog crop slice */
  selectedCatalogCropReducer,
  setSelectedCatalogCrop,
  clearSelectedCatalogCrop,
  selectSelectedCatalogCrop,
};