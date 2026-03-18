import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { FaMoneyBillWave, FaCreditCard, FaRegCreditCard } from 'react-icons/fa';
import './Payment.scss';

type PaymentMethod = 'cash' | 'debit' | 'credit';

interface PaymentOption {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const paymentOptions: PaymentOption[] = [
  {
    id: 'cash',
    label: 'Cash in Hand',
    description: 'Pay with cash at the counter',
    icon: <FaMoneyBillWave />,
  },
  {
    id: 'debit',
    label: 'Debit Card',
    description: 'Pay securely with your Debit/Mastercard',
    icon: <FaCreditCard />,
  },
  {
    id: 'credit',
    label: 'Credit Card',
    description: 'Visa, Mastercard & more',
    icon: <FaRegCreditCard />,
  },
];

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('debit');
  const [promoCode, setPromoCode] = useState('');

  const grandTotal = 4400; // from Bill page (demo)

  const handleConfirm = () => {
    navigate('/waiting');
  };

  return (
    <div className="payment-page">
      <Header />

      <div className="payment-page__content">
        <div className="payment-page__total-section">
          <span className="payment-page__total-label">Order Total</span>
          <span className="payment-page__total-amount">Rs. {grandTotal}</span>
        </div>

        <div className="payment-page__card">
          <h2 className="payment-page__title">Select Payment Method</h2>
          <p className="payment-page__subtitle">
            Choose how you'd like to pay for your order
          </p>

          <div className="payment-page__options">
            {paymentOptions.map((option) => (
              <button
                key={option.id}
                className={`payment-option ${
                  selectedMethod === option.id ? 'payment-option--active' : ''
                }`}
                onClick={() => setSelectedMethod(option.id)}
                id={`payment-option-${option.id}`}
              >
                <span className="payment-option__icon">{option.icon}</span>
                <div className="payment-option__info">
                  <span className="payment-option__label">{option.label}</span>
                  <span className="payment-option__desc">
                    {option.description}
                  </span>
                </div>
                <span
                  className={`payment-option__radio ${
                    selectedMethod === option.id
                      ? 'payment-option__radio--checked'
                      : ''
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="payment-page__promo">
            <input
              type="text"
              className="payment-page__promo-input"
              placeholder="Apply Promo Code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              id="promo-code-input"
            />
          </div>
        </div>

        <button
          className="payment-page__confirm-btn"
          onClick={handleConfirm}
          id="payment-confirm-btn"
        >
          Confirm & Pay
        </button>
      </div>
    </div>
  );
};

export default Payment;
