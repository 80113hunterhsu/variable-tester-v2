// components
import PageContainer from "../components/PageContainer";

// helpers
import { setSubtitle } from "../helpers/Title";

const links = [
    { title: "Experiment", to: "/experiment" },
    { title: "Results", to: "/results" },
    { title: "Settings", to: "/settings", active: true },
];
export default function Settings() {
    setSubtitle("Settings");
    return (
        <PageContainer navbarLinks={links}>
            <div className="d-flex flex-center flex-column gap-lg-4 gap-3">
                <h1 className="text-center">Settings</h1>
            </div>
        </PageContainer>
    );
}
