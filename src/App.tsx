import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Experiment from "./pages/Experiment";
import Results from "./pages/Results";
import Settings from "./pages/Settings";

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/experiment" element={<Experiment />} />
                <Route path="/results" element={<Results />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </HashRouter>
    );
}

export default App;
