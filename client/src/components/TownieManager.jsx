const parseQuestAmount = (questAmount) => {
    const parsedAmount = Number.parseInt(questAmount, 10);
    return Number.isInteger(parsedAmount) && parsedAmount > 0 ? parsedAmount : 0;
};

const buildTownieRecord = (townieId, townieLookup, trackedQuest, pinnedTownie) => {
    const townie = townieLookup[townieId];

    if (townie) {
        return townie;
    }

    if (trackedQuest) {
        return {
            id: trackedQuest.townie_id,
            name: trackedQuest.townie_name,
            quest_type: trackedQuest.quest_type,
            quest: trackedQuest.quest,
            quest_amount: trackedQuest.quest_amount,
        };
    }

    return {
        id: pinnedTownie.townie_id,
        name: pinnedTownie.townie_name,
        quest_type: pinnedTownie.quest_type,
        quest: pinnedTownie.quest,
        quest_amount: pinnedTownie.quest_amount,
    };
};

export default function TownieManager({
    amountInputs,
    error,
    pinnedTowniesByTownie,
    searchTerm,
    setAmountInputs,
    setSearchTerm,
    startTrackingTownie,
    stopTrackingTownie,
    toggleTowniePin,
    townies,
    trackedQuestsByTownie,
    incrementTrackedAmount,
    setTrackedAmount,
}) {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const townieLookup = townies.reduce((accumulator, townie) => {
        accumulator[townie.id] = townie;
        return accumulator;
    }, {});

// Removes duplication and ensures a single source of townie data, whether it's from the tracked quests or pinned townies
    const savedTownieIds = Array.from(new Set([
        ...Object.keys(trackedQuestsByTownie),
        ...Object.keys(pinnedTowniesByTownie),
    ])).map((townieId) => Number.parseInt(townieId, 10));

    const visibleTownies = savedTownieIds
        .map((townieId) => {
            const trackedQuest = trackedQuestsByTownie[townieId];
            const pinnedTownie = pinnedTowniesByTownie[townieId];
            const townie = buildTownieRecord(townieId, townieLookup, trackedQuest, pinnedTownie);

            return {
                townie,
                trackedQuest,
                isPinned: Boolean(pinnedTownie),
            };
        })
        .filter(({ townie }) => {
            if (!normalizedSearchTerm) {
                return true;
            }

            const searchableText = [townie.name, townie.quest, townie.quest_type]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return searchableText.includes(normalizedSearchTerm);
        })
        .sort((left, right) => {
            const leftTracked = left.trackedQuest ? 1 : 0;
            const rightTracked = right.trackedQuest ? 1 : 0;

            if (leftTracked !== rightTracked) {
                return rightTracked - leftTracked;
            }

            return left.townie.name.localeCompare(right.townie.name);
        });

    const handleSetAmount = async (event, quest) => {
        event.preventDefault();
        const nextAmount = Number.parseInt(amountInputs[quest.id] ?? `${quest.current_amount}`, 10);
        await setTrackedAmount(quest.id, nextAmount);
    };

    return (
        <section className="pb-6">
            {error && <p className="quest-error-banner">{error}</p>}

            <div className="quest-toolbar">
                <label className="quest-search-group">
                    <span>Search saved townies</span>
                    <input
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Name, quest, or type"
                        type="search"
                        value={searchTerm}
                    />
                </label>
            </div>

            {visibleTownies.length === 0 && (
                <p className="quest-empty-state">Pin a townie or start tracking one from the dashboard to manage it here.</p>
            )}

            <div className="quest-grid">
                {visibleTownies.map(({ townie, trackedQuest, isPinned }) => {
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

                            <button
                                aria-pressed={isPinned}
                                className="quest-pin-button"
                                onClick={() => toggleTowniePin(townie.id)}
                                type="button"
                            >
                                {isPinned ? 'Unpin from Townies' : 'Pin to Townies'}
                            </button>

                            {!trackedQuest && (
                                <>
                                    <p className="quest-card-meta">Saved for later. Start tracking when you are ready.</p>
                                    <button
                                        className="quest-primary-button"
                                        disabled={targetAmount < 1}
                                        onClick={() => startTrackingTownie(townie.id)}
                                        type="button"
                                    >
                                        {targetAmount < 1 ? 'Quest amount is not numeric' : 'Start Tracking'}
                                    </button>
                                </>
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
                                                onChange={(event) => setAmountInputs((current) => ({
                                                    ...current,
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
                                                onClick={() => incrementTrackedAmount(trackedQuest.id, step)}
                                                type="button"
                                            >
                                                +{step}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        className="quest-secondary-button"
                                        onClick={() => stopTrackingTownie(trackedQuest)}
                                        type="button"
                                    >
                                        Stop Tracking
                                    </button>
                                </>
                            )}
                        </article>
                    );
                })}
            </div>
        </section>
    );
}