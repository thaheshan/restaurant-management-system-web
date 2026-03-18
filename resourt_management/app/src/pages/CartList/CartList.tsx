import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import QuantitySelector from '../../components/QuantitySelector/QuantitySelector';
import { products } from '../../data/menuData';
import './CartList.scss';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const CartList: React.FC = () => {
  const navigate = useNavigate();

  // Demo: pre-populate cart with first product
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: products[0].id,
      name: products[0].name,
      price: products[0].price,
      image: products[0].image,
      quantity: 2,
    },
  ]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleProceed = () => {
    navigate('/waiting');
  };

  return (
    <div className="cart-page">
      <Header />

      <div className="cart-page__content">
        <div className="cart-page__items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item__image-wrapper">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item__image"
                />
              </div>
              <div className="cart-item__info">
                <h3 className="cart-item__name">{item.name}</h3>
                <p className="cart-item__price">
                  Rs. {item.price * item.quantity}
                </p>
                <QuantitySelector
                  value={item.quantity}
                  onChange={(val) => handleQuantityChange(item.id, val)}
                  size="small"
                />
              </div>
            </div>
          ))}
        </div>

        <button className="cart-page__proceed-btn" onClick={handleProceed}>
          Proceed to Place Order
          <span className="cart-page__proceed-arrow">→</span>
        </button>
      </div>
    </div>
  );
};

export default CartList;
