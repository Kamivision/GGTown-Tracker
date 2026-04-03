import { useOutletContext } from 'react-router-dom';
import TownieDisplay from '../components/TownieDisplay';
import logo from '../assets/GoGoTownTracker.png';


export default function Townies() {
    const { user } = useOutletContext()

    return (
        <>
            <section className="UserHome mx-auto mt-8 w-full max-w-3xl rounded-2xl border border-amber-200/70 bg-white/70 p-6 shadow-lg shadow-amber-900/10">
                <img src={logo} alt="app logo" className="logo mx-auto" />
                <h2 className="text-2xl font-semibold">
                    Welcome {user}!
                </h2>
            </section>
            <h1>Your Townies:</h1>
            <h3>Here you can manage and track your townie quests. To add more townies to this list go to the dashboard and search for new townies or create your own.</h3>
            <TownieDisplay user={user} mode="townies" />
        </> 
    )
}