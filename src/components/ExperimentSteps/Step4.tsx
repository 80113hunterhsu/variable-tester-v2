// node modules
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

// helpers
import {
    checkRequiredFields,
    bindEnterKey,
} from "../../helpers/ExperimentStepsHelper";

function renderContent(data: { [key: string]: any }) {
    return (
        <video controls controlsList="nodownload" className="p-0 rounded-4">
            <source src={URL.createObjectURL(data.video)} type="video/mp4" />
        </video>
    );
}

/**
 * Step 4: Preview video and prepare for the start of the experiment
 */
export default function Step4({ data }: { data: { [key: string]: any } }) {
    const nav = useNavigate();
    const [content, setContent] = useState<JSX.Element | null>(null);
    const nextBtnRef = useRef<HTMLAnchorElement>(null);
    bindEnterKey(nextBtnRef);
    useEffect(() => {
        if (!checkRequiredFields(["settings", "subjectName", "variableName", "video"], data)) {
            nav("/experiment", { replace: true });
        } else {
            setContent(renderContent(data));
        }
    }, []);
    return (
        <div className="row col-8 flex-center gap-5">
            {content}
            <div className="d-flex flex-center gap-3">
                <Link
                    className="btn btn-outline-secondary btn-lg"
                    to={"/experiment/step/3"}
                >
                    Back
                </Link>
                <Link
                    className="btn btn-outline-primary btn-lg"
                    to={"/experiment/step/5"}
                    ref={nextBtnRef}
                >
                    Next
                </Link>
            </div>
        </div>
    );
}
