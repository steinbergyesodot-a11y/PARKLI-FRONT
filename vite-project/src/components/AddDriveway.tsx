import { useState, useRef, useEffect } from "react";
import '../style/AddDriveway.css'
import { useContext } from "react";
import { UserContext } from '../userContext'
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import imageCompression from "browser-image-compression";
import { ProfileDropdown } from "./ProfileDropdown";



type MyPayload = JwtPayload & { _id?: string; name?: string; };

interface drivewayFormData {
  ownerId: string;
  address: string;
  walk: string;
  price: string;
  images: File[];

  description: string;
}


export function AddDriveway() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<drivewayFormData>({
    ownerId: "",
    address: "",
    walk: "",
    price: "",
    images: [],
    description: ""
  });
  const [message, setMessage] = useState("");
  const [policyNotAgreed, setPolicyNotAgreed] = useState(true)
  const [checked,setChecked] = useState(false)
  const [isLoading, setIsLoading] = useState(false);


   const userContext = useContext(UserContext)
   const user = userContext?.user
   
   
   const inputRef = useRef<HTMLInputElement | null>(null)
   
   const navigate = useNavigate();
   
   function handlePolicy(){
    setPolicyNotAgreed(false)
   }

 const handleCheck = (e: any) => {
  setChecked(e.target.checked);  // true when checked, false when unchecked
};

   
   
   useEffect(() => {
  const interval = setInterval(() => {
    if (window.google && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ["address"] }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        setFormData(prev => ({
          ...prev,
          address: place.formatted_address || ""
        }));
      });

      clearInterval(interval); // stop checking once initialized
    }
  }, 300);

  return () => clearInterval(interval);
}, []);


  const handleChange = (
  field: keyof drivewayFormData,
  value: string | File | File[] | null
) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};


  function sendHome(){
    navigate('/Home')
  }
  
  async function handleSubmit(){
  
        if(!formData.address || !formData.images || !formData.price  || !formData.walk){
          alert("Missing field")
          return
        }
    
    const token = localStorage.getItem("authToken")     // In login, the server returns a token. the payload has name and _id.
                                                       //  extracting the _id and assigning the ownerId from formData
    if (token){
    
      const decoded = jwtDecode<MyPayload>(token);
      const userId = decoded._id;
      

      const data = new FormData()
      data.append("ownerId", userId || "");
      data.append("address", formData.address);
      data.append("walk", formData.walk);
      data.append("price", formData.price);
      data.append("description", formData.description);
      const options = { 
        maxSizeMB: 1,
         maxWidthOrHeight: 1920, 
        useWebWorker: true 
      };
      for (const file of formData.images) { 
        const compressedFile = await imageCompression(file, options); 
        data.append("images", compressedFile); 
      }
      
    

        try{
          setIsLoading(true);
            const response = await axios.post('http://localhost:4000/api/driveways',data,{
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
              }
            })
            
            if(response.status === 201){
              setMessage("Thanks for adding your driveway! It’s now available for bookings:)")
            }
        
            console.log(response.data)

        }catch(error : any){
            if(error.response){
              console.error("Backend error:", error.response.status, error.response.data);
            }
            else if(error.request){
              console.error("No response received:", error.request);
            }
            else{
              console.error("Axios setup error:", error.message);
            }
          }
    }
  
  }

  return (
  <div>
    <div className="topAddDriveway">
      <img
        src="assets/logo.png"
        alt="logo"
        className="logo"
        onClick={sendHome}
      />
      <ProfileDropdown/>

    </div>
      

      {message === "" ? (
        <>
      {policyNotAgreed ? (
        <div className="policy-container">
        <div className="policy-box">
        <h3>Host Rules Agreement</h3>
         <p><strong>1. Accuracy of Information</strong><br />
         I agree to provide accurate details about my driveway, including location, size,
          access instructions, and any restrictions. I will update my listing if anything changes.
          </p>
          
        <p><strong>2. Availability</strong><br />
        I am responsible for keeping my availability accurate. If my driveway becomes unavailable,
        I will update the listing immediately.
        </p>

        <p><strong>3. Arrival Time</strong><br />
          Renters may arrive up to <strong>30 minutes before the game or event</strong>, unless I specify
          a different rule in my listing. I agree to honor the arrival window shown to the renter.
        </p>

        <p><strong>4. Safety & Accessibility</strong><br />
          My driveway will be safe, accessible, and free of hazards. I will clearly communicate any
          special instructions such as gates, codes, or narrow entrances.
        </p>
        
        <p><strong>5. Compliance With Local Laws</strong><br />
        I am responsible for ensuring that listing my driveway complies with local laws, property rules,
        and any HOA or building regulations.
        </p>
        
        <p><strong>6. Respectful Communication</strong><br />
        I will communicate with renters only through the app and respond promptly to questions or issues.
        </p>
        
        <p><strong>7. Cancellations</strong><br />
          If I need to cancel a booking, I will do so through the app. I understand that frequent cancellations
          may result in penalties or removal from the platform.
        </p>

        <p><strong>8. No Unauthorized Tow‑Away</strong><br />
          I will not tow or threaten to tow a renter’s vehicle unless they violate clearly stated rules.
          Any towing must follow local laws.
        </p>

        <p><strong>9. Condition of the Space</strong><br />
        My driveway will be available, clean, and usable at the renter’s arrival time. I will not block
          the space or allow others to use it during a confirmed booking.
          </p>

        <p><strong>10. Platform Policies</strong><br />
        I agree to follow all platform rules, terms of service, and safety guidelines. I understand that
          violations may result in suspension or removal from the platform.
        </p>
      </div>
      <label className="agree-label">
        <input type="checkbox" onChange={handleCheck} />
        I have read and agree to the Host Rules.
        
      </label>
      <button
      onClick={handlePolicy} 
      className="agreeButton"
      disabled={!checked} 
      >
          Agree and continue
          </button>

      </div>
    ) : 


    


    
    user ? (
      // Show the multi-step form if logged in

      <div className="box5">
       
      


        {step === 1 && (
          <div className="location5 step">
            <h2 className="locationHeader5">Where's your driveway located?</h2>
            <input
              ref={inputRef}
              className="locationInput5"
              placeholder="Driveway address"
              id="location"
              value={formData.address}
              onChange={e => handleChange("address", e.target.value)}
            />
            <p className="safety">
            Your exact location stays private until a reservation is confirmed
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="stadiumInfo5 step">
            <h3 className="title2">Walk from driveway to stadium:</h3>
            <section className="walk">
              <input
                type="radio"
                name="walk"
                id="under5"
                value="5 min"
                checked={formData.walk === "5 min"}
                onChange={e => handleChange("walk", e.target.value)}
              />
              <label htmlFor="under5">5 min</label>

              <input
                type="radio"
                name="walk"
                id="5to10"
                value="5-10 min"
                checked={formData.walk === "5-10 min"}
                onChange={e => handleChange("walk", e.target.value)}
                />
              <label htmlFor="5to10">5–10 min</label>

              <input
                type="radio"
                name="walk"
                id="10to20"
                value="10-20 min"
                checked={formData.walk === "10-20 min"}
                onChange={e => handleChange("walk", e.target.value)}
                />
                <label htmlFor="10to20">10–20 min</label>
                </section>
                </div>
        )}

        {step === 3 && (
          <div className="step">
            <h2 className="priceTitle">Price</h2>
            <h4 className="priceTitle">Set your price per reservation (in USD).</h4>
           <div className="pricing-note">
  <strong>Note:</strong> You can update your pricing at any time. Whether it’s due to playoffs, special events, or changing demand, you’re always in full control of your rates.
</div>

            {/* <input
              className="inputPrice"
              type="text"
              value={formData.price}
              /> */}
            <select
            value={formData.price}
            onChange={e => handleChange("price", e.target.value)}
            className="price-dropdown"
            >
              <option value="">Select price</option> 
              {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                 <option key={num} value={num}>
                   {num} 
                   </option>
                   ))}
                   
                   </select>
                   </div>
                  )}
                  
                  {step === 4 && (
                    <div className="step">
                    <h2 className="priceTitle">Add your pictures!</h2>
                    <div className="image-note">
                    <strong>Tip:</strong> Please upload clear, high‑quality photos of your driveway. Good lighting and accurate angles help renters feel confident and increase your chances of getting booked.
                    </div>
  
  
                    <div className="imageUploadBox">
                    <label className="uploadArea">
                    <span className="uploadText">Click to upload or drag images here</span>
                    <input
                    className="imageInput"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => {
                      const newFiles = e.target.files ? Array.from(e.target.files) : [];
                      handleChange("images", [...formData.images, ...newFiles]);
                    }}
  />
            {formData.images.length > 0 && (
              <div className="previewGrid">
          {formData.images.map((file, index) => (
            <div key={index} className="previewItem">
              <img src={URL.createObjectURL(file)} alt={`preview-${index}`} />
            </div>
          ))}
          </div>
        )}
        
        </label>
        </div>
        </div>
  
        )}
        
        {step === 5 && (
          <div className="step">
            <h3 className="priceTitle">Additional Information</h3>
            <div className="info-note">
  <strong>Additional Information:</strong> Feel free to include any extra details that might help renters understand your driveway better — such as access instructions, nearby landmarks, or anything unique about your space.
</div>

            <textarea
            className="textarea"
            id="message"
              name="message"
              rows={10}
              cols={60}
              placeholder="Write your text here..."
              value={formData.description}
              onChange={e => handleChange("description", e.target.value)}
              />
              </div>
        )}

        <section className="footer">
          <section className="line"></section>
          <section className="buttonWrapper">
            {step > 1 && (
              <button className="nextBtn" onClick={() => setStep(step - 1)}>
                Back
              </button>
            )}
            {step < 5 && (
              <button className="nextBtn" onClick={() => setStep(step + 1)}>
                Next
              </button>
            )}
            {step === 5 && (
              <button className="subBtn" onClick={handleSubmit}>
                Submit
              </button>
            )}
          </section>
          <p className="helper">Step {step} of 5</p> 
        </section>
            {isLoading && (
  <div className="loading-overlay">
    <div className="loading-spinner"></div>
    <p>Uploading your driveway…</p>
  </div>
)}

      </div>
    ) : (
      // Show login/signup prompt if no user
      <div className="signUpMessageBox">
      <h4 className="signUpMessage">Please Login or Signup to continue.</h4>
        <div className="bottomButtons">
          <Link to="/Signup" className="btn">Signup</Link>
          <Link to="/Login" className="btn">Login</Link>
        </div>
      </div>
    )}
</>
) : <p className="addedCarMsg">{message}</p>}
    </div>
);
}

export default AddDriveway;
