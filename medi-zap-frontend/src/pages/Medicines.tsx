import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, Loader2 } from 'lucide-react';
import { apiService, Medicine } from '../services/api';
import MedicineCard from '../components/MedicineCard';

const Medicines = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch all medicines on component mount
  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const data = await apiService.getMedicines();
      setMedicines(data);
    } catch (error) {
      console.error('Failed to fetch medicines:', error);
      showAlert('error', 'Failed to load medicines. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchMedicines();
      return;
    }

    setSearchLoading(true);
    try {
      const data = await apiService.searchMedicines(searchTerm);
      setMedicines(data);
      if (data.length === 0) {
        showAlert('error', 'No medicines found matching your search.');
      }
    } catch (error) {
      console.error('Search failed:', error);
      showAlert('error', 'Search failed. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddToCart = async (medicineId: number, quantity: number) => {
    try {
      await apiService.addToCart(medicineId, quantity);
      showAlert('success', `Added ${quantity} item(s) to cart successfully!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      showAlert('error', 'Failed to add item to cart. Please try again.');
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Medicines</h1>
        <p className="text-muted-foreground">Browse and search for medicines</p>
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

      {/* Search */}
      <div className="mb-8">
        <div className="flex space-x-4 max-w-md">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search medicines by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input-field pl-10"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            className="btn-primary flex items-center space-x-2"
          >
            {searchLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Search</span>
          </button>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                fetchMedicines();
              }}
              className="btn-outline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading medicines...</p>
          </div>
        </div>
      )}

      {/* Medicines Grid */}
      {!loading && (
        <>
          {medicines.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicines.map((medicine) => (
                <MedicineCard
                  key={medicine.id}
                  medicine={medicine}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No medicines found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'No medicines available at the moment'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Medicines;