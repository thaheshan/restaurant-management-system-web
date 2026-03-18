import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { getProductsByCategory, getCategoryById } from '../../../resourt-web/src/data/menuData';
import './CategoryMenu.scss';

const CategoryMenu: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const category = getCategoryById(categoryId || '');
  const products = getProductsByCategory(categoryId || '');

  const handleAddToCart = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (!category) {
    return (
      <div className="category-menu-page">
        <Header />
        <div className="category-menu-page__content">
          <p>Category not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-menu-page">
      <Header />

      <div className="category-menu-page__content">
        <h2 className="category-menu-page__category-title">
          <u>{category.name.charAt(0) + category.name.slice(1).toLowerCase()}</u>
        </h2>

        <div className="category-menu-page__grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-card__info">
                <h3 className="product-card__name">{product.name}</h3>
                <p className="product-card__description">{product.description}</p>
                <p className="product-card__price">Rs. {product.price}</p>
                <button
                  className="product-card__add-btn"
                  onClick={() => handleAddToCart(product.id)}
                >
                  <span className="product-card__cart-icon">🛒</span>
                  Add to Cart
                </button>
              </div>
              <div className="product-card__image-wrapper">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-card__image"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryMenu;
