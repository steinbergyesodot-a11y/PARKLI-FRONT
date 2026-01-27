import { useState, useRef, useEffect } from "react";
import '../style/AddDriveway.css'
import { useContext } from "react";
import { UserContext } from '../userContext'
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import imageCompression from "browser-image-compression";
import { ProfileDropdown } from "./ProfileDropdown";
import { button, div, p, section } from "framer-motion/client";
import { Login } from "./Login";
import { useLocation } from "react-router-dom";
import { PlaceAutocompleteTS } from "./PlaceComplete";


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
    "Do not block neighbor’s driveway",
    "Be respectful of neighbors",
    "Do not leave trash behind",
    "Follow posted neighborhood signs"
  ]
};
 
type MyPayload = JwtPayload & { _id?: string; name?: string; };

interface drivewayFormData {
  ownerId: string;
  address: string;
  walk: string;
  price: string;
  images: File[];
  rules: string[];
  description: string;
}


export function AddDriveway2(){

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<drivewayFormData>({
    ownerId: "",
    address: "",
    walk: "",
    price: "",
    images: [],
    rules:[] as string[],
    description: ""
  });
  const [message, setMessage] = useState("");
  const [policyNotAgreed, setPolicyNotAgreed] = useState(true)
  const [checked,setChecked] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const[startListing,setStartListing] = useState(false)

   const location = useLocation();
   const userContext = useContext(UserContext)
   const user = userContext?.user
   const token = localStorage.getItem("authToken")     // In login, the server returns a token. the payload has name and _id.

   const navigate = useNavigate();
   
   function handlePolicy(){
    setPolicyNotAgreed(false)
   }

 const handleCheck = (e: any) => {
  setChecked(e.target.checked);  
};

function handleListing(){
    setStartListing(true)
}








  const handleChange = (
  field: keyof drivewayFormData,
  value: string | string[]| File | File[] | null
) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};



function handleRuleToggle(rule:any) {
  setFormData(prev => {
    const alreadySelected = prev.rules.includes(rule);

    return {
      ...prev,
      rules: alreadySelected
        ? prev.rules.filter(r => r !== rule) // remove
        : [...prev.rules, rule]              // add
    };
  });
}



  function sendHome(){
    navigate('/Home')
  }
  
  async function handleSubmit(){
  
        if(!formData.address || !formData.images || !formData.price  || !formData.walk){
          alert("Missing field")
          return
        }
    
    const token = localStorage.getItem("authToken")     
                                                      
    if (token){
    
      const decoded = jwtDecode<MyPayload>(token);
      const userId = decoded._id;
      

      const data = new FormData()
      data.append("ownerId", userId || "");
      data.append("address", formData.address);
      data.append("walk", formData.walk);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("rules", JSON.stringify(formData.rules));
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
          }finally{
            setIsLoading(false)
          }
    }
  
  }

