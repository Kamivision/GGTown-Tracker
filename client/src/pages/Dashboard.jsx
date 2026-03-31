import TownieDisplay from "../components/TownieDisplay"
import { useOutletContext } from 'react-router-dom';


export default function Dashboard() {
    const { user } = useOutletContext();

    return (
        <section className="quest-dashboard-shell">
            <header className="quest-dashboard-header">
                <p className="quest-dashboard-kicker">Quest Tracker</p>
                <h1>Townie Dashboard</h1>
                <p>
                    Track each townie quest separately and update your personal amount until the target is reached.
                </p>
            </header>
            <TownieDisplay user={user} />
        </section>
    )
}