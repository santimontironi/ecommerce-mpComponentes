import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginAdmin } from "./pages/LoginAdmin";
import AdminProvider from "./context/AdminContext";
import SecurityRoutes from "./components/SecurityRoutes";
import Home from "./pages/Home";
import DashboardAdmin from "./pages/DashboardAdmin";
import CategoriesProvider from "./context/CategoryContext";
import AddCategory from "./pages/AddCategory";
import AddProduct from "./pages/AddProduct";
import { ProductsProvider } from "./context/ProductsContext";
import ProductById from "./pages/ProductById";
import Products from "./pages/Products";
import SubCategories from "./pages/SubCategories";
import ImportProducts from "./pages/ImportProducts";
import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/CartPage";
import Contact from "./pages/Contact";

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/contacto" element={<Contact />} />

        <Route path="/" element={<CategoriesProvider>
          <CartProvider>
            <Home />
          </CartProvider>
        </CategoriesProvider>} />

        <Route path="/ingresar" element={<AdminProvider>
          <LoginAdmin />
        </AdminProvider>} />

        <Route path="/panel-admin" element={<AdminProvider>
          <SecurityRoutes>
            <CategoriesProvider>
              <ProductsProvider>
                <DashboardAdmin />
              </ProductsProvider>
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

        <Route path="/categoria/:categoryId" element={<AdminProvider>
          <CategoriesProvider>
            <ProductsProvider>
              <SecurityRoutes>
                <Products />
              </SecurityRoutes>
            </ProductsProvider>
          </CategoriesProvider>
        </AdminProvider>} />

        <Route path="/categoria/:categoryId/subcategorias" element={<AdminProvider>
          <CategoriesProvider>
            <SubCategories />
          </CategoriesProvider>
        </AdminProvider>} />

        <Route path="/productos/:categoryId" element={<AdminProvider>
          <ProductsProvider>
            <CategoriesProvider>
              <CartProvider>
                <Products />
              </CartProvider>
            </CategoriesProvider>
          </ProductsProvider>
        </AdminProvider>} />


        <Route path="/editar-producto/:productId" element={<AdminProvider>
          <SecurityRoutes>
            <ProductsProvider>
              <CategoriesProvider>
                <ProductById />
              </CategoriesProvider>
            </ProductsProvider>
          </SecurityRoutes>
        </AdminProvider>} />

        <Route path="/producto/:productId" element={<AdminProvider>
          <ProductsProvider>
            <CategoriesProvider>
              <ProductById />
            </CategoriesProvider>
          </ProductsProvider>
        </AdminProvider>} />

        <Route path="/importar-productos" element={<AdminProvider>
          <SecurityRoutes>
            <ProductsProvider>
              <ImportProducts />
            </ProductsProvider>
          </SecurityRoutes>
        </AdminProvider>} />

        <Route path="/carrito" element={<CartProvider>
          <CartPage />
        </CartProvider>} />

      </Routes>



    </BrowserRouter>
  )
}

export default App
