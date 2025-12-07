import { useState, useRef, useEffect } from "react";
import '../style/AddDriveway.css'
import { Link, useNavigate } from "react-router";
import { button, div, p } from "framer-motion/client";
import { useContext } from "react";
import { UserContext } from '../userContext'




export function AddDriveway() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    address: "",
    walk: "",
    stadium: "",
    price: "",
    image: "",
    description: ""
  });
  const [blink, setBlink] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

   const userContext = useContext(UserContext)
   const user = userContext?.user


  const inputRef = useRef<HTMLInputElement | null>(null)

  const navigate = useNavigate();

   

   useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      { types: ["address"] } // only suggest addresses
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      setFormData(prev => ({
        ...prev,
        address: place.formatted_address || "" // update with full address
      }));
    });
  }, []);


  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  

  function sendHome(){
        navigate('/Home')
    }

  async function handleSubmit(){
    if(!formData.address || !formData.image || !formData.price || !formData.stadium || !formData.walk){
      alert("Missing field")
      return
    }
    try{

      setError("")
      const token = localStorage.getItem("jwt")
      const response = await fetch('http://localhost:4000/spots/addSpot',{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      })
      if (response.status === 201) {
        const data = response.json().catch()
        console.log(data)
        setMessage("Your driveway has been uploaded successfully!!");
        alert("Added driveway successfully!")
        sendHome()
     
    } else {
      setMessage("❌ Something went wrong, please try again.");
      
      
    }
  }catch(error){
    console.log(error)
  }
}
  
  return (
    <div>
        <div className="topAddDriveway">
               <img src="https://copilot.microsoft.com/th/id/BCO.3ed9eebf-b8d1-4d88-b6e0-2ba831a1eea3.png" alt="logo" className="logo" onClick={sendHome} />
        </div>


        
  <>
    {user ? (
      <div className="box5">
        {step === 1 && (
          <div className="location5 step">
            <h2 className="locationHeader5">Where's your driveway located?</h2>
            <label htmlFor="location"></label>
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
             <h2 className="title2">My driveway is near:</h2>
      <section className="stadium5">

            <input
              type="radio"
              name="stadium"
              id="MarlinsPark"
              value="Marlins Park"
              checked={formData.stadium === "Marlins Park"}
              onChange={e => handleChange("stadium", e.target.value)}
              />
            <label htmlFor="MarlinsPark">Marlins Park</label>

            <input
              type="radio"
              name="stadium"
              id="WrigleyField"
              value="Wrigley Field"
              checked={formData.stadium === "Wrigley Field"}
              onChange={e => handleChange("stadium", e.target.value)}
            />
            <label htmlFor="WrigleyField">Wrigley Field</label>

            <input
              type="radio"
              name="stadium"
              id="CitiField"
              value="Citi Field"
              checked={formData.stadium === "Citi Field"}
              onChange={e => handleChange("stadium", e.target.value)}
            />
            <label htmlFor="CitiField">Citi Field</label>

     </section>

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
            <h2>Price</h2>
            <p>How much would you like to charge per game?(dollars)</p>
            <input
              className="input"
              type="text"
              value={formData.price}
              onChange={e => handleChange("price", e.target.value)}
            />
          </div>
        )}

        {step === 4 && (
          <div className="step">
            <h2>Add your pictures!</h2>
            <input
              className="input"
              type="text"
              placeholder="Image URL"
              value={formData.image}
              onChange={e => handleChange("image", e.target.value)}
            />
          </div>
        )}

        {step === 5 && (
          <div className="step">
            <h3>Additional Information</h3>
            <div>
              <label htmlFor="message">Your Message:</label>
              <br />
              <textarea
                id="message"
                name="message"
                rows={10}
                cols={60}
                placeholder="Write your text here..."
                value={formData.description}
                onChange={e => handleChange("description", e.target.value)}
              />
            </div>
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

        {message && <p className="message">{message}</p>}
        </div>
      ) : (
      
        <>
      <div className="signUpMessageBox">
      <h4 className="signUpMessage">Please Login or Signup to continue.</h4>
      <div className="bottomButtons">
          <Link to="/Signup" className='btn'>Signup</Link>
          <Link to="/Login" className='btn'>Login</Link>
      </div>
      </div>
      </>
    )}
  </>


        
    
        </div>
  );

}



export default AddDriveway;
