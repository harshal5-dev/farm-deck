import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/layout";

import {
  Login,
  AcceptInvitation,
  ProtectedRoute,
  PublicOnlyRoute,
} from "@/features/auth";
import { Dashboard } from "@/features/dashboard";
import { Profile } from "@/features/profile";
import {
  MembersList,
  AddMember,
  EditMember,
} from "@/features/members";
import { Home } from "@/features/home";
import NotFound from "@/pages/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicOnlyRoute><Home /></PublicOnlyRoute>} />
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/accept-invite" element={<AcceptInvitation />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="members" element={<MembersList />} />
            <Route path="members/new" element={<AddMember />} />
            <Route path="members/edit" element={<EditMember />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
