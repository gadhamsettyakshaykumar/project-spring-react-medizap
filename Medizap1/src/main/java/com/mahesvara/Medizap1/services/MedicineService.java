package com.mahesvara.Medizap1.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import com.mahesvara.Medizap1.model.MedicineModel;
import com.mahesvara.Medizap1.repositories.MedicineRepository;

@Service
public class MedicineService {
	
	@Autowired
	MedicineRepository repo;

	public List<MedicineModel> getAll() {
		// TODO Auto-generated method stub
		return repo.findAll();
	}

	public MedicineModel searchMedicine(String name) {
		// TODO Auto-generated method stub
		return repo.findByName(name);
	}

	public MedicineModel addMedicine(MedicineModel med) {
		// TODO Auto-generated method stub
		return repo.save(med);
	}


	public MedicineModel deleteById(int id) {
		MedicineModel med = repo.findById(id).orElse(null);
		if (med != null) {
			repo.deleteById(id);
		}
		return med;
}


public MedicineModel updateStock(int id, int stock) {
    MedicineModel mm = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Medicine not found"));

    mm.setStock(stock); // Update stock

    MedicineModel updated = repo.save(mm); // Save updated medicine


    return updated; // Return updated medicine
}



}
