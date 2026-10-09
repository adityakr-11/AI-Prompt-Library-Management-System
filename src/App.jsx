import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Prompts from "./pages/Prompts";
import Favorites from "./pages/Favorites";
import AddPrompt from "./pages/AddPrompt";
import PromptDetails from "./pages/PromptDetails";
import EditPrompt from "./pages/EditPrompt";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AIAssistant from "./pages/AIAssistant";

import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { PromptProvider } from "./context/PromptContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PromptProvider>
          <FavoritesProvider>
            <Routes>
              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Application Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/prompts"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Prompts />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Favorites />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/add-prompt"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AddPrompt />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/prompts/:id"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <PromptDetails />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/prompts/:id/edit"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <EditPrompt />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/ai-assistant"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AIAssistant />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </FavoritesProvider>
        </PromptProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;