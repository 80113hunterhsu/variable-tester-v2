// node modules
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// components
import PageContainer from "../components/PageContainer";

// helpers
import { setSubtitle } from "../helpers/Title";

// Step components
import Step1 from "../components/ExperimentSteps/Step1";
import Step2 from "../components/ExperimentSteps/Step2";
import Step3 from "../components/ExperimentSteps/Step3";
import Step4 from "../components/ExperimentSteps/Step4";
import Step5 from "../components/ExperimentSteps/Step5";
import Step6 from "../components/ExperimentSteps/Step6";

function renderStep(
    step: string,
    data: { [key: string]: any },
    updateData: (key: string, value: any) => void,
    nav: any
) {
    console.log(data);
    switch (step) {
        case "1":
            // Step 1: Enter test subject name and tested variable name
            return <Step1 {...{ data, updateData }} />;
        case "2":
            // Step 2: Show test information and instructions
            return <Step2 {...{ data }} />;
        case "3":
            // Step 3: Select video file
            return <Step3 {...{ data, updateData }} />;
        case "4":
            // Step 4: Preview video and prepare for the start of the experiment
            return <Step4 {...{ data, updateData }} />;
        case "5":
            // Step 5: Conduct the experiment by recording scores
            return <Step5 {...{ data, updateData }} />;
        case "6":
            // Step 6: Review and edit recorded scores before submission
            return <Step6 {...{ data, updateData }} />;
        default:
            nav("/experiment", { replace: true });
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

    // Get settings
    const [updateInterval, setUpdateInterval] = useState<number>(1000);     // 取樣頻率（毫秒）
    const [useNotifySound, setUseNotifySound] = useState<boolean>(true);    // 是否使用聲音提示「閒置過久」
    const [notifySoundVolume, setNotifySoundVolume] = useState<number>(10); // 提示音量（0~100）
    const [resetUnit, setResetUnit] = useState<number>(1);                  // 重設單位（分數）
    const [resetTimeout, setResetTimeout] = useState<number>(5000);         // 重設延遲（毫秒）
    const [resetInterval, setResetInterval] = useState<number>(1000);       // 重設頻率（毫秒）
    const [isBidirectional, setIsBidirectional] = useState<boolean>(true);  // 分數是否包含正負向，或僅有正向
    const [maxScore, setMaxScore] = useState<number>(10);                   // 分數最大值，負向分數最大值為 -maxScore

    setSubtitle(`Experiment - Step ${step}`);
    return (
        <PageContainer navbarLinks={links}>
            <div className="d-flex flex-center flex-column gap-lg-4 gap-3 col-12">
                {renderStep(step || "0", data, updateData, nav)}
            </div>
        </PageContainer>
    );
}
