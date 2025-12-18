import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginAdmin } from "../pages/LoginAdmin";
import AdminProvider from "../context/adminContext";
import SecurityRoutes from "../components/SecurityRoutes";
import Home from "../pages/Home";
import DashboardAdmin from "../pages/DashboardAdmin";

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/ingresar" element={<AdminProvider>
          <LoginAdmin />
        </AdminProvider>} />

        <Route path="/dashboard" element={<AdminProvider>
          <SecurityRoutes>
            <DashboardAdmin />
          </SecurityRoutes>
        </AdminProvider>} />


      </Routes>
    </BrowserRouter>
  )
}

export default App
