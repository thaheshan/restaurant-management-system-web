'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import './Header.scss';

const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="dinesmart-header">
      <h1 className="dinesmart-header__title">DineSmart</h1>
      
      {mounted && (
        <button 
          className="btn-theme-toggle" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle Theme"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            borderRadius: '50%',
            transition: 'background 0.3s'
          }}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      )}
    </header>
  );
};

export default Header;
