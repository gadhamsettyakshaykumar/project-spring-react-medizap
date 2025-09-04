import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingCart, AlertCircle } from 'lucide-react';
import { apiService, CartItem } from '../services/api';
 
const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
 
  useEffect(() => {
    fetchCartItems();
  }, []);
 
  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const data = await apiService.getCartItems();
      setCartItems(data);
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
      showAlert('error', 'Failed to load cart items. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };
 
  const handleUpdateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
 
    try {
      await apiService.updateCartItem(id, newQuantity);
      setCartItems(items =>
        items.map(item =>
          item.id === id
            ? { ...item, quantity: newQuantity, totalPrice: item.med.price * newQuantity }
            : item
        )
      );
      showAlert('success', 'Cart updated successfully!');
    } catch (error) {
      console.error('Failed to update cart item:', error);
      showAlert('error', 'Failed to update cart item. Please try again.');
    }
  };
 
  const handleRemoveItem = async (id: number) => {
    try {
      await apiService.removeCartItem(id);
      setCartItems(items => items.filter(item => item.id !== id));
      showAlert('success', 'Item removed from cart!');
    } catch (error) {
      console.error('Failed to remove cart item:', error);
      showAlert('error', 'Failed to remove item. Please try again.');
    }
  };
 
  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart?')) {
      return;
    }
 
    try {
      await apiService.clearCart();
      setCartItems([]);
      showAlert('success', 'Cart cleared successfully!');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      showAlert('error', 'Failed to clear cart. Please try again.');
    }
  };
 
  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };
 
  const grandTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
 
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={handleClearCart}
            className="btn-danger flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Cart</span>
          </button>
        )}
      </div>
 
      {/* Alert */}
      {alert && (
        <div className={`mb-6 ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>{alert.message}</span>
          </div>
        </div>
      )}
 
      {/* Cart Content */}
      {cartItems.length > 0 ? (
        <>
          {/* Cart Items Table */}
          <div className="bg-card rounded-lg border border-card-border overflow-hidden mb-6">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td>
                      <div>
                        <p className="font-semibold text-foreground">{item.med.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {item.med.id}</p>
                      </div>
                    </td>
                    <td className="font-medium">₹{item.med.price.toFixed(2)}</td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 rounded border border-input-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded border border-input-border hover:bg-muted transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                    <td className="font-semibold text-primary">₹{item.totalPrice.toFixed(2)}</td>
                    <td>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-error hover:text-error/80 transition-colors p-1 rounded"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
 
          {/* Grand Total */}
          <div className="bg-card rounded-lg border border-card-border p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Grand Total</h3>
                <p className="text-sm text-muted-foreground">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">₹{grandTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Empty Cart */
        <div className="text-center py-12">
          <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h3>
          <p className="text-muted-foreground mb-6">Start adding medicines to your cart to see them here</p>
          <a href="/medicines" className="btn-primary inline-block">
            Browse Medicines
          </a>
        </div>
      )}
    </div>
  );
};
 
export default Cart;