// components
import PageContainer from "../components/PageContainer";

// helpers
import { setSubtitle } from "../helpers/Title";

const links = [
    { title: "開始實驗", to: "/experiment" },
    { title: "實驗結果", to: "/results" },
    { title: "參數設定", to: "/settings", active: true },
];
export default function Settings() {
    setSubtitle("參數設定");
    return (
        <PageContainer navbarLinks={links}>
            <div className="d-flex flex-center flex-column gap-lg-2 gap-3">
                <h1 className="text-center">Settings</h1>
            </div>
        </PageContainer>
    );
}
