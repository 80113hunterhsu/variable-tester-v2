// node modules
import { useState, useRef, useEffect, RefObject } from "react";
import { Link, useNavigate } from "react-router-dom";

// helpers
import {
    checkRequiredFields,
    bindEnterKey,
} from "../../helpers/ExperimentStepsHelper";
import { debounce } from "../../helpers/Element";

// styles
import "./Step3.css";

function renderContent(data: { [key: string]: any }) {
    return (
        <div className="d-flex flex-center flex-column">
            <h4>Name: {data.subjectName}</h4>
            <h4>Variable: {data.variableName}</h4>
        </div>
    );
}

function handleFileChange(
    e: any,
    updateData: (key: string, value: any) => void,
    dropZoneText: RefObject<HTMLInputElement>
) {
    const file = e.target.files[0];
    if (!file) {
        return;
    }
    updateData("video", file);
    if (dropZoneText.current) {
        dropZoneText.current.textContent = file.name;
    }
}

function nextStep(nav: any, data: { [key: string]: any }) {
    if (!data.hasOwnProperty("video")) {
        alert("Please provide a video file.");
        return;
    }
    nav("/experiment/step/4");
}

/**
 * Step 3: Select video file
 */
export default function Step3({
    data,
    updateData,
}: {
    data: { [key: string]: any };
    updateData: (key: string, value: any) => void;
}) {
    const nav = useNavigate();
    const [content, setContent] = useState<JSX.Element | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const dropZoneRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneText = useRef<HTMLInputElement>(null);
    const nextBtnRef = useRef<HTMLButtonElement>(null);
    bindEnterKey(nextBtnRef);

    useEffect(() => {
        if (!checkRequiredFields(["settings", "subjectName", "variableName"], data)) {
            nav("/experiment", { replace: true });
        } else {
            setContent(renderContent(data));
        }

        const dropZone = dropZoneRef.current;
        const fileInput = fileInputRef.current;
        if (!dropZone || !fileInput) {
            return;
        }

        const handleDragOver = (e: any) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
        };

        const handleDrop = (e: any) => {
            e.preventDefault();
            setIsDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("video/mp4")) {
                // Simulate selecting the file in the input element
                const dt = new DataTransfer();
                dt.items.add(file);
                fileInput.files = dt.files;

                // Trigger change event manually so onChange handlers fire
                const changeEvent = new Event("change", { bubbles: true });
                fileInput.dispatchEvent(changeEvent);
            } else {
                alert("Please drop a valid mp4 video file");
            }
        };

        dropZone.addEventListener("dragover", handleDragOver);
        dropZone.addEventListener("drop", handleDrop);

        return () => {
            dropZone.removeEventListener("dragover", handleDragOver);
            dropZone.removeEventListener("drop", handleDrop);
        };
    }, []);

    return (
        <div className="row col-8 flex-center gap-5">
            {content}
            <div
                ref={dropZoneRef}
                className={`drop-zone ${isDragOver ? "drag-over" : ""}`}
                onClick={() => fileInputRef?.current?.click()}
                onDragEnter={() => setIsDragOver(true)}
                onDragLeave={() => setIsDragOver(false)}
                autoFocus={true}
            >
                <span ref={dropZoneText}>Click or drag an MP4 video here</span>
                <input
                    type="file"
                    accept="video/mp4"
                    ref={fileInputRef}
                    className="hider"
                    onChange={(e) => handleFileChange(e, updateData, dropZoneText)}
                />
            </div>
            <div className="d-flex flex-center gap-3">
                <Link
                    className="btn btn-outline-secondary btn-lg"
                    to={"/experiment/step/2"}
                >
                    Back
                </Link>
                <button
                    className="btn btn-outline-primary btn-lg"
                    onClick={() =>
                        debounce(nextBtnRef, () => {
                            nextStep(nav, data);
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
