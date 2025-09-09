export function getSettingOrder(): string[] {
    const settingOrder: string[] = [
        "useNotifySound",    // play sound for stale scores
        "notifySoundVolume", // notification volume (0-100)
        "updateInterval",    // score capture interval (ms)
        "resetTimeout",      // delay before auto-reset (ms)
        "resetInterval",     // time between auto-resets (ms)
        "resetUnit",         // points per reset
        "maxScore",          // maximum score (negative if bidirectional)
        "isBidirectional",   // allow negative scores
    ];
    return settingOrder;
}

export function getSettingKeys(): Record<string, Record<string, any>> {
    const settingKeys: Record<string, Record<string, any>> = {
        updateInterval: {
            description: "Score capture interval (ms)",
            default: 1000,
            inputType: "number",
        },
        useNotifySound: {
            description: "Play sound for stale scores",
            default: true,
            inputType: "switch",
        },
        notifySoundVolume: {
            description: "Notification volume (0-100)",
            default: 10,
            inputType: "range",
        },
        resetUnit: {
            description: "Points per reset",
            default: 1,
            inputType: "number",
        },
        resetTimeout: {
            description: "Delay before auto-reset (ms)",
            default: 5000,
            inputType: "number",
        },
        resetInterval: {
            description: "Time between auto-resets (ms)",
            default: 1000,
            inputType: "number",
        },
        isBidirectional: {
            description: "Allow negative scores",
            default: true,
            inputType: "switch",
        },
        maxScore: {
            description: "Maximum score (negative if bidirectional)",
            default: 5,
            inputType: "number",
        },
    };
    return settingKeys;
}