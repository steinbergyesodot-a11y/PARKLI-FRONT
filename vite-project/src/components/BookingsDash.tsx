import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { createPortal } from "react-dom";
import "../style/BookingDash.css";

interface BookingDashProps {
  renterId: string;
}

interface MyTokenPayload {
  _id: string;
  name: string;
  roles: string[];
}

interface Booking {
  _id: string;
  drivewayId: string;
  ownerId: string;
  renterId: string;
  address: string;
  gameDate: string;
  parkingTime: string;
  price: number;
  visiting_team: string;
  bookedAt: string;
}

export function BookingDash({ renterId }: BookingDashProps) {
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const token = localStorage.getItem("authToken");
  if (!token) return null;

  const decoded = jwtDecode<MyTokenPayload>(token);
  const userId = decoded._id;

  async function fetchBookings() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/bookings/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUpcomingBookings(response.data.bookings || []);
    } catch (err) {
      console.error("Failed to fetch bookings");
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);


  function formatPrettyDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatDateTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function handleViewDetails(booking: Booking) {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  }

 async function handleCancelBooking(
  drivewayId: string,
  gameDate: string,
  bookingId: string
) {
  setIsCancelling(true);
  setCancelError("");

  try {
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/bookings/cancelBooking`,
      { drivewayId, gameDate, bookingId }
    );

    setIsClosing(true);
    setTimeout(() => {
      setIsCancelling(false);
      setIsClosing(false);
      setShowCancelConfirm(false);
      setIsModalOpen(false);
      setGlobalSuccess("Booking cancelled successfully");
      fetchBookings();
      setTimeout(() => setGlobalSuccess(""), 3000);
    }, 250);

  } catch (err: any) {
    const backendError =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.response?.data?.Message ||
      "Unknown error";
    setCancelError(backendError);
    setIsCancelling(false);
  }
}

function closeModal() {
  if (isCancelling) return;

  setIsClosing(true);
  setTimeout(() => {
    setIsClosing(false);
    setShowCancelConfirm(false);
    setIsModalOpen(false);
  }, 250);
}

  return (
    <>
      {globalSuccess &&
        createPortal(
          <div className="globalSuccess">{globalSuccess}</div>,
          document.body
        )}

      {!upcomingBookings.length && (
        <p className="upcomingMsg">No upcoming bookings :(</p>
      )}

      {upcomingBookings.map((booking: Booking) => (
        <div key={booking._id}>
          <div className="contain">
            <section className="leftSide">
              <span className="addressLine">
                <FaLocationDot size={25} /> {booking.address}
              </span>

              <span className="dateLine">
                <FaCalendarAlt size={25} />
                {formatPrettyDate(booking.gameDate)}
                <GoDotFill size={12} />
                {booking.parkingTime} PM
              </span>
            </section>

            <section className="rightSide">
              <button
                className="detailsBtn"
                onClick={() => handleViewDetails(booking)}
              >
                View Details
              </button>
            </section>
          </div>
        </div>
      ))}

      {isModalOpen &&
        selectedBooking &&
        createPortal(
          <div
            className={`modalOverlay ${isClosing ? "fadeOut" : ""}`}
            onClick={() => {}}
          >
            <div
              className="modalContent"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Booking Details</h2>

              <p>
                <strong>Address:</strong> {selectedBooking.address}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {formatPrettyDate(selectedBooking.gameDate)}
              </p>
              <p>
                <strong>Parking Time:</strong> {selectedBooking.parkingTime} PM
              </p>

              {selectedBooking.price && (
                <p>
                  <strong>Price:</strong> ${selectedBooking.price}
                </p>
              )}

              <p>
                <strong>Booked At:</strong>{" "}
                {formatDateTime(selectedBooking.bookedAt)}
              </p>

              <div className="buttonsBox">
                <button
                  className="cancelBtn"
                  onClick={() => {
                    setCancelError("");
                    setIsClosing(false);
                    setShowCancelConfirm(true);
                  }}
                >
                  Cancel Booking
                </button>

                <button onClick={closeModal} className="closeBtn">
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {showCancelConfirm &&
        selectedBooking &&
        createPortal(
          <div
            className={`modalOverlay ${isClosing ? "fadeOut" : ""}`}
            onClick={() => {}}
          >
            <div
              className="modalContent"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Are you sure?</h3>
              <p>This will cancel your booking.</p>

              {cancelError && (
                <p className="errorMessage">{cancelError}</p>
              )}

              <button
                className="confirmBtn"
                disabled={isCancelling}
                onClick={() =>
                  handleCancelBooking(
                    selectedBooking.drivewayId,
                    selectedBooking.gameDate,
                    selectedBooking._id
                  )
                }
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>

              <button
                className="closeBtn"
                disabled={isCancelling}
                onClick={closeModal}
              >
                No, Go Back
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}