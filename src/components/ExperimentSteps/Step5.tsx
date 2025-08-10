// node modules
import { Link } from "react-router-dom";

export default function Step5() {
    return (
        <>
            Step 5
            <Link className="btn btn-outline-primary btn-lg" to={"/experiment/step/6"}>Next</Link>
        </>
    );
}
