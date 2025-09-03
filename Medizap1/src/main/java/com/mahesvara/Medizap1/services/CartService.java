package com.mahesvara.Medizap1.services;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mahesvara.Medizap1.model.CartModel;
import com.mahesvara.Medizap1.model.MedicineModel;
import com.mahesvara.Medizap1.repositories.CartRepository;
import com.mahesvara.Medizap1.repositories.MedicineRepository;

@Service
@Transactional
public class CartService {

    private final CartRepository repo;
    private final MedicineRepository medRepo;

    public CartService(CartRepository repo, MedicineRepository medRepo) {
        this.repo = repo;
        this.medRepo = medRepo;
    }

    
    public CartModel addtocart(int medicine_id, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        MedicineModel medicine = medRepo.findById(medicine_id)
                .orElseThrow(() -> new EntityNotFoundException("Medicine not found: " + medicine_id));

       
        Optional<CartModel> existing = repo.findByMed_Id(medicine_id);
        if (existing.isPresent()) {
            CartModel cm = existing.get();
            int newQty = cm.getQuantity() + quantity;
            cm.setQuantity(newQty);
            cm.setTotalPrice(medicine.getPrice() * newQty);
            return repo.save(cm);
        }

   
        CartModel cart = new CartModel();
        cart.setMed(medicine);
        cart.setQuantity(quantity);
        cart.setTotalPrice(medicine.getPrice() * quantity);
        return repo.save(cart);
    }

    public List<CartModel> getallitems() {
        return repo.findAll();
    }

   
    public CartModel updateQuantity(int cartItemId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
        CartModel cm = repo.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found: " + cartItemId));

        cm.setQuantity(quantity);
        double unitPrice = cm.getMed().getPrice(); // assumes MedicineModel#getPrice()
        cm.setTotalPrice(unitPrice * quantity);
        return repo.save(cm);
    }

   
    public boolean removeById(int id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }

   
    public CartModel removecartItems(int id) {
        CartModel cart = repo.findById(id).orElse(null);
        if (cart != null) {
            repo.deleteById(id);
        }
        return cart;
    }

  
    public void clearAll() {
        repo.deleteAll();
    }
}