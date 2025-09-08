// node modules
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

// helpers
import { generateElementKey, debounce } from "../../helpers/Element";
import { bindEnterKey } from "../../helpers/ExperimentStepsHelper";

const inputList: Array<{ title: string; id: string }> = [
    { title: "Subject name", id: "subjectName" },
    { title: "Variable name", id: "variableName" },
];

function nextStep(
    nav: any,
    data: { [key: string]: any },
    inputs: { [key: string]: HTMLInputElement }
) {
    // Check if subject name and variable name are provided
    let isChecked = true;
    inputList.forEach((input) => {
        if (!isChecked) {
            return;
        }
        const key = input.id;
        inputs[key].checkValidity();
        if (!inputs[key].checkValidity() || !data.hasOwnProperty(key)) {
            alert(`Please provide a ${input.title.toLowerCase()}.`);
            isChecked = false;
            return;
        }
    });

    // Navigate to the next step if all inputs are valid
    if (isChecked) {
        nav("/experiment/step/2");
    }
}

/**
 * Step 1: Enter test subject name and tested variable name
 */
export default function Step1({
    data,
    updateData,
}: {
    data: { [key: string]: any };
    updateData: (key: string, value: any) => void;
}) {
    const inputRefs = useRef<{ [key: string]: HTMLInputElement }>({});
    const nextBtnRef = useRef<HTMLButtonElement>(null);
    bindEnterKey(nextBtnRef);
    const nav = useNavigate();
    return (
        <div className="row col-8 flex-center gap-3">
            {inputList.map((input) => {
                return (
                    <div
                        className="row col-8 form-group"
                        key={generateElementKey(input.id)}
                    >
                        <label className="form-label" htmlFor={input.id}>
                            {input.title}
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id={input.id}
                            aria-describedby={input.id}
                            placeholder={input.title}
                            onChange={(e) => updateData(input.id, e.target.value)}
                            required
                            autoFocus={input.id === "subjectName"}
                            ref={(el) => {
                                if (el) {
                                    inputRefs.current[input.id] = el;
                                }
                            }}
                        />
                    </div>
                );
            })}
            <div className="d-flex flex-center">
                <button
                    className="btn btn-outline-primary btn-lg"
                    onClick={() =>
                        debounce(inputRefs, () => {
                            nextStep(nav, data, inputRefs.current);
                        })
                    }
                    ref={nextBtnRef}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
