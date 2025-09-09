// node modules
import { useState, useEffect, useRef, RefObject } from "react";
import { useNavigate } from "react-router-dom";

// helpers
import { checkRequiredFields } from "../../helpers/ExperimentStepsHelper";

// components
import RecordChart from "../RecordChart";
import ModalEditScore from "../ModalEditScore";

function renderContent(
    data: { [key: string]: any },
    player: RefObject<HTMLVideoElement>,
    record: Record<string, { time: string; timeMS: string; score: number }>,
    updateRecord: (time: string, score: number) => void,
    handlePointClick: (payload: any, key: string) => void,
    settings: Record<string, any>
) {
    const isEditable = true;
    const isBidirectional = settings.isBidirectional;
    const maxScore = settings.maxScore;
    return (
        <div className="d-flex flex-column gap-3">
            <div className="d-flex flex-center">
                <video
                    ref={player}
                    autoPlay={false}
                    controls
                    controlsList="nodownload"
                    className="col-6 p-0 rounded-4"
                >
                    <source src={URL.createObjectURL(data.video)} type="video/mp4" />
                </video>
                <div className="col-6 d-flex flex-center">
                    <RecordChart
                        {...{
                            record,
                            isBidirectional,
                            maxScore,
                            updateRecord,
                            isEditable,
                            handlePointClick,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

// TODO: finish nav to result page with dedicated result id
function nextStep(nav: any, data: { [key: string]: any }) {
    // Here you would typically handle saving the data to a database or backend
    console.log("Final data to be saved:", data);
    // For now, we'll just navigate to a hypothetical results page
    nav("/results");
}

/**
 * Step 6: Final edit on score values, and name the tests
 * - Will save data to DB on clicking Done button, and go to result page on success
 */
export default function Step6({
    data,
    updateData,
    settings,
}: {
    data: { [key: string]: any };
    updateData: (key: string, value: any) => void;
    settings: Record<string, any>;
}) {
    const nav = useNavigate();
    const nextBtnRef = useRef<HTMLButtonElement>(null);
    const player = useRef<HTMLVideoElement>(null);
    const [content, setContent] = useState<JSX.Element | null>(null);
    const [record, setRecord] = useState<
        Record<string, { time: string; timeMS: string; score: number }>
    >(data.record); // Record of scores by timestamp
    const updateRecord = (time: string, score: number) => {
        setRecord((prev) => {
            if (!(time in prev)) {
                return prev;
            }
            return {
                ...prev,
                [time]: {
                    ...prev[time],
                    score,
                },
            };
        });
    };
    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [newScore, setNewScore] = useState<number>(0);

    // player related
    const jumpToTime = (time: string) => {
        if (!player.current) return;
        player.current.currentTime = Number(time);
        player.current.play();
        console.log("Jump to time:", player.current.currentTime);
    };
    const pausePlayer = () => {
        if (!player.current) return;
        player.current.pause();
    };

    // When clicking a data point
    const handlePointClick = (
        payload: { time: string; timeMS: string; score: number },
        key: string
    ) => {
        console.log("Clicked point:", payload);
        setSelectedTime(key);
        jumpToTime(key);
        setNewScore(payload.score);
        setShowModal(true);
    };

    // Save changes
    const handleSave = () => {
        if (selectedTime && updateRecord) {
            updateRecord(selectedTime, newScore);
        }
        setShowModal(false); // close modal
        setSelectedTime(null); // reset selected time
        pausePlayer();
    };

    // Hide modal
    const handleHide = () => {
        setShowModal(false);
        setSelectedTime(null);
        pausePlayer();
    };

    useEffect(() => console.log("showModal: ", showModal), [showModal]);
    useEffect(() => console.log("newScore: ", newScore), [newScore]);
    useEffect(() => console.log("selectedTime: ", selectedTime), [selectedTime]);

    // bindEnterKey(nextBtnRef);
    const processContentRender = () => {
        if (
            !checkRequiredFields(
                ["subjectName", "variableName", "video", "record"],
                data
            )
        ) {
            nav("/experiment", { replace: true });
        } else {
            setContent(
                renderContent(data, player, record, updateRecord, handlePointClick, settings)
            );
        }
    };
    useEffect(processContentRender, []);
    useEffect(processContentRender, [record]);

    const isBidirectional = settings.isBidirectional;
    const maxScore = settings.maxScore;
    return (
        <div className="row col-12 flex-center gap-5">
            {content}
            <div className="d-flex flex-center gap-3">
                <button
                    className="btn btn-outline-success btn-lg"
                    onClick={() => nextStep(nav, data)}
                    ref={nextBtnRef}
                >
                    Done
                </button>
            </div>

            {/* Bootstrap Modal */}
            <ModalEditScore
                {...{
                    showModal,
                    handleHide,
                    newScore,
                    setNewScore,
                    handleSave,
                    isBidirectional,
                    maxScore,
                }}
            />
        </div>
    );
}
