// node modules
import { useRef, RefObject } from "react";
import { Form } from "react-bootstrap";

// helpers
import { generateElementKey } from "../helpers/Element";
import { getSettingOrder, getSettingKeys } from "../helpers/Settings";

const autosaveTimeout = 500;
export default function SettingsTable({
    settings,
    isEditable = false,
    setSettings = () => { },
    setSettingsChanged = () => { },
    refUpdatedMessage = null,
}: {
    settings: Record<string, any>;
    isEditable?: boolean;
    setSettings?: (settings: Record<string, any>) => void;
    setSettingsChanged?: (changed: boolean) => void;
    refUpdatedMessage?: RefObject<HTMLSpanElement> | null;
}) {
    const refTableBody = useRef<HTMLTableSectionElement>(null);
    const refSaveTimeout = useRef<NodeJS.Timeout | null>(null);
    const refRangeIndicator = useRef<any>(null);
    const settingOrder = getSettingOrder();
    const settingKeys = getSettingKeys();
    const handleSave = (key: string, newValue: any) => {
        setSettings((prevSettings: Record<string, any>) => ({
            ...prevSettings,
            [key]: newValue,
        }));
        setSettingsChanged(true);
        if (refSaveTimeout.current) {
            clearTimeout(refSaveTimeout.current);
        }
        refSaveTimeout.current = setTimeout(async () => {
            console.log(key, newValue);
            await window.db.settings.set({ key: key, value: newValue });
            refUpdatedMessage &&
                refUpdatedMessage.current &&
                refUpdatedMessage.current.classList.add("show");
            setTimeout(() => {
                refUpdatedMessage &&
                    refUpdatedMessage.current &&
                    refUpdatedMessage.current.classList.remove("show");
            }, 1500);
        }, autosaveTimeout);
    };
    const renderInput = (key: string, value: any) => {
        const shouldDisableVolumeSetting =
            key === "notifySoundVolume" && !settings.useNotifySound;
        const templates: Record<string, any> = {
            number: (key: string, value: number) => (
                <Form.Control
                    type="number"
                    min={0}
                    defaultValue={value}
                    onChange={(e) => handleSave(key, Number(e.target.value))}
                    disabled={!isEditable}
                />
            ),
            switch: (key: string, value: boolean) => (
                <Form.Switch
                    className="my-1"
                    defaultChecked={value}
                    onChange={(e) => handleSave(key, e.target.checked)}
                    disabled={!isEditable}
                />
            ),
            range: (key: string, value: number) => (
                <>
                    <Form.Group className="d-flex align-items-center">
                        <Form.Label
                            ref={refRangeIndicator}
                            className={`col-1 my-1 ${shouldDisableVolumeSetting && "text-muted"
                                }`}
                        >
                            {value}%
                        </Form.Label>
                        <Form.Range
                            min={0}
                            max={100}
                            defaultValue={value}
                            onChange={(e) => {
                                refRangeIndicator.current &&
                                    (refRangeIndicator.current.innerHTML = `${e.target.value}%`);
                                handleSave(key, Number(e.target.value));
                            }}
                            disabled={!isEditable || shouldDisableVolumeSetting}
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
