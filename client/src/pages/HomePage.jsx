import { useOutletContext, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import logo from '../assets/GoGoTownTracker.png';
import townArt from '../assets/townArt.jpg';
import { handleLogout } from "../utilities";

export default function HomePage() {
  const { user, setUser } = useOutletContext();
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    setUser(null);
    navigate('/');
  };

  return (
    <div
      className="relative overflow-hidden rounded-[32px] bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: `url(${townArt})` }}
    >
      <div className="absolute inset-0 bg-white/72" aria-hidden="true" />

      <div className="home-page-shell relative z-10 overflow-hidden rounded-[28px] bg-white/24">

        <div className="relative z-10 flex w-full flex-row gap-6 max-md:flex-col">
          <section className="Home rounded-2xl border border-amber-200/70 bg-white/78 p-6 shadow-lg shadow-amber-900/10 backdrop-blur-[1px]">
            <img src={logo} alt="app logo" className="logo mx-auto" />
            <h2 className="mb-3 text-2xl font-semibold">Welcome to the Go-Go Town Tracker App!</h2>
            <h3 className="home-page-instructions">
              Track your townies and quests with ease.
            </h3>
            <p className="home-page-description">
               Go-Go Town Tracker is a companion tracking app that lets players monitor invite quests and progress toward those tasks Unlike manually checking progress in-game or keeping notes elsewhere, our product provides a simple, dedicated management tracker designed specifically for Go-Go Town, helping players organize their growing town quickly and efficiently.
            </p>
            <h3>
              Please log in or create an account to get started!
            </h3>
          </section>

          <section className="UserForm rounded-2xl border border-amber-200/70 bg-white/82 p-6 shadow-lg shadow-amber-900/10 backdrop-blur-[1px]">
            <div>
              {!user ? (
                <AuthForm setUser={setUser} />
              ) : (
                <div>
                  <h2>You are logged in as {user}</h2>
                  <button onClick={onLogout}>Log Out</button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

