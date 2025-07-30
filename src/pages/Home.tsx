// node modules
import { Link } from "react-router-dom";

// components
import PageContainer from "../components/PageContainer";

// helpers
import { setSubtitle } from "../helpers/Title";
import { generateElementKey } from "../helpers/Element";
const links = [
    { title: "開始實驗", to: "/experiment" },
    { title: "實驗結果", to: "/results" },
    { title: "參數設定", to: "/settings" },
];
export default function Home() {
    setSubtitle("首頁");
    return (
        <PageContainer navbarLinks={links}>
            <div className="d-flex flex-center flex-column gap-lg-2 gap-3">
                <h1 className="text-center">Variable Tester</h1>
                <div className="row">
                    <div className="d-flex flex-center gap-lg-4 gap-3 flex-lg-row flex-column">
                        {links.map((link) => {
                            return (
                                <Link key={generateElementKey(`Home-${link.to}-${link.title}`)} className="btn btn-outline-primary btn-lg" to={link.to}>{link.title}</Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
