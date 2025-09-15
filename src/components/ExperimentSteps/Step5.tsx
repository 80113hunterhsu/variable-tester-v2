// node modules
import { useState, useEffect, useRef, RefObject } from "react";
import { useNavigate } from "react-router-dom";
import useSound from "use-sound";
import beepSound from "../../assets/beep.mp3";

// components
import RecordChart from "../RecordChart";
import ScoreBar from "../ScoreBar";

// helpers
import { debounce } from "../../helpers/Element";
import {
    checkRequiredFields,
    bindEnterKey,
} from "../../helpers/ExperimentStepsHelper";
import { sleep } from "../../helpers/Sleep";

const requiredFields = ["settings", "subject_name", "variable_name", "video"];

function renderContent(
    data: { [key: string]: any },
    player: RefObject<HTMLVideoElement>,
    record: Record<string, { time: string; timeMS: string; score: number }>,
    settings: Record<string, any>
) {
    const isBidirectional = settings.isBidirectional;
    const maxScore = settings.maxScore;
    return (
        <div className="d-flex flex-column gap-3">
            <div className="d-flex flex-center">
                <video
                    ref={player}
                    autoPlay={true}
                    controls
                    controlsList="nodownload"
                    className="col-6 p-0 rounded-4"
                >
                    <source src={URL.createObjectURL(data.video)} type="video/mp4" />
                </video>
                <div className="col-6 d-flex flex-center">
                    <RecordChart {...{ record, isBidirectional, maxScore }} />
                </div>
            </div>
        </div>
    );
}

function notifySound(settings: Record<string, any>, playSound: any) {
    settings.useNotifySound && playSound();
}

function scoreCorrection(settings: Record<string, any>, newScore: number) {
    const maxScore = settings.maxScore;
    const minScore = settings.isBidirectional ? -maxScore : 0;
    if (newScore > maxScore) {
        return maxScore;
    }
    if (newScore < minScore) {
        return minScore;
    }
    return newScore;
}

// 清除分數取樣間隔
function clearScoreSamplingInterval(intervalRef: any) {
    console.log("Clear score sampling interval");
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }
}
// 清除自動重設
function clearResetInterval(autoResetIntervalRef: any) {
    console.log("Clear auto reset interval");
    if (autoResetIntervalRef.current) {
        clearInterval(autoResetIntervalRef.current);
        autoResetIntervalRef.current = null;
    }
}
// 清除舊的計時器
function clearResetTimer(resetTimerRef: any) {
    console.log("Clear reset timer");
    if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
    }
}

function updateRecord(time: number, score: number, setRecord: any, settings: Record<string, any>) {
    const timeInMinutes = Math.trunc(time / 1000 / 60);
    const timeInSeconds = Math.trunc(time / 1000) % 60;
    const remainMillis = time % 1000;
    const needMillis = settings.updateInterval % 1000 !== 0 && remainMillis > 0;
    const timeInSecondsAndMillis = `${Math.trunc(time / 1000)}${needMillis ? `.${remainMillis}` : ""
        }`;
    setRecord((prevRecord: object) => ({
        ...prevRecord,
        [timeInSecondsAndMillis]: {
            time: timeInSecondsAndMillis,
            timeMS: `${timeInMinutes}' ${timeInSeconds}${needMillis ? `.${remainMillis}` : ""
                }"`,
            score: score,
        },
    }));
}

function nextStep(
    nav: any,
    record: Record<string, { time: string; timeMS: string; score: number }>,
    updateData: (key: string, value: any) => void,
    intervalRef: RefObject<NodeJS.Timeout | null>,
    autoResetIntervalRef: RefObject<NodeJS.Timeout | null>,
    resetTimerRef: RefObject<NodeJS.Timeout | null>
) {
    console.log("Go to step 6");
    clearScoreSamplingInterval(intervalRef);
    clearResetInterval(autoResetIntervalRef);
    clearResetTimer(resetTimerRef);
    updateData("record", record);
    nav("/experiment/step/6");
}

/**
 * Step 5: Start the experiment and record results
 */
