import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import TownieManager from '../components/TownieManager';
import logo from '../assets/GoGoTownTracker.png';
import useTownieBoard from '../hooks/useTownieBoard';


export default function Townies() {
    const { user } = useOutletContext()
    const [searchTerm, setSearchTerm] = useState('');
    const {
        amountInputs,
        error,
        incrementTrackedAmount,
        loading,
        pinnedTowniesByTownie,
        setAmountInputs,
        setTrackedAmount,
        startTrackingTownie,
        stopTrackingTownie,
        toggleTowniePin,
        townies,
        trackedQuestsByTownie,
    } = useTownieBoard(user);

    return (
        <>
            <section className="Townies-header">
                <img src={logo} alt="app logo" className="logo mx-auto" />
                <h2 className="text-2xl font-semibold">
                    Welcome {user}!
                </h2>
                <h4 className='townies-subheader'>Here you can manage and track your townie quests. To add more townies to this list go to the dashboard and search for new townies or create your own.</h4>
            </section>
            <h1 className='p-6'>Your Townies:</h1>

            {loading ? (
                <p className="quest-empty-state">Loading your saved townies...</p>
            ) : (
                <TownieManager
                    amountInputs={amountInputs}
                    error={error}
                    incrementTrackedAmount={incrementTrackedAmount}
                    pinnedTowniesByTownie={pinnedTowniesByTownie}
                    searchTerm={searchTerm}
                    setAmountInputs={setAmountInputs}
                    setSearchTerm={setSearchTerm}
                    setTrackedAmount={setTrackedAmount}
                    startTrackingTownie={startTrackingTownie}
                    stopTrackingTownie={stopTrackingTownie}
                    toggleTowniePin={toggleTowniePin}
                    townies={townies}
                    trackedQuestsByTownie={trackedQuestsByTownie}
                />
            )}
        </> 
    )
}