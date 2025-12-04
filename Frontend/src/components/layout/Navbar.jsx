import { Link } from "react-router-dom";

// Aktuell so nur damit Routing funktioniert.
function Navbar() {
  return (
    <nav style={{ padding: "1rem", background: "#111", color: "white" }}>
      {/* Navigation zwischen verschiedenen Seiten */}
      <Link to="/" style={{ marginRight: "1rem", color: "white" }}>
        Home
      </Link>
      <Link to="/login" style={{ marginRight: "1rem", color: "white" }}>
        Login
      </Link>
      <Link to="/player" style={{ marginRight: "1rem", color: "white" }}>
        Player
      </Link>
      <Link to="/admin" style={{ marginRight: "1rem", color: "white" }}>
        Admin
      </Link>
    </nav>
  );
}

export default Navbar;
