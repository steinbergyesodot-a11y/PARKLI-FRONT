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
  cancelBy: string;
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

  const token = localStorage.getItem("authToken") || "";

  // prefer explicit prop from parent; fall back to token decode when prop not provided
  let userId = "";
  try {
    if (renterId) userId = renterId;
    else if (token) {
      const decoded = jwtDecode<MyTokenPayload>(token as any);
      userId = decoded._id;
    }
  } catch (e) {
    userId = renterId || "";
  }

  if (!userId) return null;

  async function fetchBookings() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/bookings/${userId}`,
        token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : undefined
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

  function canCancelBooking(cancelByDate: string): boolean {
    const now = new Date();
    const deadline = new Date(cancelByDate);
    return now < deadline;
  }

 async function handleCancelBooking(
  drivewayId: string,
  gameDate: string,
  bookingId: string
) {
  console.log("handleCancelBooking called with:", { drivewayId, gameDate, bookingId });
  setIsCancelling(true);
  setCancelError("");

  try {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/bookings/cancelBooking`;
    const payload = { drivewayId, gameDate, bookingId };
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    

    const resp = await axios.post(url, payload, { headers, timeout: 5000 });


    // remove from UI immediately
    setUpcomingBookings((prev) => prev.filter((b) => b._id !== bookingId));

    // close confirm modal first
    setShowCancelConfirm(false);

    // then close details modal with fade effect
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSelectedBooking(null);
      setIsClosing(false);
    }, 200);

    // show success message
    setGlobalSuccess("Booking cancelled successfully");

    // hide success message after 3 seconds
    setTimeout(() => setGlobalSuccess(""), 3000);

    // finally stop the cancelling state
    setIsCancelling(false);
  } catch (err: any) {
    console.error("Cancel error details:", {
      message: err?.message,
      code: err?.code,
      status: err?.response?.status,
      data: err?.response?.data,
    });
    const backendError =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.response?.data?.Message ||
      err?.message ||
      "Failed to cancel booking";
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
        <div key={booking._id} className="contain">
          <section className="leftSide">
            <span className="addressLine">
              <FaLocationDot size={22} /> {booking.address}
            </span>

            <span className="dateLine">
              <FaCalendarAlt size={18} />
              {formatPrettyDate(booking.gameDate)}
              <GoDotFill size={10} />
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

              <p style={{ 
                backgroundColor: "#fff3cd", 
                padding: "10px 12px", 
                borderRadius: "6px", 
                borderLeft: "4px solid #ff9800",
                marginTop: "1rem",
                color: "#333"
              }}>
                <strong>⏰ Cancel Deadline:</strong>{" "}
                {formatDateTime(selectedBooking.cancelBy)}
              </p>

              <div className="buttonsBox">
                <button
                  className="cancelBtn"
                  disabled={!canCancelBooking(selectedBooking.cancelBy)}
                  onClick={() => {
                    setCancelError("");
                    setIsClosing(false);
                    setShowCancelConfirm(true);
                  }}
                >
                  Cancel Booking
                </button>

                {!canCancelBooking(selectedBooking.cancelBy) && (
                  <p style={{
                    color: "#e53935",
                    fontSize: "0.85rem",
                    textAlign: "center",
                    margin: "0.5rem 0 0 0"
                  }}>
                    Cancellation window has passed
                  </p>
                )}

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

              {selectedBooking.cancelBy && (
                <p style={{
                  backgroundColor: "#e8f5e9",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  borderLeft: "4px solid #4caf50",
                  marginBottom: "1rem",
                  color: "#333"
                }}>
                  <strong>✓ Cancel Deadline:</strong> {formatDateTime(selectedBooking.cancelBy)}
                </p>
              )}

              {cancelError && (
                <p className="errorMessage">{cancelError}</p>
              )}

              <button
                className="confirmBtn"
                disabled={isCancelling}
                onClick={() => {
                  console.log("Confirm button clicked");
                  handleCancelBooking(
                    selectedBooking.drivewayId,
                    selectedBooking.gameDate,
                    selectedBooking._id
                  );
                }}
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