if (startListing === false) {
  return (
    <>
       <div className="topAddDriveway">
      <img
        src="/logo.png"
        alt="logo"
        className="logo"
        onClick={sendHome}
      />
      <ProfileDropdown/>

    </div>
    <div className="listing-intro">
      <h2 className="listing-title">Start Earning With Your Driveway</h2>

      <p className="listing-subtitle">
        Earn money by renting out your driveway on game days.  
        It only takes a few minutes to get started.
      </p>

      <button className="listing-start-btn" onClick={handleListing}>
        Start Listing
      </button>
    </div>
    </>
  );
}


  if(!policyNotAgreed){
    return(
        <>
        <div className="page">

             {isLoading && (
               <div className="loading-overlay">
                 <div className="loading-spinner"></div>
                 <p>Uploading your driveway…</p>
               </div>
             )}

           <div className="topAddDriveway">
              <img
                src="/logo.png"
                alt="logo"
                className="logo"
                onClick={sendHome}
              />
              <ProfileDropdown/>
           </div>

          {message ? (
            <p className="addedCarMsg">{message}</p>
          ) : (

            
            <div className="box5">
            
            {message && (
             <>
             <p className="addedCarMsg">{message}</p>
             </>
           )}

           
{step === 1 && (
  <div className="locationBox step">
    <h2>Where's your driveway located?</h2>

  <PlaceAutocompleteTS
  
  onSelect={address => {
    console.log("Selected:", address);
    setFormData(prev => ({ ...prev, address }));
  }}
/>




    <p className="safety">
      We only show renters your street and approximate location.
    </p>
  </div>
)}



       {step === 2 && (
        <section className="stadiumInfoBox">
    <div className="stadiumInfo5 step">
    <h3 className="title2">Walk from driveway to stadium:</h3>

    <section className="walk">
      <select
        value={formData.walk}
        onChange={e => handleChange("walk", e.target.value)}
        className="walk-select"
      >
        <option value="">Select walking time</option>

        {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
          <option key={num} value={num}>
            {num} minutes
          </option>
        ))}
      </select>
    </section>
  </div>
  </section>
)}


        {step === 3 && (
          <section className="priceBoxLarger">
          <div className="priceBox">
            <h2 className="priceTitle">Set YourPrice</h2>
            <h4 className="priceTitle2">Set your price per reservation (USD).</h4>
           <div className="pricing-note">
            <strong>Note:</strong> You can update your pricing at any time. Whether it’s due to playoffs, special events, or changing demand, you’re always in full control of your rates.
           </div>
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
          </section>
        )}
                

                  
                  {step === 4 && (
                    <div className="imagesBoxLarger">
                    <section className="imagesBox step">
                    
                    <h2>Add your pictures!</h2>
                    <div className="image-note">
                      <strong>Tip:</strong> Please upload clear, high‑quality photos of your driveway.<br />
Good lighting and accurate angles help renters feel confident and increase your chances of getting booked.

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
              
              </section>
              </div>
        
              )}


        {step === 5 && (
          <>
           <div className="rules-section">
           <p className="title3">Rules for your driveway</p>
           <p className="title4">Select all the rules that apply to your driveway.</p>


          {Object.entries(ruleCategories).map(([category, rules]) => (
            <div key={category} className="rule-category">
            <h4 className="category-title">{category}</h4>

       {rules.map(rule => (
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
    </>
    )}


        {step === 6 && (
          <section className="descriptionBoxLarger">
          <div className="descriptionBox step">
            <h3>Additional Information</h3>
            <div className="info-note">
  <strong>Additional Information:</strong> Feel free to include any extra details that might help renters understand your driveway better.<br />
  Such as access instructions, nearby landmarks, or anything unique about your space.
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
              </section>
        )}
        {step === 7 && (
          <>
          <div className="reviewOuterBox">
          <section className="reviewBox">

              <div className="reviewLocation">
                <div>
                <h3>LOCATION</h3>
                <p>{formData.address}</p>
                <p className="exact">Exact address shown only after booking</p>
                </div>
                <button className="editButton" >Edit</button>
              </div>
              <hr />

              <div className="reviewPrice">
                <div>
                <h3>PRICE</h3>
                <p>${formData.price} per game</p>
                </div>
                <button className="editButton">Edit</button>
              </div>
              <hr />


              <div className="reviewWalk">
              <div>
                <h3>WALKING DISTANCE</h3>
                <p>{formData.walk} minute walk</p>
              </div>
              <button className="editButton">Edit</button>
            </div>
              <hr />

            <div className="reviewDescription">
              <div>
                <h3>Description</h3>
                <p>{formData.description}</p>
              </div>
              <button className="editButton">Edit</button>
            </div>
                          <hr />


            <div className="reviewRules">
              <div>
            <h3>RULES</h3>
            <ul>
              {formData.rules.map((rule, index) => (
                <li key={index}>✔ {rule}</li>
              ))}
            </ul>
            </div>
              <button className="editButton">Edit</button>

          </div>
                                    <hr />


          <div className="reviewImages">
  <h3>PHOTOS</h3>

  <div className="imageGrid">
    {formData.images.map((file, index) => (
      <img
        key={index}
        src={URL.createObjectURL(file)}
        alt={`Driveway ${index}`}
        className="previewImage"
        />
    ))}
  </div>
</div>
            <hr />

<p className="agreementText">
  By publishing your listing, you confirm that all information is accurate and
  that you agree to follow our hosting rules and community guidelines.
  <br />
  <a href="/terms" className="termsLink">View Terms of Use</a>
</p>

<button onClick={handleSubmit} className="listBtn">List Driveway</button>

       </section>
       </div>

          
          </>
        )}
</div>      

)}
  <div className="buttonWrapper">

    {step === 1 && (
      <button className="nextBtn" onClick={() => setStep(step + 1)}>
        Next
      </button>
    )}

    {step > 1 && step < 7 && (
      <>
        <div className="bothButtons">
        <button className="nextBtn" onClick={() => setStep(step - 1)}>
          Back
        </button>

        <button className="nextBtn" onClick={() => setStep(step + 1)}>
          Next
        </button>
        </div>
      </>
    )}

    {step === 7 && (
      <>
        <button className="nextBtn" onClick={() => setStep(step - 1)}>
          Back
        </button>
      </>
    )}

  <p className="helper">Step {step} of 7</p>
  </div>





          
</div>

        </>
    )
  }

    return(   // if user is logged in
        <>
      {token ? (
        <>
      <div className="topAddDriveway">
      <img
        src="/logo.png"
        alt="logo"
        className="logo"
        onClick={sendHome}
      />
      <ProfileDropdown/>

    </div>
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

        </>

       ) 
       :
       <>
       <div className="login-overlay-container">
  <p className="login-overlay-text">
    In order to start listing your driveway, you need to Login or Signup
  </p>

  <Login from={location.pathname} />
</div>

       </>
    
       }
       
        </>
        
    )
}