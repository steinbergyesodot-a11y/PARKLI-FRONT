import { Link } from 'react-router-dom';
import '../style/Contact.css'

export function Contact() {
    return (
        <div className="contact-container">
            <div className="contact-content">
                <h1 className="contact-title">Contact Parkli</h1>
                <p className="contact-subtitle">Get in touch with our team</p>
                
                <div className="contact-info">
                    <div className="contact-item">
                        <h2 className="contact-item-title">Email Us</h2>
                        <a href="mailto:parklisupport@gmail.com" className="contact-email">
                            parklisupport@gmail.com
                        </a>
                        <p className="contact-description">
                            We'll respond to your inquiry within 24 hours.
                        </p>
                    </div>
                    
                    <div className="contact-item">
                        <h2 className="contact-item-title">Business Hours</h2>
                        <p className="contact-hours">Monday - Friday: 9:00 AM - 6:00 PM</p>
                        <p className="contact-hours">Saturday - Sunday: 10:00 AM - 4:00 PM</p>
                    </div>
                </div>

                <Link to="/Home" className="contact-button">
                    Go Back Home
                </Link>
            </div>
        </div>
    )
}
