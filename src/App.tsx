import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Experiment from "./pages/Experiment";
import ExperimentSteps from "./pages/ExperimentSteps";
import Results from "./pages/Results";
import ResultsView from "./pages/ResultsView";
import Settings from "./pages/Settings";

import { logError } from "./helpers/Telemetry";

function App() {
    try {
        return (
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/experiment" element={<Experiment />} />
                    <Route path="/experiment/step/:step" element={<ExperimentSteps />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/results/:id/view" element={<ResultsView />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </HashRouter>
        );
    } catch (error) {
        logError(error);
        return (
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </HashRouter>
        );
    }
}

export default App;
