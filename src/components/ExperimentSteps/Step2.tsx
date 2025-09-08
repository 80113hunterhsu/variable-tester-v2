// node modules
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

// helpers
import { checkRequiredFields, bindEnterKey } from "../../helpers/ExperimentStepsHelper";

function renderContent(data: { [key: string]: any }) {
    return (
        <>
            <p className="fs-5">
                Hello, <strong>{data.subjectName}</strong>. Today, we will be testing
                for a level of <strong>{data.variableName}</strong>.
            </p>
            <p className="fs-5">
                When you feel the most of {data.variableName.toLowerCase()}, press the
                Increase button (or key N), which is marked with <code>+</code>.
                Alternately, when you are feeling less of{" "}
                {data.variableName.toLowerCase()}, press the Decrease button (or key V),
                marked with <code>-</code>.
            </p>
            <p className="fs-5">
                There will be an onscreen graphical representation of the level you are
                feeling, at the right side of the video. This bar will default to 0,
                over time. So, if you are feeling a lot of{" "}
                {data.variableName.toLowerCase()}, don't feel afraid to repeatedly hit
                the mouse, click like wild!
            </p>
        </>
    );
}

/**
 * Step 2: Show test information and instructions
 */
export default function Step2({ data }: { data: { [key: string]: any } }) {
    const nav = useNavigate();
    const [content, setContent] = useState<JSX.Element | null>(null);
    const nextBtnRef = useRef<HTMLAnchorElement>(null);
    bindEnterKey(nextBtnRef);
    useEffect(() => {
        if (!checkRequiredFields(["subjectName", "variableName"], data)) {
            nav("/experiment", { replace: true });
        } else {
            setContent(renderContent(data));
        }
    }, []);
    return (
        <div className="row col-8 flex-center gap-3">
            {content}
            <div className="d-flex flex-center gap-3">
                <Link
                    className="btn btn-outline-secondary btn-lg"
                    to={"/experiment/step/1"}
                >
                    Back
                </Link>
                <Link
                    to="/experiment/step/3"
                    className="btn btn-outline-primary btn-lg"
                    ref={nextBtnRef}
                >
                    Next
                </Link>
            </div>
        </div>
    );
}
