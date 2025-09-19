// node modules
import { useState, useEffect, useRef, RefObject } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dropdown, DropdownButton, ButtonGroup } from "react-bootstrap";

// components
import PageContainer from "../components/PageContainer";
import RecordChart from "../components/RecordChart";
import SettingsTable from "../components/SettingsTable";

// helpers
import { setSubtitle } from "../helpers/Title";

// styles
import "./ResultsView.css";
import { generateElementKey } from "../helpers/Element";
import { svgToCanvas } from "../helpers/SvgToCanvas";

function renderExperimentDetails(experiment: Record<string, any>, nav: any) {
    const handleDelete = (e: any) => {
        e.preventDefault();
        window.db.experiments.delete(experiment.id);
        nav("/results");
    };
    const styles = {
        verticalAlign: "middle",
    };
    return (
        <table className="table table-hover table-bordered">
            <tbody>
                <tr>
                    <th className="text-center" style={styles}>Subject Name</th>
                    <td className="px-3" style={styles}>{experiment.subject_name}</td>
                </tr>
                <tr>
                    <th className="text-center" style={styles}>Variable Name</th>
                    <td className="px-3" style={styles}>{experiment.variable_name}</td>
                </tr>
                <tr>
                    <th className="text-center" style={styles}>Experiment Date</th>
                    <td className="px-3" style={styles}>
                        {new Date(
                            `${experiment.created_at.replace(" ", "T")}Z`
                        ).toLocaleString("zh-TW", {
                            timeZone: "Asia/Taipei",
                            hour12: false,
                        })}
                    </td>
                </tr>
                <tr>
                    <th className="text-center style={styles}">Video Name</th>
                    <td className="px-3 style={styles}">{experiment.video_name}</td>
                </tr>
                <tr>
                    <th className="text-center" style={styles}>Actions</th>
                    <td className="px-3 style={styles}">
                        <div className="d-flex gap-3">
                            <button className="btn btn-outline-danger" onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

function renderChart(
    experiment: Record<string, any>,
    refChart: RefObject<SVGSVGElement>,
    setBrushRange: (brushRange: any) => void
) {
    return (
        <RecordChart
            {...{
                record: experiment.record,
                isBidirectional: experiment.settings.isBidirectional,
                maxScore: experiment.settings.maxScore,
                refChart: refChart,
                setBrushRange: setBrushRange,
            }}
        />
    );
}

function renderSettingsTable(settings: Record<string, any>) {
    return <SettingsTable {...{ settings }} />;
}

function getRecordsInRange(record: Record<number, any>, brushRange: {start?: number, end?: number}) {
    const recordsInRange: Record<number, any> = {};
    Object.entries(record).forEach(([key, value]) => {
        const index = Number(key);
        if (index >= (brushRange.start || 0) && index <= (brushRange.end || (Object.keys(record).length - 1))) {
            recordsInRange[index] = value;
        }
    });
    return recordsInRange;
}

function triggerMessage(refMessage: RefObject<HTMLElement>, text: string) {
    const message = refMessage.current;
    if (!message) return;
    message.textContent = text;
    message.classList.add("show");
    setTimeout(() => {
        message.classList.remove("show");
    }, 2000);
}

const links = [
    { title: "Experiment", to: "/experiment" },
    { title: "Results", to: "/results", active: true },
    { title: "Settings", to: "/settings" },
];
const supportedImageFormatMap: Record<string, string> = {
    PNG: "image/png",
    JPG: "image/jpeg",
};
export default function ResultsView() {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();
    const refChart = useRef<SVGSVGElement | null>(null);
    const refMessage = useRef<HTMLParagraphElement | null>(null);
    const [brushRange, setBrushRange] = useState<{
        start?: number;
        end?: number;
    }>({start: 0, end: 0});
    useEffect(() => console.log("brushRange: ", brushRange), [brushRange]);
    const [experiment, setExperiments] = useState<Record<string, any>>({});
    const [title, setTitle] = useState("View Results");
    const [experimentDetails, setExperimentDetails] =
        useState<JSX.Element | null>(<></>);
    const [chart, setChart] = useState<JSX.Element | null>(<></>);
    const [settingsTable, setSettingsTable] = useState<JSX.Element | null>(<></>);
    useEffect(() => {
        const experimentId = Number(id);
        (async () => {
            const results = await window.db.experiments.get(experimentId);
            setExperiments(results);
        })();
    }, [id]);
    useEffect(() => {
        console.log("experiment: ", experiment);
        setTitle(
            `View Results - ${experiment.subject_name}: ${experiment.variable_name}`
        );
        setSubtitle(
            `View Results - ${experiment.subject_name}: ${experiment.variable_name}`
        );
        if (Object.keys(experiment).length === 0) {
            return;
        }
        setExperimentDetails(renderExperimentDetails(experiment, nav));
        setBrushRange({start: 0, end: Object.keys(experiment.record || {}).length - 1});
        setChart(renderChart(experiment, refChart, setBrushRange));
        setSettingsTable(renderSettingsTable(experiment.settings));
    }, [experiment]);
    const handleBack = (e: any) => {
        e.preventDefault();
        nav("/results");
    };
    const handleExportCSV = async (e: any) => {
        e.preventDefault();
        if (!experiment.record) {
            alert("Unexpected error, please try again.");
            return;
        }
        const result = await window.export.csv(
            `${experiment.subject_name} - ${experiment.variable_name}`,
            getRecordsInRange(experiment.record, brushRange)
        );
        if (result.success) {
            triggerMessage(refMessage, "CSV saved.");
        }
    };
    const handleExportImage = async (e: any, type: string, mimeType: string) => {
        e.preventDefault();
        if (!refChart.current) {
            alert("Unexpected error, please try again.");
            return;
        }

        const canvas = await svgToCanvas(refChart.current, type);
        const result = await window.export.image(
            `${experiment.subject_name} - ${experiment.variable_name}`,
            canvas.toDataURL(mimeType),
            type.toLowerCase()
        );
        if (result.success) {
            triggerMessage(refMessage, "Image saved.");
        }
    };
    return (
        <PageContainer navbarLinks={links} centered={false}>
            <button
                id="back"
                className="btn btn-outline-secondary"
                onClick={handleBack}
            >
                <i className="bi bi-chevron-left"></i>
            </button>
            <div className="row flex-center gap-lg-4 gap-3 col-12">
                <h1 className="text-center">{title}</h1>
                <div className="col-12 d-flex flex-center flex-column gap-3">
                    <h2>Experiment Details</h2>
                    <div className="table-responsive col-11">{experimentDetails}</div>
                </div>
                <hr />
                <div className="col-12 d-flex flex-center flex-column gap-3">
                    <h2>Score Chart</h2>
                    <div className="col-12 d-flex flex-center">{chart}</div>
                    <div className="col-12 d-flex flex-center gap-3">
                        <button
                            className="btn btn-outline-primary"
                            onClick={handleExportCSV}
                        >
                            Export as CSV
                        </button>
                        <DropdownButton
                            as={ButtonGroup}
                            drop="end"
                            variant="outline-primary"
                            title="Export as Image "
                        >
                            {Object.entries(supportedImageFormatMap).map(
                                ([type, mimeType]) => {
                                    return (
                                        <Dropdown.Item
                                            key={generateElementKey(type)}
                                            onClick={(e) => handleExportImage(e, type, mimeType)}
                                        >
                                            {type}
                                        </Dropdown.Item>
                                    );
                                }
                            )}
                        </DropdownButton>
                    </div>
                    <p id="message" ref={refMessage}>
                        Saved.
                    </p>
                </div>
                <hr />
                <div className="col-12 d-flex flex-center flex-column gap-3">
                    <h2 className="mb-0">Experiment Settings</h2>
                    <p>
                        Below are the configurations that were used for this experiment.
                    </p>
                    <div className="table-responsive col-11">{settingsTable}</div>
                </div>
            </div>
        </PageContainer>
    );
}
