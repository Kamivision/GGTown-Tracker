import TownieDisplay from "../components/TownieDisplay"
import ChatBox from "../components/ChatBox";
import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/GoGoTownTracker.png';
import useTownieBoard from '../hooks/useTownieBoard';


export default function Dashboard() {
    const { user } = useOutletContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [newTownieData, setNewTownieData] = useState({
        name: '',
        quest: '',
        quest_amount: '',
        quest_type: '',
    });
    const {
        createTownie,
        error,
        loading,
        pinnedTowniesByTownie,
        startTrackingTownie,
        stopTrackingTownie,
        toggleTowniePin,
        townies,
        trackedQuestsByTownie,
    } = useTownieBoard(user);

    return (
        <section className="quest-dashboard-shell">
            <header className="quest-dashboard-header">
                <img src={logo} alt="app logo" className='dashboard-logo' />
                <h1>Townie Dashboard</h1>
                <h3 className="quest-dashboard-subheader">Scroll through, Search For, or Create a Townie</h3>
            </header>
            <ChatBox />

            {loading ? (
                <p className="quest-empty-state">Loading your townie dashboard...</p>
            ) : (
                <TownieDisplay
                    error={error}
                    newTownieData={newTownieData}
                    onCreateTownie={createTownie}
                    onStartTracking={startTrackingTownie}
                    onStopTracking={stopTrackingTownie}
                    onTogglePin={toggleTowniePin}
                    pinnedTowniesByTownie={pinnedTowniesByTownie}
                    searchTerm={searchTerm}
                    setNewTownieData={setNewTownieData}
                    setSearchTerm={setSearchTerm}
                    townies={townies}
                    trackedQuestsByTownie={trackedQuestsByTownie}
                />
            )}
            
        </section>
    )
}