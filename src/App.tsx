
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Teams from "./pages/Teams";
import TeamDetail from "./pages/TeamDetail";
import Matches from "./pages/Matches";
import MatchDetail from "./pages/MatchDetail";
import Players from "./pages/Players";
import Statistics from "./pages/Statistics";
import SignIn from "./pages/SignIn";
import RegisterTeam from "./pages/RegisterTeam";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:id" element={<TeamDetail />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/matches/:id" element={<MatchDetail />} />
          <Route path="/players" element={<Players />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route 
            path="/register-team" 
            element={
              <ProtectedRoute>
                <RegisterTeam />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute isAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
