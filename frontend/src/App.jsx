import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginAdmin } from "./pages/LoginAdmin";
import AdminProvider from "./context/adminContext";
import SecurityRoutes from "./components/SecurityRoutes";
import Home from "./pages/Home";
import DashboardAdmin from "./pages/DashboardAdmin";
import CategoriesProvider from "./context/CategoryContext";
import AddCategory from "./pages/AddCategory";
import AddProduct from "./pages/AddProduct";
import { ProductsProvider } from "./context/ProductsContext";

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<CategoriesProvider>
          <Home />
        </CategoriesProvider>} />

        <Route path="/ingresar" element={<AdminProvider>
          <LoginAdmin />
        </AdminProvider>} />

        <Route path="/panel-admin" element={<AdminProvider>
          <SecurityRoutes>
            <CategoriesProvider>
              <DashboardAdmin />
            </CategoriesProvider>
          </SecurityRoutes>
        </AdminProvider>} />

        <Route path="/agregar-categoria" element={<AdminProvider>
          <SecurityRoutes>
            <CategoriesProvider>
              <AddCategory />
            </CategoriesProvider>
          </SecurityRoutes>
        </AdminProvider>} />

        <Route path="/agregar-producto" element={<AdminProvider>
          <SecurityRoutes>
            <ProductsProvider>
              <CategoriesProvider>
                <AddProduct />
              </CategoriesProvider>
            </ProductsProvider>
          </SecurityRoutes>
        </AdminProvider>} />


      </Routes>
    </BrowserRouter>
  )
}

export default App
