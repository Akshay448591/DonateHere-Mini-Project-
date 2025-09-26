import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/DashboardPage";

import CreateFundraiserStep1 from "./pages/CreateFundraiserStep1";
import CreateFundraiserStep2 from "./pages/CreateFundraiserStep2";
import CreateFundraiserStep3 from "./pages/CreateFundraiserStep3";

import FundraiserDashboard from "./pages/FundraiserDashboard";
import AdminDashboardFundraisers from "./pages/AdminDashboardFundraisers";
import SuperAdminDashboardFundraisers from "./pages/SuperAdminDashboardFundraisers";
import SuperAdminPublishedFundraisers from "./pages/SuperAdminPublishedFundraisers";
import ProfilePage from "./pages/ProfilePage"; 
import PublishedFundraisers from "./pages/PublishedFundraisers"; 
import FundraiserPage from "./pages/FundraiserPage"; 

// SuperAdmin pages
import SuperAdminHandleAdmins from "./pages/SuperAdminHandleAdmins";

// Categories
import Categories from "./components/Categories";
import CategoryPage from "./pages/CategoryPage";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ Stripe publishable key
const stripePromise = loadStripe("pk_test_XXXX"); // Replace with your Stripe publishable key

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        {/* Navbar */}
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

        {/* Toast notifications */}
        <ToastContainer position="top-right" autoClose={3000} />

        <Routes>
          {/* Landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* Categories */}
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:category" element={<CategoryPage />} />

          {/* Signup */}
          <Route path="/signup" element={<SignupPage />} />

          {/* Login */}
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />

          {/* Dashboard (all roles) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["user", "admin", "superadmin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Fundraiser creation steps */}
          <Route
            path="/create-fundraiser/step1"
            element={
              <ProtectedRoute roles={["user"]}>
                <CreateFundraiserStep1 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-fundraiser/step2"
            element={
              <ProtectedRoute roles={["user"]}>
                <CreateFundraiserStep2 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-fundraiser/step3"
            element={
              <ProtectedRoute roles={["user"]}>
                <CreateFundraiserStep3 />
              </ProtectedRoute>
            }
          />

          {/* Fundraiser dashboards */}
          <Route
            path="/my-fundraisers"
            element={
              <ProtectedRoute roles={["user"]}>
                <FundraiserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/fundraisers"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboardFundraisers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/fundraisers"
            element={
              <ProtectedRoute roles={["superadmin"]}>
                <SuperAdminDashboardFundraisers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/published-fundraisers"
            element={
              <ProtectedRoute roles={["superadmin"]}>
                <SuperAdminPublishedFundraisers />
              </ProtectedRoute>
            }
          />

          {/* SuperAdmin: Handle Admins */}
          <Route
            path="/superadmin/handle-admins"
            element={
              <ProtectedRoute roles={["superadmin"]}>
                <SuperAdminHandleAdmins />
              </ProtectedRoute>
            }
          />

          {/* Profile (all roles) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={["user", "admin", "superadmin"]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Published Fundraisers / Donation page */}
          <Route path="/fundraisers/published" element={<PublishedFundraisers />} />

          {/* Fundraiser details page */}
          <Route path="/fundraiser/:id" element={<FundraiserPage />} />
        </Routes>
      </BrowserRouter>
    </Elements>
  );
}

export default App;
