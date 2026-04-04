import { Link, NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-full text-sm font-semibold transition no-underline ${
    isActive
      ? 'bg-white/25 text-white'
      : 'text-white/90 hover:bg-white/20 hover:text-white'
  }`;

export default function NavBar({ user }) {
  return (
    <nav id="navbar">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 border rounded-md">
        <Link
          to="/"
          className="text-base font-bold tracking-wide text-white no-underline"
          >
          Go Go Town Tracker
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {user && <NavLink to="/townies" className={navLinkClass}>Townies</NavLink>}
          {user && <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>}
        </div>
      </div>
    </nav>
  );
}