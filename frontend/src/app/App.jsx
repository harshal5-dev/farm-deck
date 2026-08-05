import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/layout";
import {
  ProtectedRoute,
  PublicOnlyRoute,
  MembersLayout,
} from "@/app/router-helpers";

import { Login, ForgotPassword, Verify, ResetPassword } from "@/features/auth";
import { Dashboard } from "@/features/dashboard";
import { Profile } from "@/features/profile";
import { FarmList, FarmDetail, FarmFormPage } from "@/features/farms";
import { FieldList, FieldFormPage } from "@/features/fields";
import {
  MembersList,
  AddMember,
  EditMember,
} from "@/features/members";
import { FarmType } from "@/features/lookups/farm-type";
import { SoilType } from "@/features/lookups/soil-type";
import { SystemTypes } from "@/features/lookups/system-type";
import { CropCategories } from "@/features/lookups/crop-category";
import { Crops, Harvest } from "@/features/lookups/crop";
import { Home } from "@/features/home";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicOnlyRoute>
              <ForgotPassword />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/verify"
          element={
            <PublicOnlyRoute>
              <Verify />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicOnlyRoute>
              <ResetPassword />
            </PublicOnlyRoute>
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="farms" element={<FarmList />} />
            <Route path="farms/new" element={<FarmFormPage mode="create" />} />
            <Route path="farms/:farmId" element={<FarmDetail />} />
            <Route
              path="farms/:farmId/edit"
              element={<FarmFormPage mode="edit" />}
            />
            <Route path="fields" element={<FieldList />} />
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
            <Route element={<MembersLayout />}>
              <Route path="members" element={<MembersList />} />
              <Route path="members/new" element={<AddMember />} />
              <Route path="members/:memberId/edit" element={<EditMember />} />
            </Route>
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
