import React from "react";
// import "../style/BookingConfirmed.css"; // reuse your existing success styles

interface HostSuccessProps {
  address: string;
}

const HostSuccess: React.FC<HostSuccessProps> = ({ address }) => {
  return (
    <div className="booking-success-container">
      
      <div className="success-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="success-check"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="success-title">You're Now a Verified Host!</h1>

      <p className="success-subtitle">
        Your driveway at <span className="highlight">{address}</span> is now live
        and ready for fans to book on game days.
      </p>

      <div className="details-card">
        <h2 className="details-title">Host Setup Complete</h2>

        <div className="details-row">
          <span className="details-label">Driveway Address:</span>
          <span className="details-value">{address}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Status:</span>
          <span className="details-value">Verified & Ready for Payouts</span>
        </div>
      </div>

      <div className="button-row">
        <a href="/my-driveways" className="primary-btn">
          View My Driveway
        </a>

        <a href="/" className="secondary-btn">
          Back Home
        </a>
      </div>
    </div>
  );
};

export default HostSuccess;
