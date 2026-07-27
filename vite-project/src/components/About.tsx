import { useNavigate } from 'react-router-dom';

import '../style/About.css'
import { jwtDecode } from 'jwt-decode';



export function About() {
       
      
          const navigate = useNavigate();




 
      

   function sendHome(){
        navigate('/Home')
    }
  return (
    <div>
      <div className="topDashboard">
               <img src="public/logo.png" alt="logo" className="logo" onClick={sendHome} />
      </div>
      
      <section className="hero">
        <div className="hero-overlay">
          <h1>About Parkli</h1>
          <p>Smarter parking, closer to the action.</p>
        </div>
      </section>

      {/* About Content */}
      <section className="about-container">
        <h2>Our Story</h2>
        <p>
       Finding parking for a Cubs game at Wrigley Field can feel impossible. Between crowded streets, expensive lots, and the rush of fans all arriving at once, most people spend more time circling the neighborhood than enjoying the game.

This platform was created to make that experience easier. Here, local residents can list their personal driveways, garages, or parking spots, giving fans a simple, stress‑free way to secure parking before they even leave home.

Whether you're heading to the ballpark or you live nearby and want to earn extra income from your unused space, this community-driven marketplace connects neighbors in a way that benefits everyone.
        </p>
        <p>
          For users, Parkli means peace of mind. No more last‑minute stress,
          overpriced lots, or long walks from distant garages. Instead, you can
          reserve a driveway just minutes from the action, knowing your spot is
          waiting for you. For hosts, Parkli is a chance to earn extra income
          effortlessly while supporting their community. By opening up their
          driveways, hosts help reduce traffic congestion, cut down on emissions
          from cars circling for parking, and make their neighborhoods more
          welcoming.
        </p>
        <p>
          Our mission is simple: to make parking smarter, fairer, and more
          human. Whether you’re a die‑hard sports fan, a concert lover, or a
          local resident looking to share your space, Parkli is here to make the
          experience seamless. Together, we’re transforming the way people think
          about parking, one driveway at a time.
        </p>
      </section>
    </div>
  );
}
