import { useEffect, useState } from 'react';
import {
    createTrackedQuest,
    fetchTownies,
    fetchTrackedQuests,
    incrementTrackedQuestAmount,
    updateTrackedQuestAmount,
} from '../utilities';


const parseQuestAmount = (questAmount) => {
    const parsedAmount = Number.parseInt(questAmount, 10);
    return Number.isInteger(parsedAmount) && parsedAmount > 0 ? parsedAmount : 0;
};


export default function TownieDisplay({ user }) {
    const [townies, setTownies] = useState([]);
    const [trackedQuests, setTrackedQuests] = useState({});
    const [amountInputs, setAmountInputs] = useState({});
    const [incrementInputs, setIncrementInputs] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        const nextIncrementInputs = {};

        quests.forEach((quest) => {
            nextTrackedQuests[quest.townie_id] = quest;
            nextAmountInputs[quest.id] = String(quest.current_amount);
            nextIncrementInputs[quest.id] = '1';
        });

        setTrackedQuests(nextTrackedQuests);
        setAmountInputs(nextAmountInputs);
        setIncrementInputs(nextIncrementInputs);
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
        setIncrementInputs((currentIncrementInputs) => ({
            ...currentIncrementInputs,
            [quest.id]: currentIncrementInputs[quest.id] ?? '1',
        }));
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

    const handleIncrementQuest = async (quest, amountOverride) => {
        const incrementAmount = amountOverride ?? Number.parseInt(incrementInputs[quest.id] ?? '1', 10);

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

    if (!user) {
        return <p className="quest-empty-state">Log in to track your personal quest amounts.</p>;
    }

    if (loading) {
        return <p className="quest-empty-state">Loading your quest tracker...</p>;
    }

    if (error) {
        return (
            <section>
                <p className="quest-error-banner">{error}</p>
                <div className="quest-grid">
                    {townies.map((townie) => {
                        const targetAmount = parseQuestAmount(townie.quest_amount);
                        const trackedQuest = trackedQuests[townie.id];

                        return (
                            <article className="quest-card" key={townie.id}>
                                <div className="quest-card-header">
                                    <p className="quest-card-type">{townie.quest_type}</p>
                                    <h2>{townie.name}</h2>
                                </div>
                                <p className="quest-card-copy">{townie.quest}</p>
                                <p className="quest-card-meta">Goal: {targetAmount || townie.quest_amount}</p>
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
            <div className="quest-grid">
                {townies.map((townie) => {
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

                            <p className="quest-card-copy">{townie.quest}</p>
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

                                    <form
                                        className="quest-form-row"
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            handleIncrementQuest(trackedQuest);
                                        }}
                                    >
                                        <label className="quest-input-group">
                                            <span>Add more</span>
                                            <input
                                                min="1"
                                                onChange={(event) => setIncrementInputs((currentIncrementInputs) => ({
                                                    ...currentIncrementInputs,
                                                    [trackedQuest.id]: event.target.value,
                                                }))}
                                                type="number"
                                                value={incrementInputs[trackedQuest.id] ?? '1'}
                                            />
                                        </label>
                                        <button className="quest-secondary-button" type="submit">
                                            Add
                                        </button>
                                    </form>
                                </>
                            )}
                        </article>
                    );
                })}
            </div>
        </section>
    );
}