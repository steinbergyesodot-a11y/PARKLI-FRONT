import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../../../userContext";
import { authService } from "../services/authService";
import { loginSchema } from "../utils/loginSchema";

interface MyJwtPayload {
  firstName: string;
  lastName: string;
  _id: string;
  exp: number;
  roles?: string[];
  email?: string;
  drivewayIds?: string[];
}

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const decodeAndSetUser = (token: string): boolean => {
    const decoded: MyJwtPayload = jwtDecode(token);
    const now = Date.now() / 1000;

    // Check token expiry
    if (decoded.exp && decoded.exp <= now) {
      localStorage.removeItem("authToken");
      userContext?.setUser(null);
      return false;
    }

    // Update user context
    if (userContext) {
      userContext.setUser({
        _id: decoded._id,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        email: decoded.email,
        roles: decoded.roles,
        drivewayIds: decoded.drivewayIds,
      });
    }

    return true;
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setMessage(null);

    try {
      // Validate using schema
      const validationResult = loginSchema.safeParse({
        email,
        password,
      });

      if (!validationResult.success) {
        const issues = validationResult.error.issues;
        setErrorMessage(issues[0].message || "Login failed");
        setLoading(false);
        return;
      }

      // Call login API
      const response = await authService.login({ email, password });
      const token = response.token;

      // Save JWT
      localStorage.setItem("authToken", token);

      // Decode and set user
      if (!decodeAndSetUser(token)) {
        setErrorMessage("Login token expired. Please try again.");
        setLoading(false);
        return;
      }

      // Clear form
      setEmail("");
      setPassword("");

      // Set success message
      setMessage(response.message || "Login successful! Redirecting...");

      // Redirect to home page
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
            "Login failed. Please try again.";
      setErrorMessage(errorMsg);
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setErrorMessage(null);
    setMessage(null);

    try {
      const google = (window as any).google;

      const client = google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: "email profile",
        callback: async (response: any) => {
          try {
            const accessToken = response.access_token;

            // Call Google login API
            const loginResponse = await authService.googleLogin(accessToken);
            const token = loginResponse.token || loginResponse.data?.token;

            if (!token) {
              throw new Error("No token received from backend");
            }

            // Save JWT
            localStorage.setItem("authToken", token);

            // Decode and set user
            if (!decodeAndSetUser(token)) {
              setErrorMessage("Google login token expired. Please try again.");
              setLoading(false);
              return;
            }

            // Set success message
            setMessage("Google login successful! Redirecting...");

            // Redirect to home page
            setTimeout(() => {
              navigate("/Home");
            }, 1000);
          } catch (err: any) {
            const data = err.response?.data;
            const errorMsg =
              typeof data === "string"
                ? data
                : data?.message ||
                  data?.error ||
                  err.message ||
                  "Google login failed. Please try again.";
            setErrorMessage(errorMsg);
            setLoading(false);
          }
        },
      });

      client.requestAccessToken();
    } catch (error: any) {
      setErrorMessage(
        error.message || "Google login initialization failed. Please try again."
      );
      setLoading(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    errorMessage,
    message,
    handleSubmit,
    handleGoogleLogin,
  };
}