import { useEffect, useState } from 'react';
import {
    createTrackedQuest,
    deleteTrackedQuest,
    fetchTownies,
    fetchTrackedQuests,
    incrementTrackedQuestAmount,
    updateTrackedQuestPin,
    updateTrackedQuestAmount,
    createTownie,
} from '../utilities';


const parseQuestAmount = (questAmount) => {
    const parsedAmount = Number.parseInt(questAmount, 10);
    return Number.isInteger(parsedAmount) && parsedAmount > 0 ? parsedAmount : 0;
};

export default function TownieDisplay({ user, mode = 'dashboard' }) {
    const [townies, setTownies] = useState([]);
    const [trackedQuests, setTrackedQuests] = useState({});
    const [amountInputs, setAmountInputs] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newTownieData, setNewTownieData] = useState({
        name: '',
        quest: '',
        quest_amount: '',
        quest_type: '',
    });
    const showToolbar = mode === 'dashboard';

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const loadQuestData = async () => {
            try {
                const [townieData, trackedQuestData] = await Promise.all([
                    fetchTownies(),
                    fetchTrackedQuests(),
                ]);
                setTownies(townieData);
                syncTrackedQuestState(trackedQuestData);
            } catch (err) {
                setError('Could not load your quest tracker.');
            } finally {
                setLoading(false);
            }
        };

        loadQuestData();
    }, [user]);

    const syncTrackedQuestState = (quests) => {
        const nextTrackedQuests = {};
        const nextAmountInputs = {};

        quests.forEach((quest) => {
            nextTrackedQuests[quest.townie_id] = quest;
            nextAmountInputs[quest.id] = String(quest.current_amount);
        });

        setTrackedQuests(nextTrackedQuests);
        setAmountInputs(nextAmountInputs);
    };

    const upsertTrackedQuest = (quest) => {
        setTrackedQuests((currentTrackedQuests) => ({
            ...currentTrackedQuests,
            [quest.townie_id]: quest,
        }));
        setAmountInputs((currentAmountInputs) => ({
            ...currentAmountInputs,
            [quest.id]: String(quest.current_amount),
        }));
    };

    const removeTrackedQuest = (quest) => {
        setTrackedQuests((currentTrackedQuests) => {
            const nextTrackedQuests = { ...currentTrackedQuests };
            delete nextTrackedQuests[quest.townie_id];
            return nextTrackedQuests;
        });
        setAmountInputs((currentAmountInputs) => {
            const nextAmountInputs = { ...currentAmountInputs };
            delete nextAmountInputs[quest.id];
            return nextAmountInputs;
        });
    };

    const handleTrackQuest = async (townieId) => {
        try {
            const quest = await createTrackedQuest(townieId);
            upsertTrackedQuest(quest);
        } catch (err) {
            setError('Could not start tracking that quest.');
        }
    };

    const handleSetAmount = async (event, quest) => {
        event.preventDefault();
        const nextAmount = Number.parseInt(amountInputs[quest.id] ?? `${quest.current_amount}`, 10);

        if (Number.isNaN(nextAmount) || nextAmount < 0) {
            setError('Current amount must be zero or higher.');
            return;
        }

        try {
            const updatedQuest = await updateTrackedQuestAmount(quest.id, nextAmount);
            setError('');
            upsertTrackedQuest(updatedQuest);
        } catch (err) {
            setError('Could not update that quest amount.');
        }
    };

    const handleIncrementQuest = async (quest, incrementAmount) => {
        if (Number.isNaN(incrementAmount) || incrementAmount < 1) {
            setError('Increment amount must be at least 1.');
            return;
        }

        try {
            const updatedQuest = await incrementTrackedQuestAmount(quest.id, incrementAmount);
            setError('');
            upsertTrackedQuest(updatedQuest);
        } catch (err) {
            setError('Could not increment that quest.');
        }
    };

    const handleTogglePin = async (quest) => {
        try {
            const updatedQuest = await updateTrackedQuestPin(quest.id, !quest.is_pinned);
            setError('');
            upsertTrackedQuest(updatedQuest);
        } catch (err) {
            setError('Could not update that pin status.');
        }
    };

    const handleStopTracking = async (quest) => {
        try {
            await deleteTrackedQuest(quest.id);
            setError('');
            removeTrackedQuest(quest);
        } catch (err) {
            setError('Could not stop tracking that townie quest.');
        }
    };

    const handleCreateTownie = async (event) => {
        event.preventDefault();

        const { name, quest, quest_amount, quest_type } = newTownieData;

        if (!name || !quest || !quest_amount || !quest_type) {
            setError('All fields are required to create a new townie.');
            return;
        }

        try {
            const createdTownie = await createTownie(newTownieData);

            if (!createdTownie) {
                setError('Could not create that townie.');
                return;
            }

            setTownies((currentTownies) => [...currentTownies, createdTownie]);
            setNewTownieData({
                name: '',
                quest: '',
                quest_amount: '',
                quest_type: '',
            });
            setError('');
        } catch (err) {
            setError('Could not create that townie.');
        }
    };

    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    const visibleTownies = townies
        .filter((townie) => {
            if (!normalizedSearchTerm) {
                return true;
            }

            const searchableText = [townie.name, townie.quest, townie.quest_type]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return searchableText.includes(normalizedSearchTerm);
        })
        .filter((townie) => {
            if (mode !== 'townies') {
                return true;
            }

            const trackedQuest = trackedQuests[townie.id];
            return Boolean(trackedQuest?.is_pinned);
        })
        .sort((leftTownie, rightTownie) => {
            const leftTracked = trackedQuests[leftTownie.id] ? 1 : 0;
            const rightTracked = trackedQuests[rightTownie.id] ? 1 : 0;

            if (leftTracked !== rightTracked) {
                return rightTracked - leftTracked;
            }

            return leftTownie.name.localeCompare(rightTownie.name);
        });

    if (!user) {
        return <p className="quest-empty-state">Log in to track your townie quests.</p>;
    }

    if (loading) {
        return <p className="quest-empty-state">Loading your townie quest tracker...</p>;
    }

    if (error) {
        return (
            <section>
                <p className="quest-error-banner">{error}</p>
                {showToolbar && (
                    <div className="quest-toolbar">
                        <label className="quest-search-group">
                            <span>Search townies</span>
                            <input
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Name, quest, or type"
                                type="search"
                                value={searchTerm}
                            />
                        </label>
                    </div>
                )}
                <div className="quest-grid">
                    {visibleTownies.map((townie) => {
                        const targetAmount = parseQuestAmount(townie.quest_amount);
                        const trackedQuest = trackedQuests[townie.id];

                        return (
                            <article className="quest-card" key={townie.id}>
                                <div className="quest-card-header">
                                    <p className="quest-card-type">{townie.quest_type}</p>
                                    <h2>{townie.name}</h2>
                                </div>
                                
                                <p className="quest-card-meta">Goal: {targetAmount || townie.quest_amount}</p>
                                {(mode === 'townies' || trackedQuest.is_complete) && (
                                    <button
                                        aria-pressed={trackedQuest.is_pinned}
                                        className="quest-pin-button"
                                        onClick={() => handleTogglePin(trackedQuest)}
                                        type="button"
                                    >
                                        {trackedQuest.is_pinned ? 'Unpin from YourTownies' : 'Pin to Your Townies'}
                                    </button>
                                )}
                                {!trackedQuest && (
                                    <button
                                        className="quest-primary-button"
                                        disabled={targetAmount < 1}
                                        onClick={() => handleTrackQuest(townie.id)}
                                        type="button"
                                    >
                                        Start Tracking
                                    </button>
                                )}
                            </article>
                        );
                    })}
                </div>
            </section>
        );
    }

    return (
        <section>
            {showToolbar && (
                <div className="quest-toolbar">
                    <form className="quest-form-row" onSubmit={handleCreateTownie}>
                        <label className="quest-input-group">
                            <span>Townie Name</span>
                            <input
                                type="text"
                                value={newTownieData.name}
                                onChange={(event) =>
                                    setNewTownieData((current) => ({ ...current, name: event.target.value }))
                                }
                                placeholder="ex: Nancy"
                            />
                        </label>

                        <label className="quest-input-group">
                            <span>Quest Type</span>
                            <input
                                type="text"
                                value={newTownieData.quest_type}
                                onChange={(event) =>
                                    setNewTownieData((current) => ({ ...current, quest_type: event.target.value }))
                                }
                                placeholder="ex: Gathering"
                            />
                        </label>

                        <label className="quest-input-group">
                            <span>Quest</span>
                            <input
                                type="text"
                                value={newTownieData.quest}
                                onChange={(event) =>
                                    setNewTownieData((current) => ({ ...current, quest: event.target.value }))
                                }
                                placeholder="ex: Chopped Wood"
                            />
                        </label>

                        <label className="quest-input-group">
                            <span>Goal Amount</span>
                            <input
                                type="number"
                                min="1"
                                value={newTownieData.quest_amount}
                                onChange={(event) =>
                                    setNewTownieData((current) => ({ ...current, quest_amount: event.target.value }))
                                }
                            />
                        </label>

                        <button className="quest-primary-button" type="submit">
                            Add Townie
                        </button>
                    </form>

                    <label className="quest-search-group">
                        <span>Search townies</span>
                        <input
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Name, quest, or type"
                            type="search"
                            value={searchTerm}
                        />
                    </label>
                </div>
            )}

            <div className="quest-grid">
                {visibleTownies.map((townie) => {
                    const trackedQuest = trackedQuests[townie.id];
                    const targetAmount = trackedQuest?.target_amount ?? parseQuestAmount(townie.quest_amount);
                    const currentAmount = trackedQuest?.current_amount ?? 0;
                    const progressPercent = targetAmount > 0
                        ? Math.min((currentAmount / targetAmount) * 100, 100)
                        : 0;

                    return (
                        <article className="quest-card" key={townie.id}>
                            <div className="quest-card-header">
                                <p className="quest-card-type">{townie.quest_type}</p>
                                <h2>{townie.name}</h2>
                            </div>

                            <p className="quest-card-meta">
                                Goal: {targetAmount > 0 ? `${targetAmount} ${townie.quest}` : townie.quest_amount}
                            </p>

                            {!trackedQuest && (
                                <button
                                    className="quest-primary-button"
                                    disabled={targetAmount < 1}
                                    onClick={() => handleTrackQuest(townie.id)}
                                    type="button"
                                >
                                    {targetAmount < 1 ? 'Quest amount is not numeric' : 'Start Tracking'}
                                </button>
                            )}

                            {trackedQuest && (
                                <>
                                    <button
                                        aria-pressed={trackedQuest.is_pinned}
                                        className="quest-pin-button"
                                        onClick={() => handleTogglePin(trackedQuest)}
                                        type="button"
                                    >
                                        {trackedQuest.is_pinned ? 'Unpin from YourTownies' : 'Pin to Your Townies'}
                                    </button>

                                    <div className="quest-progress-row">
                                        <strong>{trackedQuest.current_amount} / {trackedQuest.target_amount}</strong>
                                        <span>{trackedQuest.is_complete ? 'Complete' : `${trackedQuest.remaining_amount} left`}</span>
                                    </div>

                                    <div className="quest-progress-bar" aria-hidden="true">
                                        <div
                                            className="quest-progress-fill"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>

                                    <form className="quest-form-row" onSubmit={(event) => handleSetAmount(event, trackedQuest)}>
                                        <label className="quest-input-group">
                                            <span>Set current amount</span>
                                            <input
                                                min="0"
                                                onChange={(event) => setAmountInputs((currentAmountInputs) => ({
                                                    ...currentAmountInputs,
                                                    [trackedQuest.id]: event.target.value,
                                                }))}
                                                type="number"
                                                value={amountInputs[trackedQuest.id] ?? String(trackedQuest.current_amount)}
                                            />
                                        </label>
                                        <button className="quest-secondary-button" type="submit">
                                            Save
                                        </button>
                                    </form>

                                    <div className="quest-chip-row">
                                        {[1, 5, 10].map((step) => (
                                            <button
                                                className="quest-chip-button"
                                                key={step}
                                                onClick={() => handleIncrementQuest(trackedQuest, step)}
                                                type="button"
                                            >
                                                +{step}
                                            </button>
                                        ))}
                                    </div>

                                    {trackedQuest.is_complete && (
                                        <button
                                            className="quest-secondary-button"
                                            onClick={() => handleStopTracking(trackedQuest)}
                                            type="button"
                                        >
                                            Stop Tracking
                                        </button>
                                    )}

                                </>
                            )}
                        </article>
                    );
                })}
            </div>
        </section>
    );
}