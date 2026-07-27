import HostSuccess from "../../../components/HostSuccess";
import { useOnboardingStatus } from "../hooks/useOnboardingStatus";

export default function OnboardingComplete() {
  const { status, continueUrl, drivewayAddress, errorMessage } = useOnboardingStatus();

  if (status === "checking") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          gap: "20px",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ fontSize: "18px", color: "#666" }}>Checking your Stripe status…</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (status === "success") {
    return <HostSuccess address={drivewayAddress} />;
  }

  if (status === "incomplete") {
    return (
      <div>
        <h2>You still have steps to finish.</h2>
        <button onClick={() => continueUrl && window.location.assign(continueUrl)}>
          Continue onboarding
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Something went wrong. Please try again.</h2>
      {errorMessage && (
        <pre style={{ whiteSpace: "pre-wrap", color: "#900" }}>{errorMessage}</pre>
      )}
    </div>
  );
}
