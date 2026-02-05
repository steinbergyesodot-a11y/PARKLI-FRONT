import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { createPortal } from "react-dom";
import '../style/BookingDash.css';

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
    const [upcomingBookings, setUpcomingBookings] = useState<Booking[] | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [cancelMessage, setCancelMessage] = useState("");
    const [isClosing, setIsClosing] = useState(false);

    const token = localStorage.getItem("authToken");
    if (!token) return null;
    const decoded = jwtDecode<MyTokenPayload>(token);
    const userId = decoded._id;

    async function fetchBookings() {
        try {
            const response = await axios.get(`http://localhost:4000/api/bookings/${userId}`);
            setUpcomingBookings(response.data.bookings);
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
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

    async function handleCancelBooking(drivewayId: string, gameDate: string, bookingId: string) {
        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/driveways/updateDrivewayCancleBooking/${drivewayId}/${gameDate}`
            );

            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/bookings/${bookingId}`);

            setCancelMessage("Booking deleted successfully");

            setTimeout(() => {
                setShowCancelConfirm(false);
                setIsModalOpen(false);
                setCancelMessage("");
                fetchBookings();
            }, 1200);
        } catch (err) {
            console.error("Failed to cancel booking:", err);
        }
    }

    function closeModal() {
        setIsClosing(true);

        setTimeout(() => {
            setIsClosing(false);
            setShowCancelConfirm(false);
            setIsModalOpen(false);
        }, 250);
    }
    console.log("Bookings state:", upcomingBookings);

    if(!upcomingBookings){
        return(
            <>
            <p className="upcomingMsg">No upcoming bookings :(</p>
            </>
        )
    }

    return (
        <>
            {upcomingBookings?.map((booking) => (
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

            {/* DETAILS MODAL */}
            {isModalOpen && selectedBooking &&
                createPortal(
                    <div
                        className={`modalOverlay ${isClosing ? "fadeOut" : ""}`}
                        onClick={closeModal}
                    >
                        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                            <h2>Booking Details</h2>

                            <p><strong>Address:</strong> {selectedBooking.address}</p>
                            <p><strong>Date:</strong> {formatPrettyDate(selectedBooking.gameDate)}</p>
                            <p><strong>Parking Time:</strong> {selectedBooking.parkingTime} PM</p>

                            {selectedBooking.price && (
                                <p><strong>Price:</strong> ${selectedBooking.price}</p>
                            )}

                            <p><strong>Booked At: </strong>{formatDateTime(selectedBooking.bookedAt)}</p>

                            <div className="buttonsBox">
                                <button
                                    className="cancelBtn"
                                    onClick={() => setShowCancelConfirm(true)}
                                >
                                    Cancel Booking
                                </button>

                                <button onClick={closeModal} className="closeBtn">Close</button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

            {/* CANCEL CONFIRM MODAL */}
            {showCancelConfirm &&
                createPortal(
                    <div
                        className={`modalOverlay ${isClosing ? "fadeOut" : ""}`}
                        onClick={closeModal}
                    >
                        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                            <h3>Are you sure?</h3>
                            <p>This will cancel your booking.</p>

                            {cancelMessage && (
                                <p className="successMessage">{cancelMessage}</p>
                            )}

                            <button
                                className="confirmBtn"
                                onClick={() =>
                                    handleCancelBooking(
                                        selectedBooking!.drivewayId,
                                        selectedBooking!.gameDate,
                                        selectedBooking!._id
                                    )
                                }
                            >
                                Yes, Cancel
                            </button>

                            <button
                                className="closeBtn"
                                onClick={closeModal}
                            >
                                No, Go Back
                            </button>
                        </div>
                    </div>,
                    document.body
                )
            }
        </>
    );
}
