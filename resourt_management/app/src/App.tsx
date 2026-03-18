import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Menu from './pages/Menu/Menu';
import CategoryMenu from './pages/CategoryMenu/CategoryMenu';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import CartList from './pages/CartList/CartList';
import Bill from './pages/Bill/Bill';
import Payment from './pages/Payment/Payment';
import WaitingTime from './pages/WaitingTime/WaitingTime';
import InventoryManagement from './pages/InventoryManagement/InventoryManagement';
import ExpiryAlert from './pages/ExpiryAlert/ExpiryAlert';
import HygieneDashboard from './pages/HygieneDashboard/HygieneDashboard';
import './App.scss';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/category/:categoryId" element={<CategoryMenu />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<CartList />} />
        <Route path="/bill" element={<Bill />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/waiting" element={<WaitingTime />} />
        <Route path="/inventory" element={<InventoryManagement />} />
        <Route path="/expiry-alert" element={<ExpiryAlert />} />
        <Route path="/hygiene" element={<HygieneDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
