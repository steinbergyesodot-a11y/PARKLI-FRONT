import React, { useState } from "react";

export function RegisterCar() {
  const [step, setStep] = useState(1); // start at step 1
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    photos: [],
    location: ""
  });

  // helper to update form data
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      {/* Step content */}
      {step === 1 && (
        <div>
          <h2>Car Details</h2>
          <input
            placeholder="Make"
            value={formData.make}
            onChange={e => handleChange("make", e.target.value)}
          />
          <input
            placeholder="Model"
            value={formData.model}
            onChange={e => handleChange("model", e.target.value)}
          />
          <input
            placeholder="Year"
            value={formData.year}
            onChange={e => handleChange("year", e.target.value)}
          />
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Pricing</h2>
          <input
            placeholder="Price per day"
            value={formData.price}
            onChange={e => handleChange("price", e.target.value)}
          />
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Photos</h2>
          <input
            type="file"
            multiple
            onChange={e => handleChange("photos", e.target.files)}
          />
        </div>
      )}

      {step === 4 && (
        <div>
          <h2>Location</h2>
          <input
            placeholder="Pickup location"
            value={formData.location}
            onChange={e => handleChange("location", e.target.value)}
          />
        </div>
      )}

      {step === 5 && (
        <div>
          <h2>Review & Confirm</h2>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
          <button onClick={() => alert("Submitted!")}>Submit</button>
        </div>
      )}

      {/* Navigation buttons */}
      <div style={{ marginTop: "20px" }}>
        {step > 1 && <button onClick={() => setStep(step - 1)}>Back</button>}
        {step < 5 && <button onClick={() => setStep(step + 1)}>Next</button>}
      </div>
    </div>
  );
}

export default RegisterCar;
