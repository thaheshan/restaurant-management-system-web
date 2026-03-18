import './QuantitySelector.scss';

interface QuantitySelectorProps {
  value: number;
  onChange: (newValue: number) => void;
  size?: 'small' | 'large';
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  onChange,
  size = 'large',
}) => {
  const handleDecrement = () => {
    if (value > 1) onChange(value - 1);
  };

  const handleIncrement = () => {
    onChange(value + 1);
  };

  return (
    <div className={`quantity-selector quantity-selector--${size}`}>
      <button
        className="quantity-selector__btn quantity-selector__btn--minus"
        onClick={handleDecrement}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="quantity-selector__value">{value}</span>
      <button
        className="quantity-selector__btn quantity-selector__btn--plus"
        onClick={handleIncrement}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
