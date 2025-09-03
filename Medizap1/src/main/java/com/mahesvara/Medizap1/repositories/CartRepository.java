package com.mahesvara.Medizap1.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mahesvara.Medizap1.model.CartModel;
@Repository
public interface CartRepository extends JpaRepository<CartModel, Integer>{

	Optional<CartModel> findByMed_Id(int medicine_id);

}
