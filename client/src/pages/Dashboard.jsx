import TownieDisplay from "../components/TownieDisplay"
import ChatBox from "../components/ChatBox";
import { useOutletContext } from 'react-router-dom';
import logo from '../assets/GoGoTownTracker.png';


export default function Dashboard() {
    const { user } = useOutletContext();

    return (
        <section className="quest-dashboard-shell">
            <header className="quest-dashboard-header">
                <img src={logo} alt="app logo" className='dashboard-logo' />
                <h1>Townie Dashboard</h1>
                <h3 className="quest-dashboard-subheader">Quest Tracker</h3>
            </header>
            <ChatBox />
            <TownieDisplay user={user} mode="dashboard" />
            
        </section>
    )
}