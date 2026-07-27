import React from "react";
import '../style/CancellationPolicy.css'

export default function CancellationPolicy() {
  return (
    <div className="policy-container">
      <h1>Cancellation Policy</h1>
      <p className="last-updated">Last updated: January 2026</p>

      <section>
        <h2>1. Overview</h2>
        <p>
          This Cancellation Policy explains how cancellations and refunds work
          when booking a driveway through our platform. By making a booking, you
          agree to the terms outlined below.
        </p>
      </section>

      <section>
        <h2>2. Renter Cancellations</h2>
        <p>Renters may cancel their booking under the following conditions:</p>
        <ul>
          <li>
            <strong>Full Refund:</strong> Cancellations made at least 24 hours
            before the scheduled parking time.
          </li>
          <li>
            <strong>No Refund:</strong> Cancellations made within 24 hours of
            the scheduled parking time.
          </li>
          <li>
            <strong>No‑Show:</strong> If the renter does not arrive, the booking
            is non‑refundable.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Host Cancellations</h2>
        <p>
          If a host cancels a confirmed booking, the renter will receive a full
          refund. Repeated host cancellations may result in account review or
          suspension.
        </p>
      </section>

      <section>
        <h2>4. Weather & Special Circumstances</h2>
        <p>
          Refunds due to weather or unexpected circumstances are not guaranteed.
          However, we may review cases individually and issue refunds at our
          discretion.
        </p>
      </section>

      <section>
        <h2>5. Payment Processing</h2>
        <p>
          Refunds are issued back to the original payment method. Processing
          times may vary depending on your bank or card provider.
        </p>
      </section>

      <section>
        <h2>6. Contact Us</h2>
        <p>
          If you have questions about this Cancellation Policy, contact us at:
          <br />
          <strong>support@yourapp.com</strong>
        </p>
      </section>
    </div>
  );
}
