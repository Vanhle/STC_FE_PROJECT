import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import OTPVerification from "./components/Auth/OTPVerification";
import ProjectManagement from "./components/Management/ProjectManagement";
import BuildingManagement from "./components/Management/BuildingManagement";
import ApartmentManagement from "./components/Management/ApartmentManagement";
import TrashManagement from "./components/Management/TrashManagement";
import DeactivatedManagement from "./components/Management/DeactivatedManagement";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import Toast from "./components/Common/Toast";
import CreateProject from "./components/CRUD/Projects/Create";
import ViewProject from "./components/CRUD/Projects/View";
import CreateBuilding from "./components/CRUD/Buildings/Create";
import ViewBuilding from "./components/CRUD/Buildings/View";
import CreateApartment from "./components/CRUD/Apartments/Create";
import ViewApartment from "./components/CRUD/Apartments/View";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Toast />
        <Routes>
          {/* Auth Routes - Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OTPVerification />} />

          {/* Dashboard Routes - Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard/projects" replace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/projects"
            element={
              <ProtectedRoute>
                <ProjectManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/buildings"
            element={
              <ProtectedRoute>
                <BuildingManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/apartments"
            element={
              <ProtectedRoute>
                <ApartmentManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/trash"
            element={
              <ProtectedRoute>
                <TrashManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/deactivated"
            element={
              <ProtectedRoute>
                <DeactivatedManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/projects/create"
            element={
              <ProtectedRoute>
                <CreateProject />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/projects/view/:id"
            element={
              <ProtectedRoute>
                <ViewProject />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/buildings/create"
            element={
              <ProtectedRoute>
                <CreateBuilding />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/buildings/view/:id"
            element={
              <ProtectedRoute>
                <ViewBuilding />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/apartments/create"
            element={
              <ProtectedRoute>
                <CreateApartment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/apartments/view/:id"
            element={
              <ProtectedRoute>
                <ViewApartment />
              </ProtectedRoute>
            }
          />

          {/* Default Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
