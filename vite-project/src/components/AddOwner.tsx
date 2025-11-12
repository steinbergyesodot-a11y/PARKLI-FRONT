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
    const[photo, setPhoto] = useState(null);
    const[stadium, setStadium] = useState('')
    const[avaiableByDefault,setAvailableByDefault] = useState(true)
    const[price,setPrice] = useState('')

    const navigate = useNavigate();

    const apiKey = '7acd13c9bd4b438fb789f912937d5fc7'

    function handleFileChange(e: any) {
    const file = e.target.files[0];
      if (file) {
        setPhoto(file);
      }
    }

    async function handleChange(e:any){
        const value = e.target.value;
        setQuery(value);

         if (!value || value.trim() === '') {
         setOptions([]);
         return;
        }
        if (value.length < 3) {
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

    function handleAvaiable(){
      setAvailableByDefault(!avaiableByDefault)
    }

    function handlePrice(event: any){
      setPrice(event.target.value)
    }

    function handleStadium(event:any){
      setStadium(event.target.value)
    }

    function handleSubmit(event:any){
        event.preventDefault();

        const formData = new FormData();
        formData.append('address', query);
        formData.append('stadium', stadium);
        formData.append('price', price);
        if (photo) {
            formData.append('photo', photo);
        }
        try{
          fetch('http://localhost:4000/spots/addSpot',{
            method:'POST',
            body: formData
          })
          .then(response => response.json())
          .then(data => console.log(data))
          alert('Advretised successfully!')
          navigate('/');

        }catch(error){
          console.log(error)
        }

    }

  

    return(
        <div>
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

                 <label>
                  <input type="radio" name="avaiableByDefault" value="Yes" onClick={handleAvaiable}/>
                  My driveway is availalbe by default
                  </label>
                  <label>
                  <input type="radio" name="avaiableByDefault" value="no" onClick={handleAvaiable}/>
                  My driveway is <mark>not</mark> availalbe by default

                  </label>

                {!avaiableByDefault? 
                <div className='dateGroup'>
                <label htmlFor="date">When is your driveway available?</label>
                <input type="date" id="date" name="date" className='dateBox' />
                </div> : <p></p>
                }

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


                <div className='formGroup'>
                  <label htmlFor="price">Price per game: ($):</label>
                  <input type="text" id='price' name='price' onChange={handlePrice} />
                </div>




                <div className='formGroup'>
                <label>Upload a photo:</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {/* {photo && <p>Selected: {photo.name}</p>} */}
                </div>

                <button type='submit'className='submitBtn'>Submit</button>

            </form>


            
        </div>
    )
}
