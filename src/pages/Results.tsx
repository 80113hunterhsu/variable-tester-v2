// node modules
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// components
import PageContainer from "../components/PageContainer";

// helpers
import { setSubtitle } from "../helpers/Title";

// styles
import "./Results.css";

function renderContent(
    experiments: Record<string, any>,
    nav: (path: string) => void,
    search: string = ""
) {
    const keyword = search.trim().toLowerCase();
    return Object.entries(experiments)
        .filter(([id, experiment]) => {
            if (!keyword) {
                return true;
            }
            return (
                id.toLowerCase().includes(keyword) ||
                experiment.subject_name?.toLowerCase().includes(keyword) ||
                experiment.variable_name?.toLowerCase().includes(keyword) ||
                new Date(`${experiment.created_at.replace(" ", "T")}Z`)
                    .toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
                    .toLowerCase()
                    .includes(keyword)
            );
        })
        .map(([id, experiment]) => (
            <tr
                key={id}
                className="results-row"
                onClick={() => nav(`/results/${id}/view`)}
            >
                <td>
                    {new Date(
                        `${experiment.created_at.replace(" ", "T")}Z`
                    ).toLocaleString("zh-TW", { timeZone: "Asia/Taipei", hour12: false })}
                </td>
                <td>{experiment.subject_name}</td>
                <td>{experiment.variable_name}</td>
                <td>
                    <div className="d-flex col-12 justify-content-end">
                        <i className="bi bi-chevron-right"></i>
                    </div>
                </td>
            </tr>
        ));
}

const links = [
    { title: "Experiment", to: "/experiment" },
    { title: "Results", to: "/results", active: true },
    { title: "Settings", to: "/settings" },
];
export default function Results() {
    setSubtitle("Results");

    const [content, setContent] = useState<JSX.Element[] | null>(null);
    const [experiments, setExperiments] = useState<Record<string, any>>({});
    const [search, setSearch] = useState(""); // 新增搜尋 state
    const nav = useNavigate();
    useEffect(() => {
        (async () => {
            const results = await window.db.experiments.list();
            setExperiments(results);
        })();
    }, []);
    useEffect(() => {
        setContent(renderContent(experiments, nav, search)); // 傳入 search
    }, [experiments, nav, search]);

    return (
        <PageContainer navbarLinks={links} centered={false}>
            <div className="d-flex flex-center flex-column gap-lg-4 gap-3 col-12">
                <h1 className="text-center">Results</h1>
                <input
                    type="text"
                    className="form-control mb-3 col-6"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ maxWidth: "400px" }}
                />
                <div className="table-responsive col-12">
                    <table
                        className="table table-hover table-striped col-12"
                        style={{ borderWidth: "1px" }}
                    >
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Subject</th>
                                <th>Variable</th>
                                <th className="col-1"></th>
                            </tr>
                        </thead>
                        <tbody className="table-group-divider">{content}</tbody>
                    </table>
                </div>
            </div>
        </PageContainer>
    );
}
