import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WebLayout } from "./layout/WebLayout";
import { HomePage, ProdutoCategoriaPage, ProdutoPage, CartPage, LoginPage, PerfilPage, Page404 } from './pages';
import { AuthProvider, CartProvider } from './contexts';
import { CardItem } from './components';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
    <AuthProvider>

    <CartProvider>

    <WebLayout>

      <Routes>
          <Route path="/" element={<HomePage />} /> 
          <Route path={`categoria/:categoria`} element={<ProdutoCategoriaPage />} />
          <Route path={`produto/:nome`} element={<ProdutoPage />} />
          <Route path={`login`} element={<LoginPage/>}/>
          <Route path={`carrinho`} element={<CartPage/>}/>
          <Route path={`perfil`} element={<PerfilPage/>}/>
          <Route path={`*`} element={<Page404/>}/>
      </Routes>
    </WebLayout>
    </CartProvider>
    </AuthProvider>
    </BrowserRouter>
  );
};
