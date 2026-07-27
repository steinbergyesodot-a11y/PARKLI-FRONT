import { useContext, useState } from "react";
import { UserContext } from "../../../userContext";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import imageCompression from "browser-image-compression";
import { addDrivewayService } from "../services/addDrivewayService";

interface drivewayFormData {
  ownerId: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  latitude:number;
  longitude:number;
  publicDisplay:string;
  name: string;
  walk: string;
  price: string;
  images: File[];
  rules: string[];
  description: string;
}

type MyPayload = JwtPayload & { _id?: string; name?: string; };

export function useAddDriveway() {
    const [step,setStep] = useState(1);
    const [formData, setFormData] = useState<drivewayFormData>({
        ownerId: "",
        address: "",
        city:"",
        state: "",
        zipcode: "",
        latitude: 0,
        longitude: 0,
        publicDisplay: "",
        name: "",
        walk: "",
        price: "",
        images: [],
        rules:[] as string[],
        description: ""
      });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
    const [isLoading, setIsLoading] = useState(false);
    const [showWelcoming,setShowWelcoming] = useState(true) // step 1
    const [showAgreement,setShowAgreement] = useState(false) // step 2
    const [userAgreed, setUserAgreed] = useState(false)     // in step 2
    const [startListing,setStartListing] = useState(false)  // step 3
    const [onboardingUrl, setOnboardingUrl] = useState<string | null>(null);
    
     const location = useLocation();
       const userContext = useContext(UserContext)
       const user = userContext?.user
       const token = localStorage.getItem("authToken") 
    
       const navigate = useNavigate();


    const handleChange = (
        field: keyof drivewayFormData,
        value: string | string[] | File | File[] | null
        ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    async function createDriveway(){
         if(!formData.address || !formData.images || !formData.price  || !formData.walk || formData.description.length < 5){
          setMessage("Please fill address, add at least one image, select a price and walking time.");
          return
        }
        const token = localStorage.getItem("authToken");

        if (token){
          const decoded = jwtDecode<MyPayload>(token);
          const userId = decoded._id;
          const data = new FormData()
          data.append("ownerId", userId || "");
          data.append("address", formData.address);
          data.append("city", formData.city);
          data.append("state", formData.state);
          data.append("zipcode", formData.zipcode);
          data.append("latitude", formData.latitude.toString());
          data.append("longitude", formData.longitude.toString());
          data.append("publicDisplay", formData.publicDisplay);
          data.append("name",formData.name)
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
                const compressedBlob = await imageCompression(file, options);
                const compressedFile = new File([compressedBlob], file.name, {
                type: file.type
            });
            data.append("images", compressedFile);
            }    
            try{
                setMessage("")
                setMessageType("info")
                setIsLoading(true)
                const apiResponse = await addDrivewayService.addDriveway(data);
                if(apiResponse.success){
                  const onboardingUrl = apiResponse.data.onboardingUrl;
                  const drivewayId = apiResponse.data.drivewayId || apiResponse.data._id;
                  const drivewayAddress = apiResponse.data.address;
            
            // Store newly created driveway info for Onboard-Complete
            if (drivewayId || drivewayAddress) {
              localStorage.setItem("newDrivewayId", drivewayId || "");
              localStorage.setItem("newDrivewayAddress", drivewayAddress || "");
            }
            
            if (onboardingUrl) {
              setOnboardingUrl(onboardingUrl)
              // window.location.href = onboardingUrl;
              return;
            }
          }
            }catch(error:any){
                let userMsg = "";
                if (error?.response?.data) {
                  const data = error.response.data;
                    userMsg =
                    typeof data === "string"
                        ? data
                : data?.message || data?.error || JSON.stringify(data);
                } else if (error?.message) {
                    userMsg = error.message;
                }
                     setMessage(userMsg);
          setMessageType("error");
            }finally{
                setIsLoading(false)
            }
          }
    }

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


    function handleShowAgreement(){
      setShowWelcoming(false)
       setShowAgreement(true)
   }

   function handleUserAgreed(){
    setUserAgreed(true)
   }

   function handleStartListing(){
    setShowAgreement(false)
      setStartListing(true)
   }

     function sendHome(){
    navigate('/Home')
  }

    return {
        step,
        setStep,
        formData,
        setFormData,
        message,
        setMessage,
        messageType,
        setMessageType,
        isLoading,
        setIsLoading,
        userAgreed,
        setUserAgreed,
        showWelcoming,
        setShowWelcoming,
        showAgreement,
        setShowAgreement,
        onboardingUrl,
        setOnboardingUrl,
        handleChange,
        createDriveway,
        handleShowAgreement,
        sendHome,
        handleUserAgreed,
        startListing,
        setStartListing,
        handleStartListing,
        handleRuleToggle,
    };

}