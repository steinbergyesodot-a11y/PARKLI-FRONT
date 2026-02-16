import React from "react";
import '../style/BookingConfirmed.css'

interface BookingSuccessProps {
  gameDate: string;
  parkingBegins: string;
  address: string;
  visitingTeam: string;
}

const BookingSuccess: React.FC<BookingSuccessProps> = ({
  gameDate,
  parkingBegins,
  address,
  visitingTeam,
}) => {
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

      <h1 className="success-title">Booking Confirmed!</h1>

      <p className="success-subtitle">
        Your parking spot is reserved for the{" "}
        <span className="highlight">{visitingTeam}</span> game on{" "}
        <span className="highlight">{gameDate}</span> at{" "}
        <span className="highlight">{parkingBegins}</span>.
      </p>

      <div className="details-card">
        <h2 className="details-title">Reservation Details</h2>

        <div className="details-row">
          <span className="details-label">Address:</span>
          <span className="details-value">{address}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Game Date:</span>
          <span className="details-value">{gameDate}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Parking Time:</span>
          <span className="details-value">{parkingBegins}</span>
        </div>
      </div>

      <div className="button-row">
        <a href="/my-bookings" className="primary-btn">
          View My Booking
        </a>

        <a href="/" className="secondary-btn">
          Back Home
        </a>
      </div>
    </div>
  );
};

export default BookingSuccess;
