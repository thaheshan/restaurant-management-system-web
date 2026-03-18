import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { products } from '../../data/menuData';
import './Bill.scss';

interface OrderItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}

const Bill: React.FC = () => {
  const navigate = useNavigate();

  // Demo order data
  const orderItems: OrderItem[] = [
    {
      id: products[0].id,
      name: products[0].name,
      description: products[0].description,
      price: products[0].price,
      image: products[0].image,
      quantity: 2,
    },
  ];

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxRate = 0.1;
  const tax = Math.round(subtotal * taxRate);
  const grandTotal = subtotal + tax;

  const handleProceed = () => {
    navigate('/payment');
  };

  return (
    <div className="bill-page">
      <Header />

      <div className="bill-page__content">
        <div className="bill-page__card">
          <h2 className="bill-page__title">Order Summary</h2>

          <div className="bill-page__items">
            {orderItems.map((item) => (
              <div key={item.id} className="bill-item">
                <div className="bill-item__image-wrapper">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="bill-item__image"
                  />
                </div>
                <div className="bill-item__info">
                  <h3 className="bill-item__name">{item.name}</h3>
                  <p className="bill-item__desc">{item.description}</p>
                  <p className="bill-item__price">
                    Rs. {item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bill-page__divider" />

          <div className="bill-page__row">
            <span className="bill-page__label">Subtotal</span>
            <span className="bill-page__value">Rs. {subtotal}</span>
          </div>
          <div className="bill-page__row">
            <span className="bill-page__label">Tax (10%)</span>
            <span className="bill-page__value">Rs. {tax}</span>
          </div>

          <div className="bill-page__divider" />

          <div className="bill-page__row bill-page__row--total">
            <span className="bill-page__label bill-page__label--total">
              Grand Total
            </span>
            <span className="bill-page__value bill-page__value--total">
              Rs. {grandTotal}
            </span>
          </div>

          <button
            className="bill-page__proceed-btn"
            onClick={handleProceed}
            id="bill-proceed-btn"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bill;
