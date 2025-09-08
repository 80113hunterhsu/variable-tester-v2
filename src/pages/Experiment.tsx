// node modules
import { Link } from "react-router-dom";

// components
import PageContainer from "../components/PageContainer";

// helpers
import { setSubtitle } from "../helpers/Title";

const links = [
    { title: "Experiment", to: "/experiment", active: true },
    { title: "Results", to: "/results" },
    { title: "Settings", to: "/settings" },
];
export default function Experiment() {
    setSubtitle("Experiment");
    return (
        <PageContainer navbarLinks={links}>
            <div className="d-flex flex-center flex-column gap-lg-4 gap-3">
                <h1 className="text-center">Experiment</h1>
                <div className="row">
                    <div className="d-flex flex-center gap-lg-4 gap-3 flex-lg-row flex-column">
                        <Link className="btn btn-outline-secondary btn-lg" to={"/settings"}>Settings</Link>
                        <Link className="btn btn-outline-primary btn-lg" to={"/experiment/step/1"}>Start</Link>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
