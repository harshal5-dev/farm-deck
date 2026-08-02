import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/layout";
import ProtectedRoute, {
  PublicOnlyRoute,
} from "@/components/auth/ProtectedRoute";

// Public
import Landing from "@/pages/Landing";
import Login from "@/pages/auth/Login";
import ProfilePreview from "@/pages/_ProfilePreview"; // TEMP preview route

// Protected (app)
import Dashboard from "@/pages/Dashboard";
import Farms from "@/pages/Farms";
import FarmDetail from "@/pages/FarmDetail";
import FarmFormPage from "@/pages/FarmFormPage";
import Fields from "@/pages/Fields";
import FieldFormPage from "@/pages/FieldFormPage";
import Crops from "@/pages/Crops";
import Harvest from "@/pages/Harvest";
import Profile from "@/pages/Profile";
import FarmType from "../features/resources/farm-type/FarmType";
import SystemTypes from "../pages/SystemTypes";
import CropCategories from "../pages/CropCategories";
import SoilType from "@/features/resources/soil-type/SoilType";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/__profile" element={<ProfilePreview />} /> {/* TEMP */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />

        {/* Protected app — everything under /app requires auth */}
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="farms" element={<Farms />} />
            <Route path="farms/new" element={<FarmFormPage mode="create" />} />
            <Route path="farms/:farmId" element={<FarmDetail />} />
            <Route
              path="farms/:farmId/edit"
              element={<FarmFormPage mode="edit" />}
            />
            <Route path="fields" element={<Fields />} />
            <Route
              path="fields/new"
              element={<FieldFormPage mode="create" />}
            />
            <Route
              path="fields/:fieldId/edit"
              element={<FieldFormPage mode="edit" />}
            />
            <Route path="soil-types" element={<SoilType />} />
            <Route path="farm-types" element={<FarmType />} />
            <Route path="system-types" element={<SystemTypes />} />
            <Route path="crop-categories" element={<CropCategories />} />
            <Route path="crops" element={<Crops />} />
            <Route path="harvest" element={<Harvest />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