export default function Step5({
    data,
    updateData,
}: {
    data: { [key: string]: any };
    updateData: (key: string, value: any) => void;
}) {
    const settings = data.settings;
    const nav = useNavigate();
    const [playNotifySound] = useSound(beepSound, {
        volume: settings.notifySoundVolume / 100,
    });
    const [content, setContent] = useState<JSX.Element | null>(null);
    const [record, setRecord] = useState<
        Record<string, { time: string; timeMS: string; score: number }>
    >({}); // Record of scores by timestamp
    const [score, setScore] = useState(0);
    const scoreRef = useRef<number>(score);
    const player = useRef<HTMLVideoElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
    const autoResetIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const scoreMinusRef = useRef<HTMLButtonElement>(null);
    const scorePlusRef = useRef<HTMLButtonElement>(null);
    const nextBtnRef = useRef<HTMLButtonElement>(null);
    bindEnterKey(nextBtnRef);

    const resetInactivityTimer = () => {
        clearResetInterval(autoResetIntervalRef);
        clearResetTimer(resetTimerRef);

        // 設定新的計時器
        resetTimerRef.current = setTimeout(() => {
            // 時間內未操作，開始自動重設分數
            console.log("Start auto reset score");
            notifySound(settings, playNotifySound);
            autoResetIntervalRef.current = setInterval(() => {
                console.log("Auto reset score");
                setScore((prevScore) => {
                    if (prevScore === 0) {
                        clearResetInterval(autoResetIntervalRef);
                        return prevScore;
                    }
                    const change = settings.resetUnit * (prevScore > 0 ? -1 : 1);
                    const newScore = prevScore + change;
                    if (prevScore * newScore < 0) {
                        // if resetting to a negative score, set to 0
                        return 0;
                    }
                    return scoreCorrection(settings, newScore);
                });
            }, settings.resetInterval);
        }, settings.resetTimeout);
    };

    // Handle keydown events
    const handleKeyDown = (e: KeyboardEvent) => {
        const timeout = 50;
        const allowedInputs: Record<string, any> = {
            v: async () => {
                scoreMinusRef.current?.focus();
                await sleep(timeout);
                scoreMinusRef.current?.click();
                await sleep(timeout);
                scoreMinusRef.current?.blur();
            },
            n: async () => {
                scorePlusRef.current?.focus();
                await sleep(timeout);
                scorePlusRef.current?.click();
                await sleep(timeout);
                scorePlusRef.current?.blur();
            },
        };
        if (e.key in allowedInputs) {
            e.preventDefault();
            allowedInputs[e.key]();
        }
    };
    const handleScoreChange = (e: any, type: string) => {
        e.preventDefault();
        setScore((prevScore) => {
            const change = type === "+" ? 1 : -1;
            const newScore = prevScore + change;
            return scoreCorrection(settings, newScore);
        });
        resetInactivityTimer();
    };
    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    useEffect(() => {
        scoreRef.current = score;
        console.log("Score changed:", score);
    }, [score]);

    // Rendering content sections
    const processContentRender = () => {
        // Check if required fields are present, then render initial content
        if (!checkRequiredFields(requiredFields, data)) {
            nav("/experiment", { replace: true });
        } else {
            setContent(renderContent(data, player, record, settings));
        }
    };
    useEffect(processContentRender, []); // Set the initial content
    useEffect(processContentRender, [record]); // Update content graph on record change

    // Update score record at regular intervals
    useEffect(() => {
        const video = player.current;
        if (!video) {
            return;
        }

        // 暫停時清除 interval
        const handlePause = () => {
            clearScoreSamplingInterval(intervalRef);
        };

        // 播放時重啟 interval
        const handlePlay = () => {
            clearScoreSamplingInterval(intervalRef); // 先清除，避免重複
            intervalRef.current = setInterval(() => {
                const currentTime = Math.trunc(video.currentTime * 1000);
                const videoDuration = Math.trunc(video.duration * 1000);
                updateRecord(currentTime, scoreRef.current, setRecord, settings);
                if (currentTime >= videoDuration) {
                    clearScoreSamplingInterval(intervalRef);
                }
            }, settings.updateInterval);
        };
        handlePlay();

        video.addEventListener("pause", handlePause);
        video.addEventListener("play", handlePlay);

        // Cleanup the interval on component unmount
        return () => {
            video.removeEventListener("pause", handlePause);
            video.removeEventListener("play", handlePlay);
            clearScoreSamplingInterval(intervalRef);
        };
    }, [player.current]);

    const isBidirectional = settings.isBidirectional;
    const maxScore = settings.maxScore;
    return (
        <div className="row col-12 flex-center gap-5">
            {content}
            <div className="row flex-center col-12 gap-3">
                <div className="d-flex flex-center col-12">
                    <ScoreBar {...{ score, maxScore, isBidirectional }} />
                </div>
                <div className="d-flex flex-center col-12 gap-3">
                    <button
                        ref={scoreMinusRef}
                        onClick={(e) => {
                            handleScoreChange(e, "-");
                        }}
                        className="btn btn-outline-danger btn-lg px-4"
                    >
                        －
                    </button>
                    <button
                        ref={scorePlusRef}
                        onClick={(e) => {
                            handleScoreChange(e, "+");
                        }}
                        className="btn btn-outline-success btn-lg px-4"
                    >
                        ＋
                    </button>
                </div>
            </div>
            <div className="d-flex flex-center gap-3">
                <button
                    className="btn btn-outline-primary btn-lg"
                    onClick={() =>
                        debounce(nextBtnRef, () => {
                            nextStep(
                                nav,
                                record,
                                updateData,
                                intervalRef,
                                autoResetIntervalRef,
                                resetTimerRef
                            )
                        })
                    }
                    ref={nextBtnRef}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
