// components
import PageContainer from "../components/PageContainer";

// helpers
import { setSubtitle } from "../helpers/Title";

const links = [
    { title: "開始實驗", to: "/experiment", active: true },
    { title: "實驗結果", to: "/results" },
    { title: "參數設定", to: "/settings" },
];
export default function Experiment() {
    setSubtitle("開始實驗");
    return (
        <PageContainer navbarLinks={links}>
            <div className="d-flex flex-center flex-column gap-lg-2 gap-3">
                <h1 className="text-center">Experiment</h1>
            </div>
        </PageContainer>
    );
}
