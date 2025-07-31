// components
import PageContainer from "../components/PageContainer";

// helpers
import { setSubtitle } from "../helpers/Title";

const links = [
    { title: "Experiment", to: "/experiment" },
    { title: "Results", to: "/results", active: true },
    { title: "Settings", to: "/settings" },
];
export default function Results() {
    setSubtitle("Results");
    return (
        <PageContainer navbarLinks={links}>
            <div className="d-flex flex-center flex-column gap-lg-4 gap-3">
                <h1 className="text-center">Results</h1>
            </div>
        </PageContainer>
    );
}
