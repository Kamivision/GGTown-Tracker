import { useOutletContext } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import logo from '../assets/GoGoTownTracker.png';

export default function HomePage() {
  const { setUser } = useOutletContext()

  return (
    <div className="home-page-shell">
      <section className="Home rounded-2xl border border-amber-200/70 bg-white/70 p-6 shadow-lg shadow-amber-900/10">
        <img src={logo} alt="app logo" className="logo mx-auto" />
        <h2 className="mb-3 text-2xl font-semibold">Welcome to the Go-Go Town Tracker App!</h2>
        <p className="home-page-instructions">
          Track your townies and quests with ease.
          <br />
          Please log in or create an account to get started!
        </p>
      </section>

      <section className="UserForm rounded-2xl border border-amber-200/70 bg-white/70 p-6 shadow-lg shadow-amber-900/10">
        <AuthForm setUser={setUser} />
      </section>
    </div>
  )
}

