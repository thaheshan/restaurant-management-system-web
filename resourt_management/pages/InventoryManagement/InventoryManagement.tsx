import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout/MainDashboard';
import {
  FaCheckCircle,
  FaSyncAlt,
  FaExclamationTriangle,
  FaTimesCircle,
  FaChartLine,
  FaPlus,
} from 'react-icons/fa';
import './InventoryManagement.scss';

interface Ingredient {
  id: string;
  name: string;
  category: string;
  stock: string;
  status: 'In Stock' | 'Low Stock' | 'Reorder' | 'Out of Stock';
}

const demoIngredients: Ingredient[] = [
  { id: '1', name: 'Chicken', category: 'MEAT', stock: '15 kg', status: 'In Stock' },
  { id: '2', name: 'Prawns', category: 'SEAFOOD', stock: '4 kg', status: 'Reorder' },
  { id: '3', name: 'Carrots', category: 'VEGETABLE', stock: '20 kg', status: 'In Stock' },
  { id: '4', name: 'Tomatoes', category: 'VEGETABLE', stock: '12 kg', status: 'Low Stock' },
  { id: '5', name: 'Spices', category: 'SPICE', stock: '5 kg', status: 'Reorder' },
  { id: '6', name: 'Beans', category: 'VEGETABLE', stock: '10 kg', status: 'In Stock' },
  { id: '7', name: 'Onions', category: 'VEGETABLE', stock: '16 kg', status: 'In Stock' },
  { id: '8', name: 'Ginger', category: 'SPICE', stock: '3 kg', status: 'Low Stock' },
  { id: '9', name: 'Garlic', category: 'SPICE', stock: '5 kg', status: 'In Stock' },
];

const statusColorMap: Record<string, string> = {
  'In Stock': '#2d5a3d',
  'Low Stock': '#e67e22',
  'Reorder': '#e74c3c',
  'Out of Stock': '#c0392b',
};

const summaryCards = [
  {
    label: 'Available Tracking',
    value: 9,
    icon: <FaCheckCircle />,
    color: '#2d5a3d',
  },
  {
    label: 'Reorder Tracking',
    value: 9,
    icon: <FaSyncAlt />,
    color: '#e74c3c',
  },
  {
    label: 'Running Soon',
    value: 2,
    icon: <FaExclamationTriangle />,
    color: '#e67e22',
  },
  {
    label: 'Out of Stock',
    value: 0,
    icon: <FaTimesCircle />,
    color: '#c0392b',
  },
  {
    label: 'Inventory Turn Rate',
    value: '1.8%',
    icon: <FaChartLine />,
    color: '#3498db',
  },
];

const InventoryManagement: React.FC = () => {
  const [ingredients] = useState<Ingredient[]>(demoIngredients);

  return (
    <DashboardLayout
      title="Inventory Management"
      headerRight={
        <button className="inventory__add-btn" id="add-ingredient-btn">
          <FaPlus /> Add Ingredient
        </button>
      }
    >
      <div className="inventory">
        {/* Summary Cards */}
        <div className="inventory__summary">
          {summaryCards.map((card) => (
            <div key={card.label} className="inventory__card">
              <span
                className="inventory__card-icon"
                style={{ color: card.color }}
              >
                {card.icon}
              </span>
              <div className="inventory__card-info">
                <span className="inventory__card-label">{card.label}</span>
                <span
                  className="inventory__card-value"
                  style={{ color: card.color }}
                >
                  {card.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="inventory__table-wrapper">
          <table className="inventory__table">
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((item) => (
                <tr key={item.id}>
                  <td className="inventory__cell-name">
                    <span className="inventory__ingredient-icon">🥘</span>
                    {item.name}
                  </td>
                  <td className="inventory__cell-category">{item.category}</td>
                  <td>{item.stock}</td>
                  <td>
                    <span
                      className="inventory__status-badge"
                      style={{
                        color: statusColorMap[item.status],
                        background: `${statusColorMap[item.status]}14`,
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InventoryManagement;
