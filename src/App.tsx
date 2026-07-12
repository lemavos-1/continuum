import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { UsageProvider } from "@/contexts/UsageContext";
import { EntityProvider } from "@/contexts/EntityContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Loader2 } from "@/lib/heroicons";
import { extractAuthTokensFromLocation, sanitizeAuthRedirectUrl } from "@/lib/auth-redirect";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const GoogleCallback = lazy(() => import("./pages/GoogleCallback"));
const LoginSuccess = lazy(() => import("./pages/LoginSuccess"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Notes = lazy(() => import("./pages/Notes"));
const NoteEditor = lazy(() => import("./pages/NoteEditor"));
const Entities = lazy(() => import("./pages/Entities"));
const EntityDetail = lazy(() => import("./pages/EntityDetail"));
const KnowledgeGraph = lazy(() => import("./pages/KnowledgeGraph"));
const Vault = lazy(() => import("./pages/Vault"));
const VaultDownload = lazy(() => import("./pages/VaultDownload"));
const Activities = lazy(() => import("./pages/Activities"));
const Projects = lazy(() => import("./pages/Projects"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Support = lazy(() => import("./pages/Support"));
const About = lazy(() => import("./pages/About"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Subscription = lazy(() => import("./pages/Subscription"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Insights = lazy(() => import("./pages/Insights"));

const PageFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
  </div>
);

const queryClient = new QueryClient();

function HomeRoute() {
  const { user, loading } = useAuth();
  sanitizeAuthRedirectUrl();
  const authTokens = extractAuthTokensFromLocation();

  if (authTokens?.accessToken) {
    return <LoginSuccess />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (user) return <Dashboard />;
  return <LandingPage />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomeRoute />} />
    <Route path="/index" element={<HomeRoute />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
    <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
    <Route path="/google-callback" element={<GoogleCallback />} />
    <Route path="/login-successful" element={<LoginSuccess />} />
    <Route path="/login-token" element={<LoginSuccess />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/support" element={<Support />} />
    <Route path="/about" element={<About />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
    <Route path="/notes/:id" element={<ProtectedRoute><NoteEditor /></ProtectedRoute>} />
    <Route path="/entities" element={<ProtectedRoute><Entities /></ProtectedRoute>} />
    <Route path="/entities/:id" element={<ProtectedRoute><EntityDetail /></ProtectedRoute>} />
    {/* Activity Routes */}
    <Route path="/tracking" element={<Navigate to="/activities" replace />} />
    <Route path="/activities" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
    <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
    {/* Analytics Routes */}
    <Route path="/tracking/:id" element={<ProtectedRoute><EntityDetail /></ProtectedRoute>} />
    <Route path="/activities/:id" element={<ProtectedRoute><EntityDetail /></ProtectedRoute>} />
    <Route path="/projects/:id" element={<ProtectedRoute><EntityDetail /></ProtectedRoute>} />
    <Route path="/graph" element={<ProtectedRoute><KnowledgeGraph /></ProtectedRoute>} />
    <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
    <Route path="/vault" element={<ProtectedRoute><Vault /></ProtectedRoute>} />
    <Route path="/vault/download/:fileId" element={<ProtectedRoute><VaultDownload /></ProtectedRoute>} />
    <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <LanguageProvider>
            <AuthProvider>
              <UsageProvider>
                <EntityProvider>
                  <AppRoutes />
                </EntityProvider>
              </UsageProvider>
            </AuthProvider>
          </LanguageProvider>
        </HashRouter>
      </TooltipProvider>
    </ThemeProvider>
    <Analytics />
    <SpeedInsights />
  </QueryClientProvider>
);

export default App;
