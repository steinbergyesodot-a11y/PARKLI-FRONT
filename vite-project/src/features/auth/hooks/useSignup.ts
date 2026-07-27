import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../../../userContext";
import { authService } from "../services/authService";
import { signupSchema } from "../utils/signupSchema";

interface MyJwtPayload {
  firstName: string;
  lastName: string;
  _id: string;
  exp: number;
  roles?: string[];
  email?: string;
  drivewayIds?: string[];
}

export function useSignup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const getTurnstileToken = (): string | null => {
    const token = (document.querySelector(
      'input[name="cf-turnstile-response"]'
    ) as HTMLInputElement | null)?.value;
    return token || null;
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setMessage("");

    try {
      // Validate using schema
      const validationResult = signupSchema.safeParse({
        firstName,
        lastName,
        email,
        password,
        confirmPassword: password2,
      });

      if (!validationResult.success) {
        const issues = validationResult.error.issues;
        setErrorMessage(issues[0].message || "Validation failed");
        setLoading(false);
        return;
      }

      // Check Turnstile token
      const turnstileToken = getTurnstileToken();
      if (!turnstileToken) {
        setErrorMessage("Please complete the CAPTCHA.");
        setLoading(false);
        return;
      }

      // Call signup service
      const response = await authService.signup({
        firstName,
        lastName,
        email,
        password,
        token: turnstileToken,
      });

      const jwtToken = response.token;
      if (jwtToken) {
        localStorage.setItem("authToken", jwtToken);

        // Decode token
        const decoded = jwtDecode<MyJwtPayload>(jwtToken);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp > now) {
          // Update user context
          userContext?.setUser({
            _id: decoded._id,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            email: decoded.email,
            roles: decoded.roles,
            drivewayIds: decoded.drivewayIds,
          });
        } else {
          localStorage.removeItem("authToken");
          userContext?.setUser(null);
          setErrorMessage("Login token expired. Please try again.");
          setLoading(false);
          return;
        }
      }

      setMessage(response.message || "Account created successfully!");

      // Clear form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setPassword2("");

      setTimeout(() => {
        navigate("/Home");
      }, 2000);
    } catch (error: any) {
      const data = error.response?.data;
      const errorMsg =
        typeof data === "string"
          ? data
          : data?.message ||
            data?.error ||
            error.message ||
            "Signup failed. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return {
    // Form state
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    password2,
    setPassword2,
    // UI state
    loading,
    errorMessage,
    message,
    // Handlers
    handleSubmit,
  };
}