import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminProvider from "./context/AdminContext";
import { ProductsProvider } from "./context/ProductsContext";
import CategoriesProvider from "./context/CategoryContext";
import { CartProvider } from "./context/CartContext";
import { ReservationProvider } from "./context/ReservationContext";
import { SecurityRoutes } from "./components/SecurityComponents/SecurityRoutes";
import { LoginAdmin } from "./pages/AuthPages/LoginAdmin";
import DashboardAdmin from "./pages/AdminPages/DashboardAdmin";
import AddCategory from "./pages/CategoryPages/AddCategory";
import AddProduct from "./pages/ProductPages/AddProduct";
import ImportProducts from "./pages/ProductPages/ImportProducts";
import ProductById from "./pages/ProductPages/ProductById";
import Products from "./pages/ProductPages/Products";
import { ProductDetail } from "./pages/ProductPages/ProductDetail";
import Home from "./pages/UserPages/Home";
import CartPage from "./pages/UserPages/CartPage";
import Contact from "./pages/UserPages/Contact";
import SubCategories from "./pages/CategoryPages/SubCategories";
import OrderProduct from "./pages/ProductPages/OrderProduct";
import ReservProduct from "./pages/ProductPages/ReservProduct";

const AppProviders = ({ children }) => (
  <AdminProvider>
    <ProductsProvider>
      <CategoriesProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </CategoriesProvider>
    </ProductsProvider>
  </AdminProvider>
);

const AdminProviders = ({ children }) => (
  <AdminProvider>
    <CategoriesProvider>
      <ProductsProvider>
        <SecurityRoutes>
          {children}
        </SecurityRoutes>
      </ProductsProvider>
    </CategoriesProvider>
  </AdminProvider>
);

const ReservProductProvider = ({ children }) => (
  <AdminProvider>
    <ProductsProvider>
      <ReservationProvider>
        {children}
      </ReservationProvider>
    </ProductsProvider>
  </AdminProvider>
)

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/contacto" element={<Contact />} />

        <Route
          path="/"
          element={
            <AppProviders>
              <Home />
            </AppProviders>
          }
        />

        <Route
          path="/ingresar"
          element={
            <AdminProvider>
              <LoginAdmin />
            </AdminProvider>
          }
        />

        <Route
          path="/panel-admin"
          element={
            <AdminProviders>
              <DashboardAdmin />
            </AdminProviders>
          }
        />

        <Route
          path="/agregar-categoria"
          element={
            <AdminProviders>
              <AddCategory />
            </AdminProviders>
          }
        />

        <Route
          path="/agregar-producto"
          element={
            <AdminProviders>
              <AddProduct />
            </AdminProviders>
          }
        />

        <Route
          path="/importar-productos"
          element={
            <AdminProviders>
              <ImportProducts />
            </AdminProviders>
          }
        />

        <Route
          path="/admin/categoria/:categoryId/subcategorias"
          element={
            <AdminProvider>
              <SubCategories />
            </AdminProvider>
          }
        />

        <Route
          path="/productos/:categoryId"
          element={
            <AppProviders>
              <Products />
            </AppProviders>
          }
        />

        <Route
          path="/admin/categoria/:categoryId"
          element={
            <AdminProviders>
              <Products />
            </AdminProviders>
          }
        />

        <Route
          path="/producto/:productId"
          element={
            <AppProviders>
              <ProductDetail />
            </AppProviders>
          }
        />

        <Route
          path="/editar-producto/:productId"
          element={
            <AdminProviders>
              <ProductById />
            </AdminProviders>
          }
        />

        <Route
          path="/producto/:productId"
          element={
            <AppProviders>
              <ProductById />
            </AppProviders>
          }
        />

        <Route
          path="/formulario-pedido"
          element={
            <AppProviders>
              <OrderProduct />
            </AppProviders>
          }
        />

        <Route
          path="/reservar/:productId"
          element={
            <ReservProductProvider>
              <ReservProduct />
            </ReservProductProvider>
          }
        />

        <Route
          path="/carrito"
          element={
            <CartProvider>
              <CartPage />
            </CartProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
