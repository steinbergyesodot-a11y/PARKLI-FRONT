import React from "react";
import '../style/TermsOfUse.css'

export default function TermsOfUse() {
  return (
    <div className="terms-container">
      <h1>Terms of Use</h1>

      <section>
        <h2>1. Introduction</h2>
        <p>
          Welcome to our platform. By creating an account, listing a driveway, or
          booking a parking space, you agree to these Terms of Use. Please read
          them carefully before using our services.
        </p>
      </section>

      <section>
        <h2>2. Host Responsibilities</h2>
        <p>When listing a driveway, you agree that:</p>
        <ul>
          <li>You own the property or have legal permission to rent the space.</li>
          <li>All information you provide is accurate and truthful.</li>
          <li>You will keep the driveway safe, accessible, and compliant with local laws.</li>
          <li>You will honor all confirmed bookings unless an emergency occurs.</li>
        </ul>
      </section>

      <section>
        <h2>3. Guest Responsibilities</h2>
        <p>When booking a driveway, you agree that:</p>
        <ul>
          <li>You will only park during the reserved time window.</li>
          <li>You will follow all host rules and property guidelines.</li>
          <li>You will respect the property and surrounding area.</li>
        </ul>
      </section>

      <section>
        <h2>4. Payments & Cancellations</h2>
        <p>
          Payments are processed securely through our payment provider. By using
          our platform, you agree to our cancellation and refund policies as
          displayed during booking.
        </p>
      </section>

      <section>
        <h2>5. Liability</h2>
        <p>
          We provide a platform for hosts and guests to connect. We are not
          responsible for property damage, personal injury, disputes, or any
          issues that occur on private property. Hosts and guests are responsible
          for resolving any conflicts directly.
        </p>
      </section>

      <section>
        <h2>6. Privacy</h2>
        <p>
          We collect and use personal information as described in our Privacy
          Policy. By using our platform, you consent to this data usage.
        </p>
      </section>

      <section>
        <h2>7. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of the
          platform means you accept the updated Terms.
        </p>
      </section>

      <section>
        <h2>8. Contact</h2>
        <p>
          If you have questions about these Terms, you can contact us at:
          <br />
          <strong>support@yourapp.com</strong>
        </p>
      </section>
    </div>
  );
}
