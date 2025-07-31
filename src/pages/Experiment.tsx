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
            </div>
        </PageContainer>
    );
}
