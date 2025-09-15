// node modules
import { useState, useEffect, useRef, RefObject } from "react";
import { Form } from "react-bootstrap";

// components
import PageContainer from "../components/PageContainer";

// helpers
import { setSubtitle } from "../helpers/Title";
import { generateElementKey } from "../helpers/Element";
import { getSettingOrder, getSettingKeys } from "../helpers/Settings";

// styles
import "./Settings.css";

const autosaveTimeout = 500;
const settingOrder = getSettingOrder();
const settingKeys = getSettingKeys();
function renderTable(
    refTableBody: RefObject<HTMLTableSectionElement>,
    settings: Record<string, any>,
    setSettings: (settings: Record<string, any>) => void,
    refSaveTimeout: any,
    refRangeIndicator: any,
    setSettingsChanged: (changed: boolean) => void,
    refUpdatedMessage: RefObject<HTMLSpanElement>,
) {
    const handleSave = (key: string, newValue: any) => {
        setSettings((prevSettings: Record<string, any>) => ({ ...prevSettings, [key]: newValue }));
        setSettingsChanged(true);
        if (refSaveTimeout.current) {
            clearTimeout(refSaveTimeout.current);
        }
        refSaveTimeout.current = setTimeout(async () => {
            console.log(key, newValue);
            await window.db.settings.set({ key: key, value: newValue });
            refUpdatedMessage.current && (refUpdatedMessage.current.classList.add('show'));
            setTimeout(() => {
                refUpdatedMessage.current && (refUpdatedMessage.current.classList.remove('show'));
            }, 1000);
        }, autosaveTimeout);
    };
    const renderInput = (key: string, value: any) => {
        const shouldDisableVolumeSetting = key === "notifySoundVolume" && !settings.useNotifySound;
        const templates: Record<string, any> = {
            number: (key: string, value: number) => (
                <Form.Control
                    type="number"
                    min={0}
                    defaultValue={value}
                    onChange={(e) => handleSave(key, Number(e.target.value))}
                />
            ),
            switch: (key: string, value: boolean) => (
                <Form.Switch
                    className="my-1"
                    defaultChecked={value}
                    onChange={(e) => handleSave(key, e.target.checked)}
                />
            ),
            range: (key: string, value: number) => (
                <>
                    <Form.Group className="d-flex align-items-center">
                        <Form.Label ref={refRangeIndicator} className={`col-1 my-1 ${shouldDisableVolumeSetting && 'text-muted'}`}>
                            {value}%
                        </Form.Label>
                        <Form.Range
                            min={0}
                            max={100}
                            defaultValue={value}
                            onChange={(e) => {
                                refRangeIndicator.current && (refRangeIndicator.current.innerHTML = `${e.target.value}%`);
                                handleSave(key, Number(e.target.value));
                            }}
                            disabled={shouldDisableVolumeSetting}
                        />
                    </Form.Group>
                </>
            ),
        };
        const inputType = settingKeys[key].inputType || "number";
        return templates[inputType](key, value);
    };

    const eleSettings = settingOrder.map((key) => {
        const info = settingKeys[key];
        const value = settings[key];
        console.log(key, value);
        return (
            <tr key={generateElementKey(`settings-${key}`)}>
                <td className="align-middle">{info.description}</td>
                <td className="align-middle">{renderInput(key, value)}</td>
            </tr>
        );
    });
    return (
        <table className="table">
            <thead>
                <tr>
                    <th scope="col" className="col-5">
                        Description
                    </th>
                    <th scope="col">Value</th>
                </tr>
            </thead>
            <tbody ref={refTableBody}>{eleSettings}</tbody>
        </table>
    );
}

const links = [
    { title: "Experiment", to: "/experiment" },
    { title: "Results", to: "/results" },
    { title: "Settings", to: "/settings", active: true },
];
export default function Settings() {
    setSubtitle("Settings");
    const refUpdatedMessage = useRef<HTMLSpanElement>(null);
    const refTableBody = useRef<HTMLTableSectionElement>(null);
    const refSaveTimeout = useRef<NodeJS.Timeout | null>(null);
    const refRangeIndicator = useRef<any>(null);
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
            renderTable(refTableBody, settings, setSettings, refSaveTimeout, refRangeIndicator, setSettingsChanged, refUpdatedMessage)
        );
        setSettingsChanged(false);
        console.log("");
    }, [settings, settingsLoaded, settingsChanged]);
    useEffect(() => console.log("settings changed: ", settings), [settingsChanged]);

    return (
        <PageContainer navbarLinks={links} centered={false}>
            <div className="d-flex flex-center flex-column gap-lg-4 gap-3 col-12">
                <div className="d-flex flex-column flex-center">
                    <h1 className="text-center">Settings</h1>
                    <span id="settingsUpdatedMessage" ref={refUpdatedMessage} className="text-muted">Settings saved.</span>
                </div>
                <div className="table-responsive col-12">{eleTable}</div>
            </div>
        </PageContainer>
    );
}
