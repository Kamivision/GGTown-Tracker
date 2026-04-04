const parseQuestAmount = (questAmount) => {
    const parsedAmount = Number.parseInt(questAmount, 10);
    return Number.isInteger(parsedAmount) && parsedAmount > 0 ? parsedAmount : 0;
};


export default function TownieDisplay({
    error,
    newTownieData,
    onCreateTownie,
    onStartTracking,
    onStopTracking,
    onTogglePin,
    pinnedTowniesByTownie,
    searchTerm,
    setNewTownieData,
    setSearchTerm,
    townies,
    trackedQuestsByTownie,
}) {
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
        .sort((leftTownie, rightTownie) => leftTownie.name.localeCompare(rightTownie.name));

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { name, quest, quest_amount, quest_type } = newTownieData;

        if (!name || !quest || !quest_amount || !quest_type) {
            return;
        }

        const createdTownie = await onCreateTownie(newTownieData);

        if (createdTownie) {
            setNewTownieData({
                name: '',
                quest: '',
                quest_amount: '',
                quest_type: '',
            });
        }
    };

    return (
        <section className="pb-6">
            {error && <p className="quest-error-banner">{error}</p>}

            <div className="quest-toolbar">
                <form className="quest-form-row" onSubmit={handleSubmit}>
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

            <div className="quest-grid">
                {visibleTownies.map((townie) => {
                    const trackedQuest = trackedQuestsByTownie[townie.id];
                    const isPinned = Boolean(pinnedTowniesByTownie[townie.id]);
                    const targetAmount = parseQuestAmount(townie.quest_amount);

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
                                onClick={() => onTogglePin(townie.id)}
                                type="button"
                            >
                                {isPinned ? 'Unpin from Townies' : 'Pin to Townies'}
                            </button>

                            {!trackedQuest && (
                                <button
                                    className="quest-primary-button"
                                    disabled={targetAmount < 1}
                                    onClick={() => onStartTracking(townie.id)}
                                    type="button"
                                >
                                    {targetAmount < 1 ? 'Quest amount is not numeric' : 'Start Tracking'}
                                </button>
                            )}

                            {trackedQuest && (
                                <button
                                    className="quest-secondary-button"
                                    onClick={() => onStopTracking(trackedQuest)}
                                    type="button"
                                >
                                    Stop Tracking
                                </button>
                            )}
                        </article>
                    );
                })}
            </div>
        </section>
    );
}