import { Link } from "react-router-dom";
import Logo from "../brand/Logo";

function Navbar() {
  return (
    <header className="landing-navbar">

      <div className="landing-logo">
        <Logo />
      </div>

      <nav className="landing-nav">

        <a href="#features">
          Features
        </a>

        <a href="#industries">
          Industries
        </a>

        <a href="#ai">
          AI
        </a>

        <a href="#logistics">
          Logistics
        </a>

        <a href="#pricing">
          Pricing
        </a>

      </nav>

      <div className="landing-actions">

        <Link
          to="/"
          className="nav-login"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="nav-register"
        >
          Start Free
        </Link>

      </div>

    </header>
  );
}

export default Navbar;