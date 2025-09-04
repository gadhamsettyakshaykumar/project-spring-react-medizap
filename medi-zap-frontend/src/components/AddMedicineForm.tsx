import React, { useState } from 'react';

const AddMedicineForm: React.FC = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newMedicine = { name, price, stock };

    try {
      const response = await fetch('http://localhost:8080/api/medicines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMedicine),
      });

      if (!response.ok) {
        throw new Error('Failed to add medicine');
      }

      const result = await response.json();
      setMessage(`Medicine "${result.name}" added successfully!`);
      setName('');
      setPrice(0);
      setStock(0);
    } catch (error) {
      console.error(error);
      setMessage('Error adding medicine.');
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '400px' }}>
      <h2>Add New Medicine</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br />
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Price:</label><br />
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
        </div>
        <div>
          <label>Stock:</label><br />
          <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} required />
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>Add Medicine</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddMedicineForm;