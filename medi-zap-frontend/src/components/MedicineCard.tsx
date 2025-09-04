import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Medicine } from '../services/api';

interface MedicineCardProps {
  medicine: Medicine;
  onAddToCart: (medicineId: number, quantity: number) => Promise<void>;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ medicine, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await onAddToCart(medicine.id, quantity);
      setQuantity(1); // Reset quantity after successful add
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const increaseQuantity = () => {
    if (quantity < medicine.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const isOutOfStock = medicine.stock === 0;
  const isQuantityAtMax = quantity >= medicine.stock;

  return (
    <div className="medicine-card">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-foreground">{medicine.name}</h3>
        <span className={`px-2 py-1 text-xs rounded-full ${
          medicine.stock > 10 ? 'bg-success/10 text-success' :
          medicine.stock > 0 ? 'bg-warning/10 text-warning' :
          'bg-error/10 text-error'
        }`}>
          {medicine.stock > 0 ? `${medicine.stock} in stock` : 'Out of stock'}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-bold text-primary">₹{medicine.price.toFixed(2)}</p>
        <p className="text-sm text-muted-foreground">ID: {medicine.id}</p>
      </div>

      {!isOutOfStock && (
        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Qty:</span>
            <div className="flex items-center border border-input-border rounded-lg">
              <button
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="p-1 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const newQty = parseInt(e.target.value) || 1;
                  setQuantity(Math.max(1, Math.min(newQty, medicine.stock)));
                }}
                className="quantity-input border-none"
                min="1"
                max={medicine.stock}
              />
              <button
                onClick={increaseQuantity}
                disabled={isQuantityAtMax}
                className="p-1 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isLoading || isOutOfStock}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            {isLoading && <div className="loading-spinner"></div>}
            <span>{isLoading ? 'Adding...' : 'Add to Cart'}</span>
          </button>
        </div>
      )}

      {isOutOfStock && (
        <button
          disabled
          className="w-full bg-muted text-muted-foreground py-2 px-4 rounded-lg cursor-not-allowed"
        >
          Out of Stock
        </button>
      )}
    </div>
  );
};

export default MedicineCard;