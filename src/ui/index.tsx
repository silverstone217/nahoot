import "./index.css";
import { Navigate, Route, Routes } from "react-router";
import App from "./App.tsx";
import Admin from "./pages/Admin.tsx";
import Test from "./pages/Test.tsx";
import AuthLogin from "./pages/AuthLogin.tsx";
import Competitions from "./pages/Competitions.tsx";
import Nouvelle from "./pages/Nouvelle.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import { useStore } from "./lib/store.ts";
import { useEffect } from "react";

const Index = () => {
  const { setToken } = useStore();

  useEffect(() => {
    const getToken = () => {
      const tok = localStorage.getItem("token");
      if (tok) {
        setToken(tok);
        // navigate("/admin");
      } else {
        setToken(null);
      }
    };
    getToken();
  }, [setToken]);

  return (
    <Routes>
      <Route path="/" element={<App />} />

      <Route path="/admin" element={<Admin />}>
        {/* Redirection vers /admin/dashboard */}
        <Route index element={<Navigate to="/admin/dashboard" />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/competitions" element={<Competitions />} />
        <Route path="/admin/nouvelle" element={<Nouvelle />} />
      </Route>

      <Route path="/test" element={<Test />} />
      <Route path="/connexion" element={<AuthLogin />} />
    </Routes>
  );
};

export default Index;
