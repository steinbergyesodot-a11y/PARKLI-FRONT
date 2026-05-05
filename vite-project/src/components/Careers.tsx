import { Link } from 'react-router-dom';

import '../style/Careers.css'

export function Careers() {
    return (
        <div className="careers-container">
            <div className="careers-content">
                <h1 className="careers-title">Careers at Parkli</h1>
                <p className="careers-subtitle">Join our team and shape the future of parking</p>
                
                <div className="coming-soon-section">
                    <div className="coming-soon-icon">🚧</div>
                    <h2 className="coming-soon-title">Coming Soon!</h2>
                    <p className="coming-soon-message">
                        We're working hard to build amazing career opportunities at Parkli. 
                        Our careers page will be launching soon with exciting positions across 
                        engineering, operations, marketing, and more.
                    </p>
                    <p className="coming-soon-submessage">
                        Want to be the first to know when we're hiring? 
                        Keep an eye on this page or follow us on social media for updates!
                    </p>
                </div>

                <Link to="/Home" className="careers-button">
                    Go Back Home
                </Link>
            </div>
        </div>
    )
}
