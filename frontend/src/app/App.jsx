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
