package com.mahesvara.Medizap1.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mahesvara.Medizap1.model.MedicineModel;
import com.mahesvara.Medizap1.services.MedicineService;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "http://localhost:5173") // ✅ Match your frontend port
public class MedicineController {

    @Autowired
    MedicineService service;

    @GetMapping
    public List<MedicineModel> getAll() {
        return service.getAll();
    }

 
    @GetMapping("/search")
    public List<MedicineModel> search(@RequestParam String name) {
        return service.searchMedicine(name);
    }

    @PostMapping
    public ResponseEntity<MedicineModel> addMedicine(@RequestBody MedicineModel med) {
        MedicineModel create = service.addMedicine(med);
        return ResponseEntity.status(201).body(create);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MedicineModel> deleteMedicine(@PathVariable int id) {
        MedicineModel delete = service.deleteById(id);
        return ResponseEntity.status(202).body(delete);
    }

    @PutMapping("/{id}/stock")
    public MedicineModel updateStock(@PathVariable int id, @RequestParam int stock) {
        return service.updateStock(id, stock);
    }
}