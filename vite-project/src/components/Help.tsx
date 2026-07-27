import { Link, useNavigate } from "react-router-dom";
import '../style/Help.css'

export function Help() {
  const navigate = useNavigate();

  function sendHome() {
    navigate("/Home");
  }

  return (
    <div className="help-page">
      <div className="topDashboard">
        <img
          src="public/logo.png"
          alt="logo"
          className="logo"
          onClick={sendHome}
        />
      </div>

      

      <section className="help-container">
        <h2>What you can do on Parkli</h2>

        <ul className="help-list">
          <li>
            <strong>Find Parking:</strong> Search for available driveways near stadiums and events.
            <br />
            <Link to="/Dashboard" className="help-link">
              Go to Find Parking →
            </Link>
          </li>

          <li>
            <strong>List Your Driveway:</strong> Earn money by hosting your parking spot.
            <br />
            <Link to="/AddDriveway" className="help-link">
              List a Driveway →
            </Link>
          </li>

          <li>
            <strong>Manage Your Profile:</strong> Update your info, view bookings, and manage listings.
            <br />
            <Link to="/profile" className="help-link">
              Go to Profile →
            </Link>
          </li>

          <li>
            <strong>Learn About Parkli:</strong> Understand how the platform works.
            <br />
            <Link to="/About" className="help-link">
              About Parkli →
            </Link>
          </li>
        </ul>

        <h2>Need more help?</h2>
        <p>If you’re having issues with bookings or hosting, contact us:</p>

        <p className="support-email">
          📧 <strong>support@parkli.com</strong>
        </p>
      </section>
    </div>
  );
}
