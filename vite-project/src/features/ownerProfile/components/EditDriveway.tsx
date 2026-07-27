import { ProfileDropdown } from "../../../components/ProfileDropdown";
import { PlaceAutocompleteTS } from "../../../components/PlaceComplete";
import { useEditDriveway } from "../hooks/useEditDriveway";
import "../../../style/AddDriveway.css";

const ruleCategories = {
  parking: [
    "Pull all the way forward",
    "Do not block the garage",
    "Stay off the grass",
    "Park on the left side only",
    "Park on the right side only",
    "Park in the center of the driveway",
    "Back-in parking only",
    "Front-in parking only",
    "Stay within the marked area",
    "Park between the cones",
    "Do not block the sidewalk",
    "Do not block the walkway",
    "Park under the carport only"
  ],
  vehicleRestrictions: [
    "No oversized vehicles",
    "No trucks",
    "No commercial vans",
    "Motorcycles only",
    "No trailers",
    "No RVs",
    "No buses",
    "No dually trucks",
    "Compact cars only",
    "No electric vehicles",
    "EVs allowed but no charging",
    "EV charging available"
  ],
  timeRestrictions: [
    "No overnight parking",
    "Must leave by midnight",
    "Must arrive within 1 hour of event",
    "No early arrival",
    "No late departure",
    "No re-entry",
    "No idling in the driveway",
    "No waiting in the driveway"
  ],
  behavior: [
    "No loud music",
    "No honking",
    "No littering",
    "Keep noise low",
    "Do not disturb neighbors",
    "No smoking on property",
    "No alcohol on property"
  ],
  neighborhood: [
    "Drive slowly in neighborhood",
    "Watch for kids playing",
    "Do not block neighbor's driveway",
    "Be respectful of neighbors",
    "Do not leave trash behind",
    "Follow posted neighborhood signs"
  ]
};

