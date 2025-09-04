import AddMedicineForm from "../components/AddMedicineForm";
 
const AddMedicine = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Medicine</h1>
      <AddMedicineForm />
    </div>
  );
};
 
export default AddMedicine;