import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Pill } from 'lucide-react';
import { apiService } from '../services/api';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  const fetchCartCount = async () => {
    try {
      const items = await apiService.getCartItems();
      const count = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
    // Refresh cart count when navigating back to medicines page
    const interval = setInterval(fetchCartCount, 2000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  return (
    <nav className="bg-card border-b border-card-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/medicines" className="flex items-center space-x-2 text-primary hover:text-primary-hover transition-colors">
            <Pill className="h-8 w-8" />
            <span className="text-xl font-bold">MediZap</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/medicines"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                location.pathname === '/medicines'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <Pill className="h-4 w-4" />
              <span>Medicines</span>
            </Link>

            <Link
              to="/cart"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-colors relative ${
                location.pathname === '/cart'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem] px-1">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;