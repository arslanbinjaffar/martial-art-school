import { Routes, Route } from "react-router-dom";
import {
  Login,
  VerifyOtp,
  Dashboard,
  Home,
  CreateUser,
  Membership,
  Classes,
  Booking,
  QrCode,
  Settings,
  PaymentAndWallet,
  CreateCreditCard,
  ErrorPage404,
} from "../screens/pages";
import ForgetPassword from "../screens/ForgetPassword/ForgetPasword";
import Otp from "../screens/ForgetPassword/Otp/Otp";
import CreatePassword from "../screens/ForgetPassword/CreatePassword/CreatePassword";
import CreateSchool from "../screens/CreateSchool/CreateSchool";
import AppLayout from "../components/Layout/Layout";
import EditSchool from "../screens/CreateSchool/EditSchool/EditSchool";
import CreateBranch from "../screens/Branches/CreateBranch/CreateBranch";
import EditBranch from "../screens/Branches/EditBranch/EditBranch";
import ListBranch from "../screens/Branches/ListBranch/ListBranch";
import ListFranchise from "../screens/Franchise/ListFranchise/ListFranchise";
import CreateFranchise from "../screens/Franchise/CreateFranchise/CreateFranchise";
import EditFranchise from "../screens/Franchise/EditFranchise/EditFranchise";

function AppRoutes() {
  return (
    <>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<CreateUser />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/register/verify-otp" element={<Otp />} />
        <Route
          path="/register/create-new-password"
          element={<CreatePassword />}
        />

        {/* Core App Routes with AppLayout */}
        <Route
          path="/"
          element={
            <AppLayout>
              <Home />
            </AppLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/school/create"
          element={
            <AppLayout>
              <CreateSchool />
            </AppLayout>
          }
        />
        <Route
          path="/school/edit/:schoolId"
          element={
            <AppLayout>
              <EditSchool />
            </AppLayout>
          }
        />
        <Route
          path="/branch/list"
          element={
            <AppLayout>
              <ListBranch />
            </AppLayout>
          }
        />
        <Route
          path="/branch/create"
          element={
            <AppLayout>
              <CreateBranch />
            </AppLayout>
          }
        />
        <Route
          path="/branch/edit/:branchId"
          element={
            <AppLayout>
              <EditBranch />
            </AppLayout>
          }
        />
        <Route
          path="/franchise/list"
          element={
            <AppLayout>
              <ListFranchise />
            </AppLayout>
          }
        />
        <Route
          path="/franchise/create"
          element={
            <AppLayout>
              <CreateFranchise />
            </AppLayout>
          }
        />
        <Route
          path="/franchise/edit/:franchiseId"
          element={
            <AppLayout>
              <EditFranchise />
            </AppLayout>
          }
        />

        {/* Membership & Payment Routes */}
        <Route
          path="/membership"
          element={
            <AppLayout>
              <Membership />
            </AppLayout>
          }
        />
        <Route
          path="/payment"
          element={
            <AppLayout>
              <PaymentAndWallet />
            </AppLayout>
          }
        />
        <Route
          path="/credit-card/create"
          element={
            <AppLayout>
              <CreateCreditCard />
            </AppLayout>
          }
        />

        {/* Martial Arts Classes, Bookings & Passes */}
        <Route
          path="/classes"
          element={
            <AppLayout>
              <Classes />
            </AppLayout>
          }
        />
        <Route
          path="/booking"
          element={
            <AppLayout>
              <Booking />
            </AppLayout>
          }
        />
        <Route
          path="/qr-code"
          element={
            <AppLayout>
              <QrCode />
            </AppLayout>
          }
        />

        {/* Settings Routes */}
        <Route
          path="/setting"
          element={
            <AppLayout>
              <Settings />
            </AppLayout>
          }
        />

        {/* 404 Catch All */}
        <Route path="*" element={<ErrorPage404 />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
