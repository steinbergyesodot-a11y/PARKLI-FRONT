import { Link } from 'react-router-dom';

import '../style/OurMission.css'

export function OurMission() {
    return (
        <div className="mission-container">
            <div className="mission-content">
                <h1 className="mission-title">Our Mission</h1>
                <p className="mission-subtitle">Revolutionizing parking, one game at a time</p>
                
                <div className="mission-sections">
                    <div className="mission-section">
                        <div className="mission-icon">🏟️</div>
                        <h2 className="section-title">Starting with Chicago Cubs</h2>
                        <p className="section-text">
                            Parkli began with a simple vision: solve the parking nightmare around Wrigley Field. 
                            We know the struggle of finding affordable, convenient parking on game day. 
                            That's why we started by connecting Cubs fans with local driveway owners, 
                            creating a win-win solution that makes game day parking stress-free.
                        </p>
                    </div>
                    
                    <div className="mission-section">
                        <div className="mission-icon">🚗</div>
                        <h2 className="section-title">Beyond Baseball</h2>
                        <p className="section-text">
                            While our roots are in Chicago sports, our vision extends far beyond. 
                            We're building a platform that transforms how people think about parking 
                            at concerts, festivals, and events across the city. Every unused driveway 
                            is an opportunity to create value and convenience for our community.
                        </p>
                    </div>
                    
                    <div className="mission-section">
                        <div className="mission-icon">🌆</div>
                        <h2 className="section-title">Future Expansion</h2>
                        <p className="section-text">
                            Our roadmap is ambitious: we're planning to expand to major cities nationwide, 
                            bringing the Parkli experience to sports fans, concertgoers, and event attendees 
                            everywhere. From NFL stadiums to NBA arenas, from music festivals to conventions, 
                            we're building the future of event parking.
                        </p>
                    </div>
                    
                    <div className="mission-section">
                        <div className="mission-icon">🤝</div>
                        <h2 className="section-title">Community First</h2>
                        <p className="section-text">
                            At our core, Parkli is about building stronger communities. We connect neighbors, 
                            create economic opportunities for homeowners, and make events more accessible 
                            for everyone. Every booking strengthens local communities and makes parking 
                            less of a hassle and more of a positive experience.
                        </p>
                    </div>
                </div>

                <div className="mission-cta">
                    <h3>Join Us on This Journey</h3>
                    <p>Whether you're a homeowner looking to monetize your space or a driver seeking 
                       convenient parking, Parkli is your partner in reimagining urban mobility.</p>
                </div>

                <Link to="/Home" className="mission-button">
                    Go Back Home
                </Link>
            </div>
        </div>
    )
}
