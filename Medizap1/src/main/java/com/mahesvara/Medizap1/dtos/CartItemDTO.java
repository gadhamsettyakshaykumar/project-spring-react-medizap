package com.mahesvara.Medizap1.dtos;

import com.mahesvara.Medizap1.model.CartModel;



public class CartItemDTO {
    private int id;
    private int medicineId;
    private String medicineName;
    private int quantity;
    private double price;

    public CartItemDTO(CartModel cart) {
        this.id = cart.getId();
        this.medicineId = cart.getMed().getId();
        this.medicineName = cart.getMed().getName();
        this.quantity = cart.getQuantity();
        this.price = cart.getTotalPrice();
    }

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getMedicineId() {
		return medicineId;
	}

	public void setMedicineId(int medicineId) {
		this.medicineId = medicineId;
	}

	public String getMedicineName() {
		return medicineName;
	}

	public void setMedicineName(String medicineName) {
		this.medicineName = medicineName;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

    // Getters and Setters
}
