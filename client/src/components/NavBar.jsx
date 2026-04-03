import { Link, NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-full text-sm font-semibold transition ${
    isActive
      ? 'bg-white/25 text-white'
      : 'text-white/90 hover:bg-white/20 hover:text-white'
  }`;

export default function NavBar() {
  return (
    <nav id="navbar">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link
          to="/"
          className="text-base font-bold tracking-wide text-white no-underline"
        >
          Go Go Town Tracker
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <NavLink to="/home" className={navLinkClass}>Home</NavLink>
          <NavLink to="/townies" className={navLinkClass}>Townies</NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
        </div>
      </div>
    </nav>
  );
}