// styles
import "./ScoreBar.css";

/**
 * ScoreBar: 目前分數顯示條
 * @deprecated 請改用 ScoreBtn 元件
 */
export default function ScoreBar({
    score,
    maxScore,
    isBidirectional,
}: {
    score: number;
    maxScore: number;
    isBidirectional: boolean;
}) {
    // 雙向分數條：0 在中間，分數條向左或向右延伸
    // 單向分數條：0 在最左邊，分數條向右延伸
    let percent = 0;
    let barLeft = "50%";
    let barWidth = "0%";
    let barColor = "#6cf";
    const minBarWidth = 50; // 最小寬度(px)

    if (isBidirectional) {
        percent = (Math.abs(score) / maxScore) * 50;
        // 0 分時顯示最小寬度
        barWidth = score === 0 ? `${minBarWidth}px` : `calc(${percent}% + ${minBarWidth/2}px)`;
        if (score > 0) {
            barLeft = `calc(50% - ${minBarWidth / 2}px)`;
            barColor = "#6c6";
        } else if (score < 0) {
            barLeft = `calc(50% - ${percent}%)`;
            barColor = "#f66";
        } else {
            barLeft = `calc(50% - ${minBarWidth / 2}px)`;
        }
    } else {
        percent = (score / maxScore) * 100;
        barWidth = score === 0 ? `${minBarWidth}px` : `calc(${percent}%)`;
        barLeft = "0";
        barColor = "#6cf";
    }

    return (
        <div id="score_bar-wrapper">
            {/* 目前分數 */}
            <div id="score_bar-current_score" className="text-black">
                {isBidirectional && score > 0 ? "+" : ""}{score}
            </div>
            {/* 分數條本體 */}
            <div id="score_bar-indicator">
                {/* 分數條 */}
                <div
                    id="score_bar-bar"
                    style={{
                        left: barLeft,
                        width: barWidth,
                        background: barColor,
                    }}
                />
                {/* 標記 */}
                <div
                    id="score_bar-marker-left"
                    className="score_bar-marker"
                    style={{
                        left: "0",
                    }}
                >
                    {isBidirectional ? -maxScore : 0}
                </div>
                {isBidirectional && (
                    <div
                        id="score_bar-marker-center"
                        className="score_bar-marker"
                        style={{
                            left: "50%",
                            transform: "translateX(-50%)",
                        }}
                    >
                        0
                    </div>
                )}
                <div
                    id="score_bar-marker-right"
                    className="score_bar-marker"
                    style={{
                        right: "0",
                    }}
                >
                    {maxScore}
                </div>
            </div>
        </div>
    );
}
