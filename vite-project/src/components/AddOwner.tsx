import { useState } from 'react'
import '../style/AddOwner.css'
import { useDropzone } from 'react-dropzone';
import { data } from 'react-router';
import { useNavigate } from 'react-router';

type GeoapifyPlace = {
  properties: {
    formatted: string;
    place_id: string;
    [key: string]: any; 
  };
};


export function AddOwner(){
    const[query,setQuery] = useState('')
    const[options,setOptions] = useState<GeoapifyPlace[]>([])
    const[stadium, setStadium] = useState('')
    const[walk,setWalk] = useState('')
    const[price,setPrice] = useState('')
    const[url,setURL] = useState('')

    const navigate = useNavigate();

    const apiKey = '7acd13c9bd4b438fb789f912937d5fc7'

    const token = localStorage.getItem('token');

    // function handleFileChange(e: any) {
    // const file = e.target.files[0];
    //   if (file) {
    //     setPhoto(file);
    //   }
    // }

    async function handleChange(e:any){
        const value = e.target.value;
        setQuery(value);

         if (!value || value.trim() === '') {
         setOptions([]);
         return;
        }
        if (value.length < 5) {
            setOptions([]);
            return;
        }
        try {
          const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(value)}&apiKey=${apiKey}`;
          const response = await fetch(url);
          const data = await response.json();
            setOptions(data.features);
          }catch (error) {
            console.error('Fetch error:', error);
        }
    }


    function handleSelect(place: GeoapifyPlace){
        setQuery(place.properties.formatted);
        setOptions([])
    }

 

    function handlePrice(event: any){
      setPrice(event.target.value)
    }

    function handleStadium(event:any){
      setStadium(event.target.value)
    }

    function handleWalk(event:any){
      setWalk(event.target.value)
    }

    function handleURL(event:any){
      setURL(event.target.value)
    }

     function sendHome(){
        navigate('/Home')
    }


    function handleSubmit(event:any){
        event.preventDefault();

        // const formData = new FormData();
        // formData.append('address', query);
        // formData.append('stadium', stadium);
        // formData.append('price', price);
        // formData.append('walk',walk)
        // if (photo) {
        //     formData.append('photo', photo);
        // }
        // console.log(formData)
      fetch('http://localhost:4000/spots/addSpot',{
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          address:query,
          stadium:stadium,
          walk:walk,
          price:price,
          image:url

        })
      })
    }

  

    return(
        <div>
          <div className="topDashboard">
               <img src="https://copilot.microsoft.com/th/id/BCO.3ed9eebf-b8d1-4d88-b6e0-2ba831a1eea3.png" alt="logo" className="logo" onClick={sendHome} />
            
            
            </div>
            <h1 className='title'>Advertise your driveway</h1>
            

            <form className='form' onSubmit={handleSubmit}>
                
                <div className='addressGroup'>
                <label htmlFor="address">What's your address?</label>
                <input className='addressBox'
                    id='address'
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    required
                />
                </div>

                <section className="suggestions">
                      {options.map((item) => (
                <div
                   key={item.properties.place_id}
                   onClick={() => handleSelect(item)} 
                   className="suggestion-item"
                 >
                {item.properties.formatted}
                </div>
                ))}
                </section>

                 

                <div className='formGroup'>
                <label htmlFor="Stadium">My driveway is near:</label>
                <select id="Stadium" name="Stadium" className='dropdown' onClick={handleStadium} required>
                  <option value="">--Please choose an option--</option>
                  <option value="Fenway Park">Fenway Park(Boston Red Sox)</option>
                  <option value="Wrigley Field">Wrigley Field(Chicago Cubs)</option>
                  <option value="Petco Park">Petco Park(San Diego Padres)</option>
                  <option value="Wrigley Field">Oracle Park(San Francisco Giants)</option>
                  <option value="Camden Yards">Camden Yards(Baltimore Orioles)</option>
                  

                </select>
                </div>

                <h3>Walk to stadium:</h3>
                <div className='formGroup'>
                   <label className="option">
                   <input type="radio" name="duration" value="5-10" required onClick={handleWalk}/>
                   <span>5 - 10 min</span>
                  </label>

                <label className="option">
                 <input type="radio" name="duration" value="10-15" onClick={handleWalk}/>
                 <span>10 - 15 min</span>
                </label>

               <label className="option">
                 <input type="radio" name="duration" value="15+" onClick={handleWalk}/>
                 <span>15+ min</span>
               </label>


                </div>


                <div className='formGroup'>
                  <label htmlFor="price">Price per game: ($)</label>
                  <input type="text" id='price' name='price'  className='dropdown' onChange={handlePrice} />
                </div>




                {/* <div className='formGroup'>
                <label>Upload a photo:</label>
                <input type="file" accept="image/*" onChange={handleFileChange} required />
                </div> */}
                <input
                 type="text" 
                 value={url}
                 id='url'

                placeholder='Enter image url'
                onChange={handleURL}
                 />

                <button type='submit'className='submitBtn'>Submit</button>

            </form>


            
        </div>
    )
}
