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

    useEffect(() => {
        (async () => {
            const rawResults = await window.db.settings.list();
            const rawResultsCount = Object.keys(rawResults).length;
            const isAllUsingDefaultValue = rawResultsCount === 0;
            const results: Record<string, any> = {};
            Object.entries(settingKeys).forEach(([key, info]) => {
                const isUsingDefaultValue = rawResults[key] === undefined;
                const value = !isUsingDefaultValue ? rawResults[key] : info.default;
                if (!isAllUsingDefaultValue && isUsingDefaultValue) {
                    console.log(`${key} is using default value`);
                }
                results[key] = value;
            });
            console.log("settings: ", results);
            setSettings(results);
            setSettingsLoaded(true);
        })();
    }, []);
    useEffect(() => {
        if (Object.keys(settings).length === 0) {
            return;
        }
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
        console.log("");
    }, [settings, settingsLoaded, settingsChanged]);
    useEffect(
        () => console.log("settings changed: ", settings),
        [settingsChanged]
    );

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
                </div>
                <div className="table-responsive col-12">{eleTable}</div>
            </div>
        </PageContainer>
    );
}
