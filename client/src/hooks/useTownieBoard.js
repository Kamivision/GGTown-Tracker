// Needed to create a custom hook to deal with the complex logic that was in the TownieDisplay component. This allows the logic to be easily shared between Townies and Dashboard pages.
import { useEffect, useState } from 'react';

import {
    createTownie,
    createTowniePin,
    createTrackedQuest,
    deleteTowniePin,
    deleteTrackedQuest,
    fetchTowniePins,
    fetchTownies,
    fetchTrackedQuests,
    incrementTrackedQuestAmount,
    updateTrackedQuestAmount,
} from '../utilities';


const EMPTY_MAP = {};

const buildTrackedQuestMap = (quests) => quests.reduce((accumulator, quest) => {
    accumulator[quest.townie_id] = quest;
    return accumulator;
}, {});

const buildPinnedTownieMap = (pins) => pins.reduce((accumulator, pin) => {
    accumulator[pin.townie_id] = pin;
    return accumulator;
}, {});

const buildAmountInputMap = (quests) => quests.reduce((accumulator, quest) => {
    accumulator[quest.id] = String(quest.current_amount);
    return accumulator;
}, {});

const removeMapEntry = (currentMap, key) => {
    const nextMap = { ...currentMap };
    delete nextMap[key];
    return nextMap;
};

export default function useTownieBoard(user) {
    const [townies, setTownies] = useState([]);
    const [trackedQuestsByTownie, setTrackedQuestsByTownie] = useState(EMPTY_MAP);
    const [pinnedTowniesByTownie, setPinnedTowniesByTownie] = useState(EMPTY_MAP);
    const [amountInputs, setAmountInputs] = useState(EMPTY_MAP);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const resetBoardState = () => {
        setTownies([]);
        setTrackedQuestsByTownie(EMPTY_MAP);
        setPinnedTowniesByTownie(EMPTY_MAP);
        setAmountInputs(EMPTY_MAP);
    };

    const syncBoardState = ({ townieData, trackedQuestData, towniePinData }) => {
        setTownies(townieData);
        setTrackedQuestsByTownie(buildTrackedQuestMap(trackedQuestData));
        setPinnedTowniesByTownie(buildPinnedTownieMap(towniePinData));
        setAmountInputs(buildAmountInputMap(trackedQuestData));
    };

    const runMutation = async ({ action, onSuccess, errorMessage, invalidResult, fallbackValue = null }) => {
        try {
            const result = await action();

            if (invalidResult?.(result)) {
                setError(errorMessage);
                return fallbackValue;
            }

            onSuccess?.(result);
            setError('');
            return result;
        } catch (err) {
            setError(errorMessage);
            return fallbackValue;
        }
    };

    useEffect(() => {
        if (!user) {
            resetBoardState();
            setLoading(false);
            return;
        }

        let isMounted = true;

        const loadTownieBoard = async () => {
            setLoading(true);

            try {
                const [townieData, trackedQuestData, towniePinData] = await Promise.all([
                    fetchTownies(),
                    fetchTrackedQuests(),
                    fetchTowniePins(),
                ]);

                if (!isMounted) {
                    return;
                }

                syncBoardState({ townieData, trackedQuestData, towniePinData });
                setError('');
            } catch (err) {
                if (isMounted) {
                    setError('Could not load your townie board.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadTownieBoard();

        return () => {
            isMounted = false;
        };
    }, [user]);
// Upsert functions allows for syncing without redundant API calls.
    const upsertTrackedQuest = (quest) => {
        setTrackedQuestsByTownie((current) => ({
            ...current,
            [quest.townie_id]: quest,
        }));
        setAmountInputs((current) => ({
            ...current,
            [quest.id]: String(quest.current_amount),
        }));
    };

    const removeTrackedQuest = (quest) => {
        setTrackedQuestsByTownie((current) => removeMapEntry(current, quest.townie_id));
        setAmountInputs((current) => removeMapEntry(current, quest.id));
    };

    const upsertTowniePin = (pin) => {
        setPinnedTowniesByTownie((current) => ({
            ...current,
            [pin.townie_id]: pin,
        }));
    };

    const removeTowniePin = (pin) => {
        setPinnedTowniesByTownie((current) => removeMapEntry(current, pin.townie_id));
    };

    const handleCreateTownie = async (townieData) => {
        return runMutation({
            action: () => createTownie(townieData),
            onSuccess: (createdTownie) => setTownies((current) => [...current, createdTownie]),
            errorMessage: 'Could not create that townie.',
            invalidResult: (createdTownie) => !createdTownie,
        });
    };

    const handleStartTracking = async (townieId) => {
        return runMutation({
            action: () => createTrackedQuest(townieId),
            onSuccess: upsertTrackedQuest,
            errorMessage: 'Could not start tracking that townie.',
        });
    };

    const handleStopTracking = async (quest) => {
        const result = await runMutation({
            action: () => deleteTrackedQuest(quest.id),
            onSuccess: () => removeTrackedQuest(quest),
            errorMessage: 'Could not stop tracking that townie.',
            invalidResult: () => false,
            fallbackValue: false,
        });

        return result !== false;
    };

    const handleToggleTowniePin = async (townieId) => {
        const existingPin = pinnedTowniesByTownie[townieId];

        if (existingPin) {
            const result = await runMutation({
                action: () => deleteTowniePin(existingPin.id),
                onSuccess: () => removeTowniePin(existingPin),
                errorMessage: 'Could not update that saved townie.',
                invalidResult: () => false,
                fallbackValue: false,
            });

            return result !== false;
        }

        return runMutation({
            action: () => createTowniePin(townieId),
            onSuccess: upsertTowniePin,
            errorMessage: 'Could not update that saved townie.',
            fallbackValue: false,
        });
    };

    const handleSetTrackedAmount = async (questId, nextAmount) => {
        if (Number.isNaN(nextAmount) || nextAmount < 0) {
            setError('Current amount must be zero or higher.');
            return null;
        }

        return runMutation({
            action: () => updateTrackedQuestAmount(questId, nextAmount),
            onSuccess: upsertTrackedQuest,
            errorMessage: 'Could not update that quest amount.',
        });
    };

    const handleIncrementTrackedAmount = async (questId, amount) => {
        if (Number.isNaN(amount) || amount < 1) {
            setError('Increment amount must be at least 1.');
            return null;
        }

        return runMutation({
            action: () => incrementTrackedQuestAmount(questId, amount),
            onSuccess: upsertTrackedQuest,
            errorMessage: 'Could not increment that quest.',
        });
    };

    return {
        townies,
        trackedQuestsByTownie,
        pinnedTowniesByTownie,
        amountInputs,
        loading,
        error,
        setError,
        setAmountInputs,
        createTownie: handleCreateTownie,
        startTrackingTownie: handleStartTracking,
        stopTrackingTownie: handleStopTracking,
        toggleTowniePin: handleToggleTowniePin,
        setTrackedAmount: handleSetTrackedAmount,
        incrementTrackedAmount: handleIncrementTrackedAmount,
    };
}