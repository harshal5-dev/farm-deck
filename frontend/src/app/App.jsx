import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/layout";

import {
  Login,
  AcceptInvitation,
  ProtectedRoute,
  PublicOnlyRoute,
  AppAuthGate,
} from "@/features/auth";
import { Dashboard } from "@/features/dashboard";
import { Profile } from "@/features/profile";
import {
  MembersList,
  AddMember,
  EditMember,
} from "@/features/members";
import {
  FarmsList,
  AddFarm,
  EditFarm,
} from "@/features/farms";
import {
  FieldsList,
  AddField,
  EditField,
} from "@/features/fields";
import {
  CropsList,
  AddCrop,
  EditCrop,
  AddCycle,
  EditCycle,
} from "@/features/crops";
import {
  DailyLogsList,
  AddDailyLog,
  EditDailyLog,
} from "@/features/daily-logs";
import {
  HarvestsList,
  AddHarvest,
  EditHarvest,
} from "@/features/harvests";
import { FarmSetup } from "@/features/setup";
import { Lookups } from "@/features/lookups";
import { Home } from "@/features/home";
import NotFound from "@/pages/NotFound";

const App = () => {
  return (
    <BrowserRouter>
    <AppAuthGate>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/accept-invite" element={<AcceptInvitation />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="farms" element={<FarmsList />} />
            <Route path="farms/new" element={<AddFarm />} />
            <Route path="farms/edit" element={<EditFarm />} />
            <Route path="fields" element={<FieldsList />} />
            <Route path="fields/new" element={<AddField />} />
            <Route path="fields/edit" element={<EditField />} />
<Route path="crops" element={<CropsList />} />
          {/* Catalog (crops table) routes */}
          <Route path="crops/catalog/new" element={<AddCrop />} />
          <Route path="crops/edit-crop" element={<EditCrop />} />
          {/* Cycle routes */}
          <Route path="crops/cycle/new" element={<AddCycle />} />
          <Route path="crops/cycle/edit" element={<EditCycle />} />
          {/* Daily-log routes — nested under each cycle */}
          <Route path="crops/cycle/:cycleId/logs" element={<DailyLogsList />} />
          <Route path="crops/cycle/:cycleId/logs/new" element={<AddDailyLog />} />
          <Route path="crops/cycle/:cycleId/logs/edit" element={<EditDailyLog />} />
          {/* Harvest routes */}
          <Route path="harvests" element={<HarvestsList />} />
          <Route path="harvests/new" element={<AddHarvest />} />
          <Route path="harvests/edit" element={<EditHarvest />} />
            <Route path="setup" element={<FarmSetup />} />
            <Route path="members" element={<MembersList />} />
            <Route path="members/new" element={<AddMember />} />
            <Route path="members/edit" element={<EditMember />} />
            <Route path="lookups" element={<Lookups />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
        </Routes>
    </AppAuthGate>
    </BrowserRouter>
  );
};

export default App;
