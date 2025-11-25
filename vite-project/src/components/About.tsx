import { useNavigate } from 'react-router';
import '../style/About.css'

export function About() {
      const navigate = useNavigate();

   function sendHome(){
        navigate('/Home')
    }
  return (
    <div>
      <div className="topDashboard">
               <img src="https://copilot.microsoft.com/th/id/BCO.3ed9eebf-b8d1-4d88-b6e0-2ba831a1eea3.png" alt="logo" className="logo" onClick={sendHome} />
            
            
            </div>
      {/* Hero Section */}
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
          Parkli was born from a simple idea: parking near stadiums and crowded
          venues shouldn’t feel like a battle. Every game day, thousands of fans
          spend more time circling blocks than cheering for their team. At the
          same time, countless driveways sit empty in the very neighborhoods
          surrounding these arenas. Parkli bridges that gap by connecting
          homeowners with unused parking spaces to fans and event‑goers who need
          them.
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
          about parking — one driveway at a time.
        </p>
      </section>
    </div>
  );
}
