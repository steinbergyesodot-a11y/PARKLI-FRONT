import { Link } from 'react-router-dom';
import '../style/NotFound.css';

export function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-title">Page Not Found</h2>
        <p className="notfound-message">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link to="/Home" className="notfound-button">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
