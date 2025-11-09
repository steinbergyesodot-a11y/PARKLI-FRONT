import { useState } from 'react'
import '../style/AddOwner.css'
import { useDropzone } from 'react-dropzone';

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
    const[photo, setPhoto] = useState<File | null>(null);
    const[stadium, setStadium] = useState('')

    const apiKey = '7acd13c9bd4b438fb789f912937d5fc7'

    function handleFileChange(e: any) {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      console.log('Selected photo:', file.name);
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

   

   



    return(
        <div>
            <h1 className='title'>Advertise your driveway</h1>
            

            <form className='form'>
                {/* <div className="radio">
                  <label>
                  <input type="radio" name="role" value="owner"/>
                  Rent out my driveway
                  </label>

                  <label>
                  <input type="radio" name="role" value="renter"/>
                  Rent a driveway
                  </label>
                </div> */}
                <div className='addressGroup'>
                <label htmlFor="address">What's your address?</label>
                <input className='addressBox'
                id='address'
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder="Enter your address"
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

                <div className='dateGroup'>
                <label htmlFor="date">When is your driveway available?</label>
                <input type="date" id="date" name="date" className='dateBox' />
                </div>

                <div className='formGroup'>
                <label htmlFor="Stadium">My driveway is near:</label>
                <select id="Stadium" name="Stadium" className='dropdown'>
                   <option value="">--Please choose an option--</option>
                   <option value="Fenway Park">Fenway Park</option>
                  <option value="Wrigley Field">Wrigley Field</option>
                </select>
                </div>


                <div className='formGroup'>
                <label>Upload a photo:</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {photo && <p>Selected: {photo.name}</p>}
                </div>

            </form>


            
        </div>
    )
}
