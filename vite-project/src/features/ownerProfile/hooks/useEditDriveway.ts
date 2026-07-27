import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { ownerProfileService } from "../services/ownerProfileService";

interface ExistingImage {
  _id?: string;
  url: string;
}

export interface DrivewayFormState {
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  latitude: number;
  longitude: number;
  publicDisplay: string;
  walk: string;
  price: string;
  existingImages: ExistingImage[];
  newImages: File[];
  rules: string[];
  description: string;
}

const initialFormData: DrivewayFormState = {
  name: "",
  address: "",
  city: "",
  state: "",
  zipcode: "",
  latitude: 0,
  longitude: 0,
  publicDisplay: "",
  walk: "",
  price: "",
  existingImages: [],
  newImages: [],
  rules: [],
  description: ""
};

export function useEditDriveway() {
  const { drivewayId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken") || "";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [formData, setFormData] = useState<DrivewayFormState>(initialFormData);

  useEffect(() => {
    if (!token) {
      navigate("/Login");
    }
  }, [token, navigate]);

  useEffect(() => {
    async function fetchDriveway() {
      if (!drivewayId) {
        setLoading(false);
        setMessage("Missing driveway id");
        setMessageType("error");
        return;
      }

      try {
        setLoading(true);
        const response = await ownerProfileService.fetchDrivewayById(drivewayId);
        const driveway = response?.driveway || response;

        const existingImages = Array.isArray(driveway?.images)
          ? driveway.images.map((img: ExistingImage | string) =>
              typeof img === "string" ? { url: img } : img
            )
          : [];

        setFormData({
          name: driveway?.name || "",
          address: driveway?.address || "",
          city: driveway?.city || "",
          state: driveway?.state || "",
          zipcode: driveway?.zipcode || "",
          latitude: driveway?.latitude || 0,
          longitude: driveway?.longitude || 0,
          publicDisplay: driveway?.publicDisplay || "",
          walk: driveway?.walk || "",
          price: driveway?.price || "",
          existingImages,
          newImages: [],
          rules: driveway?.rules || [],
          description: driveway?.description || ""
        });
      } catch (error: any) {
        const data = error?.response?.data;
        const errMessage =
          typeof data === "string"
            ? data
            : data?.message || data?.error || "Failed to load driveway";
        setMessage(errMessage);
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    }

    fetchDriveway();
  }, [drivewayId]);

  function handleChange(field: keyof DrivewayFormState, value: any) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleRuleToggle(rule: string) {
    setFormData((prev) => {
      const alreadySelected = prev.rules.includes(rule);
      return {
        ...prev,
        rules: alreadySelected
          ? prev.rules.filter((r) => r !== rule)
          : [...prev.rules, rule]
      };
    });
  }

  function removeExistingImage(index: number) {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index)
    }));
  }

  function removeNewImage(index: number) {
    setFormData((prev) => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index)
    }));
  }

  async function handleSubmit() {
    if (!drivewayId) {
      setMessage("Missing driveway id");
      setMessageType("error");
      return;
    }

    if (!formData.address || !formData.price || !formData.walk) {
      setMessage("Please fill in address, price, and walking time.");
      setMessageType("error");
      return;
    }

    if (formData.existingImages.length + formData.newImages.length === 0) {
      setMessage("Please keep or add at least one image.");
      setMessageType("error");
      return;
    }

    try {
      setLoadingSubmit(true);
      setMessage("");

      const data = new FormData();
      data.append("name", formData.name);
      data.append("address", formData.address);
      data.append("city", formData.city);
      data.append("state", formData.state);
      data.append("zipcode", formData.zipcode);
      data.append("latitude", formData.latitude.toString());
      data.append("longitude", formData.longitude.toString());
      data.append("publicDisplay", formData.publicDisplay);
      data.append("walk", formData.walk);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("rules", JSON.stringify(formData.rules));
      data.append("existingImages", JSON.stringify(formData.existingImages));

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };

      for (const file of formData.newImages) {
        const compressedBlob = await imageCompression(file, options);
        const compressedFile = new File([compressedBlob], file.name, {
          type: file.type
        });
        data.append("images", compressedFile);
      }

      await ownerProfileService.updateDriveway(drivewayId, data);

      setMessage("Driveway updated successfully!");
      setMessageType("success");

      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error: any) {
      const data = error?.response?.data;
      const errMessage =
        typeof data === "string"
          ? data
          : data?.message || data?.error || "Failed to update driveway";
      setMessage(errMessage);
      setMessageType("error");
    } finally {
      setLoadingSubmit(false);
    }
  }

  function sendHome() {
    navigate("/Home");
  }

  return {
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
  };
}
