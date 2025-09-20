// node modules
import { useState, useEffect, useRef } from "react";

// components
import PageContainer from "../components/PageContainer";
import SettingsTable from "../components/SettingsTable";

// helpers
import { setSubtitle } from "../helpers/Title";
import { getSettingKeys } from "../helpers/Settings";

// styles
import "./Settings.css";

const settingKeys = getSettingKeys();
const links = [
    { title: "Experiment", to: "/experiment" },
    { title: "Results", to: "/results" },
    { title: "Settings", to: "/settings", active: true },
];
export default function Settings() {
    setSubtitle("Settings");
    const refUpdatedMessage = useRef<HTMLSpanElement>(null);
    const [eleTable, setEleTable] = useState<JSX.Element | null>(<></>);
    const [settings, setSettings] = useState<Record<string, any>>({});
    const [settingsLoaded, setSettingsLoaded] = useState(false);
    const [settingsChanged, setSettingsChanged] = useState(false);

    const updateSettings = (key: string, value: any) => {
        setSettings((prevSettings: Record<string, any>) => ({
            ...prevSettings,
            [key]: value,
        }));
        setSettingsChanged(true);
    };

    useEffect(() => {
        (async () => {
            const rawResults = await window.db.settings.list();
            const rawResultsCount = Object.keys(rawResults).length;
            const isAllUsingDefaultValue = rawResultsCount === 0;
            Object.entries(settingKeys).forEach(([key, info]) => {
                const isUsingDefaultValue = rawResults[key] === undefined;
                const value = !isUsingDefaultValue ? rawResults[key] : info.default;
                if (!isAllUsingDefaultValue && isUsingDefaultValue) {
                    console.log(`${key} is using default value`);
                }
                updateSettings(key, value);
            });
            setSettingsLoaded(true);
        })();
    }, []);
    useEffect(() => {
        if (Object.keys(settings).length === 0) {
            return;
        }
        console.log("settings update: ", settings);
        setEleTable(
            <SettingsTable
                {...{
                    settings,
                    isEditable: true,
                    setSettings,
                    setSettingsChanged,
                    refUpdatedMessage,
                }}
            />
        );
        setSettingsChanged(false);
    }, [settings, settingsLoaded, settingsChanged]);
    
    useEffect(
        () => console.log("settings: ", settings),
        [settings]
    );
    useEffect(
        () => console.log("settings changed"),
        [settingsChanged]
    );

    const resetToDefault = (e: any) => {
        e.preventDefault();
        if (confirm("Are you sure to reset all settings to default?")) {
            console.log("Reset to default");
            Object.entries(settingKeys).forEach(([key, info]) => {
                const value = info.default;
                window.db.settings.set({ key, value });
            });
            window.location.reload();
        }
    };

    return (
        <PageContainer navbarLinks={links} centered={false}>
            <div className="d-flex flex-center flex-column gap-lg-4 gap-3 col-12">
                <div className="d-flex flex-column flex-center">
                    <h1 className="text-center">Settings</h1>
                    <span
                        id="settingsUpdatedMessage"
                        ref={refUpdatedMessage}
                        className="text-muted"
                    >
                        Settings saved.
                    </span>
                    <div className="d-flex flex-center col-12 gap-3 mt-3">
                        <button
                            className="btn btn-outline-danger"
                            onClick={resetToDefault}
                        >
                            Reset to default settings
                        </button>
                    </div>
                </div>
                <div className="table-responsive col-12">{eleTable}</div>
            </div>
        </PageContainer>
    );
}
