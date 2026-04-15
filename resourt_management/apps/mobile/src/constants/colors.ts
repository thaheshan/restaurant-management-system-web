export const COLORS = {
  primary: '#2B7C4F',
  primaryLight: '#4A9E6F',
  primaryDark: '#1F5A38',
  white: '#FFFFFF',
  black: '#1A1A1A',
  gray: {
    50: '#F8F8F8',
    100: '#EEEEEE',
    200: '#E0E0E0',
    300: '#CCCCCC',
    400: '#999999',
    500: '#666666',
    600: '#4D4D4D',
  },
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  background: '#FFFFFF',
  surface: '#F8F8F8',
  border: '#EEEEEE',
  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
    tertiary: '#999999',
    inverse: '#FFFFFF',
  },
  fresh: '#4CAF50',
  expired: '#F44336',
  // Web Dashboard Aligned Colors
  webGreen: '#2d5a3d',
  webRed: '#e74c3c',
  webBlue: '#3498db',
  webOrange: '#e67e22',
  webDark: '#1a1a1a',
  webLight: '#f8f8f8',
  status: {
    success: '#2d5a3d',
    error: '#e74c3c',
    warning: '#e67e22',
    info: '#3498db',
    neutral: '#718096',
  }
};

export const PAYMENT_COLORS = {
  cash: '#4CAF50',
  debitCard: '#2B7C4F',
  creditCard: '#2196F3',
};

export const ORDER_STATUS_COLORS = {
  placed: '#2196F3',
  prep: '#FF9800',
  'in-progress': '#FF6F00',
  served: '#4CAF50',
};

// Aliases for backward compatibility
export const colors = COLORS;
export default COLORS;
