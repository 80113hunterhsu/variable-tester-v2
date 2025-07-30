// components
import PageContainer from "../components/PageContainer";

// helpers
import { setSubtitle } from "../helpers/Title";

const links = [
    { title: "開始實驗", to: "/experiment" },
    { title: "實驗結果", to: "/results", active: true },
    { title: "參數設定", to: "/settings" },
];
export default function Results() {
    setSubtitle("實驗結果");
    return (
        <PageContainer navbarLinks={links}>
            <div className="d-flex flex-center flex-column gap-lg-2 gap-3">
                <h1 className="text-center">Results</h1>
            </div>
        </PageContainer>
    );
}