export function EditDriveway() {
  const {
    step,
    setStep,
    loading,
    loadingSubmit,
    message,
    messageType,
    formData,
    setFormData,
    handleChange,
    handleRuleToggle,
    removeExistingImage,
    removeNewImage,
    handleSubmit,
    sendHome
  } = useEditDriveway();

  if (loading) {
    return (
      <>
        <div className="topAddDriveway">
          <img src="/logo.png" alt="logo" className="logo" onClick={sendHome} />
          <ProfileDropdown />
        </div>
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading driveway...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page">
        {loadingSubmit && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Updating your driveway...</p>
          </div>
        )}

        <div className="topAddDriveway">
          <img src="/logo.png" alt="logo" className="logo" onClick={sendHome} />
          <ProfileDropdown />
        </div>

        {message && (
          <div
            style={{
              position: "fixed",
              right: 20,
              top: 20,
              zIndex: 9999,
              padding: "12px 18px",
              borderRadius: 10,
              color: messageType === "error" ? "#fff" : "#063",
              background: messageType === "error" ? "#b00020" : "#e6ffed",
              boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
              maxWidth: 360
            }}
          >
            {message}
          </div>
        )}

        <div className="box5">
          {step === 1 && (
            <section className="nameOuter">
              <div className="nameBox">
                <p>Driveway name</p>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="nameInput"
                  placeholder="e.g., John's driveway"
                />
              </div>
            </section>
          )}

          {step === 2 && (
            <div className="locationBox step">
              <h2>Location</h2>
              <PlaceAutocompleteTS
                initialValue={formData.address}
                onSelect={(addressData) => {
                  setFormData((prev) => ({
                    ...prev,
                    address: addressData.full_address,
                    city: addressData.city,
                    state: addressData.state,
                    zipcode: addressData.zipcode,
                    latitude: addressData.latitude,
                    longitude: addressData.longitude,
                    publicDisplay: addressData.publicDisplay
                  }));
                }}
              />
              <p className="safety">
                We only show renters your street and approximate location.
              </p>
              <p className="address-display">Current address: {formData.address || "Not set"}</p>
            </div>
          )}

          {step === 3 && (
            <section className="stadiumInfoBox">
              <div className="stadiumInfo5 step">
                <h3 className="title2">Walk from driveway to stadium:</h3>
                <section className="walk">
                  <select
                    value={formData.walk}
                    onChange={(e) => handleChange("walk", e.target.value)}
                    className="walk-select"
                  >
                    <option value="">Select walking time</option>
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} minutes
                      </option>
                    ))}
                  </select>
                </section>
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="priceBoxLarger">
              <div className="priceBox">
                <h2 className="priceTitle">Price</h2>
                <h4 className="priceTitle2">Price per reservation (USD)</h4>
                <div className="pricing-note">
                  <strong>Note:</strong> You can update your pricing at any time.
                </div>
                <select
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  className="price-dropdown"
                >
                  <option value="">Select price</option>
                  {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      ${num}
                    </option>
                  ))}
                </select>
              </div>
            </section>
          )}

          {step === 5 && (
            <div className="imagesBoxLarger">
              <section className="imagesBox step">
                <h2>Pictures</h2>
                <div className="image-note">
                  <strong>Tip:</strong> Upload clear, high-quality photos of your driveway.
                </div>
                <div className="image-limit-note">
                  You can have up to <strong>5 images total</strong>.
                </div>

                {formData.existingImages.length > 0 && (
                  <div className="existing-images">
                    <h4>Current Images</h4>
                    <div className="previewGrid">
                      {formData.existingImages.map((img, index) => (
                        <div key={index} className="previewItem">
                          <img src={img.url} alt={`existing-${index}`} />
                          <button
                            type="button"
                            className="removeBtn"
                            onClick={() => removeExistingImage(index)}
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="imageUploadBox">
                  <label className="uploadArea">
                    <span className="uploadText">Click to upload or drag images here</span>
                    <input
                      className="imageInput"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newFiles = e.target.files ? Array.from(e.target.files) : [];
                        const totalImages =
                          formData.existingImages.length + formData.newImages.length + newFiles.length;

                        if (totalImages > 5) {
                          alert("You can have a maximum of 5 images total.");
                          return;
                        }

                        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
                        const typeValid = newFiles.filter((file) => allowedTypes.includes(file.type));

                        if (typeValid.length !== newFiles.length) {
                          alert("Only JPG, PNG, or WEBP images are allowed.");
                        }

                        const maxSize = 5 * 1024 * 1024;
                        const sizeValid = typeValid.filter((file) => file.size <= maxSize);

                        if (sizeValid.length !== typeValid.length) {
                          alert("Each image must be under 5MB.");
                        }

                        handleChange("newImages", [...formData.newImages, ...sizeValid]);
                      }}
                    />

                    {formData.newImages.length > 0 && (
                      <div className="previewGrid">
                        {formData.newImages.map((file: File, index: number) => (
                          <div key={index} className="previewItem">
                            <img src={URL.createObjectURL(file)} alt={`new-${index}`} />
                            <button
                              type="button"
                              className="removeBtn"
                              onClick={() => removeNewImage(index)}
                            >
                              X
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </label>
                </div>
              </section>
            </div>
          )}

          {step === 6 && (
            <div className="rules-section">
              <p className="title3">Rules for your driveway</p>
              <p className="title4">Select all the rules that apply to your driveway.</p>

              {Object.entries(ruleCategories).map(([category, rules]) => (
                <div key={category} className="rule-category">
                  <h4 className="category-title">{category}</h4>
                  {rules.map((rule) => (
                    <label key={rule} className="rule-item">
                      <input
                        type="checkbox"
                        checked={formData.rules.includes(rule)}
                        onChange={() => handleRuleToggle(rule)}
                      />
                      {rule}
                    </label>
                  ))}
                </div>
              ))}
            </div>
          )}

          {step === 7 && (
            <section className="descriptionBoxLarger">
              <div className="descriptionBox step">
                <h3>Additional Information</h3>
                <div className="info-note">
                  <strong>Additional Information:</strong> Include any extra details that might help renters.
                </div>
                <textarea
                  className="textarea"
                  rows={10}
                  cols={60}
                  placeholder="Write your text here..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>
            </section>
          )}

          {step === 8 && (
            <div className="reviewOuterBox">
              <section className="reviewBox">
                <div className="reviewLocation">
                  <div>
                    <h3>NAME</h3>
                    <p>{formData.name}</p>
                  </div>
                  <button className="editButton" onClick={() => setStep(1)}>Edit</button>
                </div>
                <hr />

                <div className="reviewLocation">
                  <div>
                    <h3>LOCATION</h3>
                    <p>{formData.address}</p>
                    <p className="exact">Exact address shown only after booking</p>
                  </div>
                  <button className="editButton" onClick={() => setStep(2)}>Edit</button>
                </div>
                <hr />

                <div className="reviewPrice">
                  <div>
                    <h3>PRICE</h3>
                    <p>${formData.price} per game</p>
                  </div>
                  <button className="editButton" onClick={() => setStep(4)}>Edit</button>
                </div>
                <hr />

                <div className="reviewWalk">
                  <div>
                    <h3>WALKING DISTANCE</h3>
                    <p>{formData.walk} minute walk</p>
                  </div>
                  <button className="editButton" onClick={() => setStep(3)}>Edit</button>
                </div>
                <hr />

                <div className="reviewDescription">
                  <div>
                    <h3>DESCRIPTION</h3>
                    <p>{formData.description || "No additional information provided"}</p>
                  </div>
                  <button className="editButton" onClick={() => setStep(7)}>Edit</button>
                </div>
                <hr />

                <div className="reviewRules">
                  <div>
                    <h3>RULES</h3>
                    <ul>
                      {formData.rules.length > 0 ? (
                        formData.rules.map((rule, index) => <li key={index}>- {rule}</li>)
                      ) : (
                        <li>No specific rules set</li>
                      )}
                    </ul>
                  </div>
                  <button className="editButton" onClick={() => setStep(6)}>Edit</button>
                </div>
                <hr />

                <div className="reviewImages">
                  <div>
                    <h3>PHOTOS</h3>
                    <div className="imageGrid">
                      {formData.existingImages.map((img, index) => (
                        <img
                          key={`existing-${index}`}
                          src={img.url}
                          alt={`Driveway ${index}`}
                          className="previewImage"
                        />
                      ))}
                      {formData.newImages.map((file, index) => (
                        <img
                          key={`new-${index}`}
                          src={URL.createObjectURL(file)}
                          alt={`New ${index}`}
                          className="previewImage"
                        />
                      ))}
                    </div>
                  </div>
                  <button className="editButton" onClick={() => setStep(5)}>Edit</button>
                </div>
                <hr />

                <p className="agreementText">
                  By saving your changes, you confirm that all information is accurate and that you
                  continue to follow our hosting rules and community guidelines.
                </p>

                <button onClick={handleSubmit} className="listBtn primaryBtn" disabled={loadingSubmit}>
                  {loadingSubmit ? "Saving..." : "Save Changes"}
                </button>
              </section>
            </div>
          )}
        </div>

        <div className="buttonWrapper">
          {step === 1 && (
            <button className="nextBtn" onClick={() => setStep(step + 1)}>
              Next
            </button>
          )}

          {step > 1 && step < 8 && (
            <div className="bothButtons">
              <button disabled={loadingSubmit} className="nextBtn" onClick={() => setStep(step - 1)}>
                Back
              </button>
              <button disabled={loadingSubmit} className="nextBtn" onClick={() => setStep(step + 1)}>
                Next
              </button>
            </div>
          )}

          {step === 8 && (
            <button className="nextBtn" disabled={loadingSubmit} onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}

          <p className="helper">Step {step} of 8</p>
        </div>
      </div>
    </>
  );
}
