import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  Login,
  VerifyOtp,
  Dashboard,
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
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<CreateUser />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/register/verify-otp" element={<Otp />} />
      <Route path="/register/create-new-password" element={<CreatePassword />} />

      {/* Main App Layout Shell with smooth persistent sidebar & header */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* School & Franchise Management */}
        <Route path="/school/create" element={<CreateSchool />} />
        <Route path="/school/edit/:schoolId" element={<EditSchool />} />
        <Route path="/branch/list" element={<ListBranch />} />
        <Route path="/branch/create" element={<CreateBranch />} />
        <Route path="/branch/edit/:branchId" element={<EditBranch />} />
        <Route path="/franchise/list" element={<ListFranchise />} />
        <Route path="/franchise/create" element={<CreateFranchise />} />
        <Route path="/franchise/edit/:franchiseId" element={<EditFranchise />} />

        {/* Membership & Payment */}
        <Route path="/membership" element={<Membership />} />
        <Route path="/payment" element={<PaymentAndWallet />} />
        <Route path="/credit-card/create" element={<CreateCreditCard />} />

        {/* Martial Arts Classes, Bookings & Passes */}
        <Route path="/classes" element={<Classes />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/qr-code" element={<QrCode />} />

        {/* Settings */}
        <Route path="/setting" element={<Settings />} />
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<ErrorPage404 />} />
    </Routes>
  );
}

export default AppRoutes;
