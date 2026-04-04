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

            <div className="mx-auto mb-6 grid w-full max-w-6xl gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)]">
                <section className="quest-card w-full max-w-none text-left">
                    <div className="mb-5">
                        <p className="quest-card-type">Add A Townie</p>
                        <h2 className="m-0 text-2xl font-semibold">Create Your Own Townie!</h2>
                        <p className="quest-card-meta mt-2 mb-0">Add townie details below and save them to your dashboard.</p>
                    </div>

                    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                        <label className="quest-input-group text-left">
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

                        <label className="quest-input-group text-left">
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

                        <label className="quest-input-group text-left md:col-span-2 xl:col-span-1">
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

                        <label className="quest-input-group text-left">
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

                        <div className="md:col-span-2 flex justify-end pt-2">
                            <button className="quest-primary-button min-w-36" type="submit">
                                Add Townie
                            </button>
                        </div>
                    </form>
                </section>

                <section className="quest-card w-full max-w-none text-left">
                    <div className="mb-4">
                            <p className="quest-card-type">Search</p>
                            <h2 className="m-0 text-2xl font-semibold">Find Existing Townies</h2>
                    </div>

                    <label className="quest-search-group w-full text-left">
                        <span>Search Townies</span>
                        <input
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Name, quest, or type"
                            type="search"
                            value={searchTerm}
                        />
                    </label>
                </section>
            </div>

            <div className="quest-grid justify-center">
                {visibleTownies.map((townie) => {
                    const trackedQuest = trackedQuestsByTownie[townie.id];
                    const isPinned = Boolean(pinnedTowniesByTownie[townie.id]);
                    const targetAmount = parseQuestAmount(townie.quest_amount);

                    return (
                        <article className="quest-card h-full w-full max-w-[320px] justify-self-center" key={townie.id}>
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