// node modules
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// components
import PageContainer from "../components/PageContainer";

// helpers
import { setSubtitle } from "../helpers/Title";
import { getSettingKeys } from "../helpers/Settings";

// Step components
import Step1 from "../components/ExperimentSteps/Step1";
import Step2 from "../components/ExperimentSteps/Step2";
import Step3 from "../components/ExperimentSteps/Step3";
import Step4 from "../components/ExperimentSteps/Step4";
import Step5 from "../components/ExperimentSteps/Step5";
import Step6 from "../components/ExperimentSteps/Step6";

const settingKeys = getSettingKeys();
function renderStep(
    step: string,
    data: { [key: string]: any },
    updateData: (key: string, value: any) => void,
    setEleStep: (ele: JSX.Element | null) => void
): boolean {
    if (
        (["5", "6"].includes(step) && !data.settings)
    ) {
        step = "0"; // redirect to step 0 if settings not loaded
    }
    switch (step) {
        case "1":
            // Step 1: Enter test subject name and tested variable name
            setEleStep(<Step1 {...{ data, updateData }} />);
            return true;
        case "2":
            // Step 2: Show test information and instructions
            setEleStep(<Step2 {...{ data }} />);
            return true;
        case "3":
            // Step 3: Select video file
            setEleStep(<Step3 {...{ data, updateData }} />);
            return true;
        case "4":
            // Step 4: Preview video and prepare for the start of the experiment
            setEleStep(<Step4 {...{ data, updateData }} />);
            return true;
        case "5":
            // Step 5: Conduct the experiment by recording scores
            setEleStep(<Step5 {...{ data, updateData }} />);
            return true;
        case "6":
            // Step 6: Review and edit recorded scores before submission
            setEleStep(<Step6 {...{ data, updateData }} />);
            return true;
        default:
            return false;
    }
}

const links = [
    { title: "Experiment", to: "/experiment", active: true },
    { title: "Results", to: "/results" },
    { title: "Settings", to: "/settings" },
];
export default function ExperimentSteps() {
    const nav = useNavigate();
    const { step } = useParams<{ step: string }>();
    const [data, setData] = useState<object>({});
    const updateData = (key: string, value: any) => {
        setData((prevData) => ({ ...prevData, [key]: value }));
    };
    const [eleStep, setEleStep] = useState<JSX.Element | null>(<></>);

    // Get settings
    const [settings, setSettings] = useState<Record<string, any>>({});
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
        })();
    }, []);

    // Render content
    useEffect(() => {
        if (Object.keys(settings).length === 0) {
            return;
        }
        updateData("settings", settings);
    }, [settings]);
    useEffect(() => {
        console.log("Step: ", step);
    }, [step]);
    useEffect(() => {
        console.log("Data: ", data);
    }, [data]);
    useEffect(() => {
        if (!renderStep(step || "0", data, updateData, setEleStep)) {
            nav("/experiment", { replace: true });
        }
    }, [settings, step, data]);

    setSubtitle(`Experiment - Step ${step}`);
    return (
        <PageContainer navbarLinks={links}>
            <div className="d-flex flex-center flex-column gap-lg-4 gap-3 col-12">
                {eleStep}
            </div>
        </PageContainer>
    );
}
