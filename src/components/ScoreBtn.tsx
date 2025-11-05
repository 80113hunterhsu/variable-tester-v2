// node_modules
import { useRef, useEffect } from "react";

// helpers
import { sleep } from "../helpers/Sleep";

// styles
import "./ScoreBtn.css";

export default function ScoreBtn({
    score,
    maxScore,
    isBidirectional,
    handleDirectSetScore,
}: {
    score: number;
    maxScore: number;
    isBidirectional: boolean;
    handleDirectSetScore: (score: number) => void;
}) {
    // 雙向分數條：0 在中間，分數條向左或向右延伸
    // 單向分數條：0 在最左邊，分數條向右延伸
    const scores: number[] = [];
    const start = isBidirectional ? -maxScore : 0;
    const end = maxScore;
    for (let i = start; i <= end; i++) {
        scores.push(i);
    }

    const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const scrollToCenter = (current: number) => {
        const idx = scores.findIndex(s => s === current);
        if (btnRefs.current[idx]) {
            btnRefs.current[idx]?.scrollIntoView({
                behavior: "auto",
                block: "nearest",
                inline: "center",
            });
        }
    };
    useEffect(() => {
        scrollToCenter(0)
    }, []);
    return (
        <div id="scoreBtn_wrapper">
            {/* Left gradient */}
            <div id="scoreBtn_leftGradient" />
            {/* Right gradient */}
            <div id="scoreBtn_rightGradient" />
            <div id="scoreBtn_scollWrapper" className="px-5">
                <div id="scoreBtn_btnWrapper" className="d-flex flex-center gap-3">
                    {scores.map((s, idx) => {
                        return (
                            <button
                                key={s}
                                ref={el => btnRefs.current[idx] = el}
                                className={`scrollBtn_btn btn btn-${s === score ? "primary" : "outline-secondary"} btn-lg px-4 d-flex flex-center col-auto`}
                                onClick={async () => {
                                    handleDirectSetScore(s);
                                    // 點擊後滾動到按鈕中央
                                    await sleep(1);
                                    scrollToCenter(s);
                                }}
                            >
                                {`${s < 0 ? '' : " "}${s}`}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}