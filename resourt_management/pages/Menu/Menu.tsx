import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { categories } from '../../../resourt-web/src/data/menuData';
import './Menu.scss';

const Menu: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <div className="menu-page">
      <Header />

      <div className="menu-page__content">
        <div className="menu-page__title-section">
          <h2 className="menu-page__title">Menu</h2>
          <div className="menu-page__title-underline" />
        </div>

        <div className="menu-page__grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => handleCategoryClick(category.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCategoryClick(category.id);
              }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="category-card__image"
              />
              <div className="category-card__overlay" />
              <span className="category-card__name">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
