import React from "react";
import '../style/PrivacyPolicy.css'


export default function PrivacyPolicy() {
  return (
    <div className="privacy-container">
      <h1>Privacy Policy</h1>
      <p className="last-updated">Last updated: January 2026</p>

      <section>
        <h2>1. Introduction</h2>
        <p>
          We value your privacy and are committed to protecting your personal
          information. This Privacy Policy explains what data we collect, how we
          use it, and the choices you have regarding your information when using
          our platform.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul>
          <li>
            <strong>Account Information:</strong> Name, email address, phone
            number, and password.
          </li>
          <li>
            <strong>Listing Information:</strong> Driveway details, images,
            pricing, and availability.
          </li>
          <li>
            <strong>Booking Information:</strong> Reservation details, payment
            confirmations, and communication between hosts and guests.
          </li>
          <li>
            <strong>Payment Data:</strong> Processed securely by our payment
            provider. We do not store full payment details.
          </li>
          <li>
            <strong>Usage Data:</strong> Device information, IP address, and
            interactions with our platform.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Create and manage your account.</li>
          <li>Enable driveway listings and bookings.</li>
          <li>Process secure payments and payouts.</li>
          <li>Improve platform functionality and user experience.</li>
          <li>Communicate updates, confirmations, and support messages.</li>
          <li>Maintain safety, security, and fraud prevention.</li>
        </ul>
      </section>

      <section>
        <h2>4. Sharing Your Information</h2>
        <p>We may share your information with:</p>
        <ul>
          <li>
            <strong>Payment processors:</strong> To handle secure payments and
            payouts.
          </li>
          <li>
            <strong>Service providers:</strong> For hosting, analytics, and
            customer support.
          </li>
          <li>
            <strong>Legal authorities:</strong> When required by law or to
            protect our platform and users.
          </li>
        </ul>
        <p>We do not sell your personal information.</p>
      </section>

      <section>
        <h2>5. Cookies & Tracking</h2>
        <p>
          We use cookies and similar technologies to improve your experience,
          analyze usage, and personalize content. You can control cookie
          settings through your browser.
        </p>
      </section>

      <section>
        <h2>6. Data Security</h2>
        <p>
          We implement industry‑standard security measures to protect your data.
          However, no online service is completely secure, and we cannot
          guarantee absolute protection.
        </p>
      </section>

      <section>
        <h2>7. Your Rights</h2>
        <p>You may have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you.</li>
          <li>Request corrections or updates.</li>
          <li>Request deletion of your account and data.</li>
          <li>Opt out of marketing communications.</li>
        </ul>
      </section>

      <section>
        <h2>8. Children’s Privacy</h2>
        <p>
          Our platform is not intended for individuals under 18. We do not
          knowingly collect information from minors.
        </p>
      </section>

      <section>
        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Continued use of
          the platform after changes means you accept the updated policy.
        </p>
      </section>

      <section>
        <h2>10. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, contact us at:
          <br />
          <strong>support@yourapp.com</strong>
        </p>
      </section>
    </div>
  );
}
