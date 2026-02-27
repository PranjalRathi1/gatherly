import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useTheme } from "@/hooks/useTheme";

// Pages
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import Events from "@/pages/Events";
import EventChat from "@/pages/EventChat";
import AfterglowPage from "@/pages/Afterglow";
import Profile from "@/pages/Profile";
import ManageEvent from "@/pages/ManageEvent";
import PenguinCompanion from "@/components/PenguinCompanion";
import ErrorBoundary from "@/components/ErrorBoundary";
import CreateEvent from "@/pages/CreateEvent";
import AdminDashboard from "@/pages/AdminDashboard";

import { useEffect, useRef } from "react";
import authApi from "@/api/auth";
import { useToast } from "@/hooks/use-toast";

function App() {
  useTheme();

  const { user, setUser, isAuthenticated } = useAuthStore();
  const { toast } = useToast();

  // Track previous creator status
  const previousStatus = useRef(user?.creatorRequestStatus);

  /* ==================================================
     🔥 AUTO ROLE + STATUS REFRESH SYSTEM
  =================================================== */
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        const updatedUser = await authApi.getMe();

        // If status changed → notify user
        if (
          previousStatus.current &&
          previousStatus.current !== updatedUser.creatorRequestStatus
        ) {
          if (updatedUser.creatorRequestStatus === "approved") {
            toast({
              title: "🎉 Creator Approved!",
              description: "You can now create events.",
            });
          }

          if (updatedUser.creatorRequestStatus === "rejected") {
            toast({
              title: "❌ Request Rejected",
              description: "Your creator access request was rejected.",
              variant: "destructive",
            });
          }
        }

        // Save new status
        previousStatus.current = updatedUser.creatorRequestStatus;

        // Update Zustand store (auto unlocks UI)
        setUser(updatedUser);

      } catch (err) {
        console.error("User auto-refresh failed");
      }
    }, 5000); // check every 5 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen overflow-hidden transition-colors duration-500">

        {/* ─── BACKGROUND LAYER ─── */}
        <div className="fixed inset-0 -z-10 pointer-events-none">

          {/* Light Theme */}
          <div className="absolute inset-0 dark:hidden bg-gradient-to-br from-[#f2f2f2] via-[#f5f5f4] to-[#efe5cf]" />
          <div
            className="absolute inset-0 dark:hidden"
            style={{
              background: "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.65), transparent 58%)"
            }}
          />
          <svg
            className="absolute inset-0 w-full h-full dark:hidden"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.025 }}
          >
            <defs>
              <pattern id="dots-light" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#92400e" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots-light)" />
          </svg>

          {/* Dark Theme */}
          <div className="absolute inset-0 hidden dark:block bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b]" />
          <div
            className="absolute inset-0 hidden dark:block"
            style={{
              background: "radial-gradient(circle at 80% 20%, rgba(59,130,246,0.15), transparent 58%)"
            }}
          />
          <svg
            className="absolute inset-0 w-full h-full hidden dark:block"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.045 }}
          >
            <defs>
              <pattern id="dots-dark" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#93c5fd" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots-dark)" />
          </svg>

        </div>

        {/* ─── ROUTER ─── */}
        <Router>
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/events" /> : <Login />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/events" /> : <Signup />} />

            <Route path="/events" element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            } />

            <Route path="/events/:eventId/chat" element={
              <ProtectedRoute>
                <EventChat />
              </ProtectedRoute>
            } />

            <Route path="/events/create" element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            } />

            <Route path="/events/:id/manage" element={
              <ProtectedRoute>
                <ManageEvent />
              </ProtectedRoute>
            } />

            <Route path="/afterglow" element={<AfterglowPage />} />

            <Route path="/profile/:userId?" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/" element={<Navigate to={isAuthenticated ? "/events" : "/login"} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          {isAuthenticated && <PenguinCompanion />}
        </Router>
      </div>
    </ErrorBoundary>
  );
}

export default App;