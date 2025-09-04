const API_BASE_URL = 'http://localhost:8080/api';

export interface Medicine {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export interface CartItem {
  id: number;
  med: Medicine;
  quantity: number;
  totalPrice: number;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getMedicines(): Promise<Medicine[]> {
    return this.request<Medicine[]>('/medicines');
  }

  // ✅ Matches backend's @RequestParam
  async searchMedicines(name: string): Promise<Medicine[]> {
    return this.request<Medicine[]>(`/medicines/search?name=${encodeURIComponent(name)}`);
  }

  async addToCart(medicineId: number, quantity: number): Promise<CartItem> {
    return this.request<CartItem>(`/cart/add?medicine_id=${medicineId}&quantity=${quantity}`, {
      method: 'POST',
    });
  }

  async getCartItems(): Promise<CartItem[]> {
    return this.request<CartItem[]>('/cart/items');
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    return this.request<CartItem>(`/cart/update/${id}?quantity=${quantity}`, {
      method: 'PUT',
    });
  }

  async removeCartItem(id: number): Promise<void> {
    return this.request<void>(`/cart/remove/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteCartItem(id: number): Promise<CartItem> {
    return this.request<CartItem>(`/cart/delete/${id}`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<string> {
    return this.request<string>('/cart/clear', {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();