import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginAdmin } from "../pages/LoginAdmin";
import AdminProvider from "../context/AdminContext";
import Home from "../pages/Home";

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/ingresar" element={<AdminProvider>
          <LoginAdmin />
        </AdminProvider>} />


      </Routes>
    </BrowserRouter>
  )
}

export default App
