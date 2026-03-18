import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../../data/menuData';
import QuantitySelector from '../../components/QuantitySelector/QuantitySelector';
import './ProductDetail.scss';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(2);

  const product = getProductById(productId || '');

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-page__content">
          <p>Product not found.</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    navigate('/cart');
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-page__image-section">
        <button
          className="product-detail-page__back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ←
        </button>
        <img
          src={product.image}
          alt={product.name}
          className="product-detail-page__image"
        />
      </div>

      <div className="product-detail-page__content">
        <h1 className="product-detail-page__name">{product.name}</h1>
        <p className="product-detail-page__description">{product.description}</p>
        <p className="product-detail-page__price">Rs. {product.price}</p>

        <div className="product-detail-page__actions">
          <QuantitySelector value={quantity} onChange={setQuantity} size="large" />
          <button
            className="product-detail-page__add-btn"
            onClick={handleAddToCart}
          >
            <span className="product-detail-page__cart-icon">🛒</span>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
