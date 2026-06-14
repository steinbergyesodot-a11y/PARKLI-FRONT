import { useContext, useState, useEffect } from "react";
import { drivewayDetailedService } from "../services/drivewayDetailedService";
import { useNavigate, useParams } from "react-router-dom";


interface Driveway {
  _id: string;
  address: string;
  publicDisplay: string;
  walk: number;
  name: string;
  stadium: string;
  price: number;
  description: string;
  rules: string[]
  images: string[];
  PostedAt: string;
}

type Coords = {
  lat: number;
  lng: number;
};


export function useDrivewayDetailed() {
  const [driveway, setDriveway] = useState<Driveway | null>(null);
  const [images,setImages] = useState([])
  const [curImage,setCurImage] = useState(0)

  const [coords, setCoords] = useState<Coords | null>(null);
  const [showRentalRules, setShowRentalRules] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message,setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null);



  const { id } = useParams();
  const navigate = useNavigate();

  async function getDrivewayById({id}:any) {
    setIsLoading(true)
    setErrorMessage(null);
    try{
        const driveway = await drivewayDetailedService.getDrivewayById(id);
        setDriveway(driveway);
        setImages(driveway.images || []);
        setIsLoading(false)

    }catch(error: any){
        const errorMsg = error.message || "Failed to load driveway details";
        console.error("Error fetching driveway details:", error);
        setErrorMessage(errorMsg);
        setIsLoading(false)
    }finally{
        setIsLoading(false)
    }
  }

  useEffect(() => {
    getDrivewayById({id})
  }, [id]);


  useEffect(() => {
  if (!driveway?.address) return;

  // Ensure Google Maps JS API is loaded
  if (!(window as any).google || !(window as any).google.maps) return;

  const geocoder = new (window as any).google.maps.Geocoder();

  geocoder.geocode({ address: driveway.address }, (results: any, status: string) => {
    if (status === "OK" && results[0]) {
      const location = results[0].geometry.location;
      setCoords({
        lat: location.lat(),
        lng: location.lng()
      });
    } else {
      // show a friendly message to the user and keep showing textual address
      setMessage("Map unavailable — showing address only.");
      setCoords(null);
      // auto-clear after a short time
      setTimeout(() => setMessage(""), 4000);
    }
  });
}, [driveway?.address]);

  function sendHome() {
            navigate('/Home');
  }
function handleCurImage() {
  setCurImage(prev =>
    prev === images.length - 1 ? 0 : prev + 1
  );
}

function toggleRentalRules() {
  setShowRentalRules(prev => !prev);
}

function handleCurImageBack() {
  setCurImage(prev =>
    prev === 0 ? images.length - 1 : prev - 1
  );
}

  return { driveway, setDriveway,images, coords, setCoords, showRentalRules, setShowRentalRules, isLoading, setIsLoading, curImage, setCurImage, message, setMessage, errorMessage, setErrorMessage,handleCurImage,handleCurImageBack,toggleRentalRules,sendHome };

}