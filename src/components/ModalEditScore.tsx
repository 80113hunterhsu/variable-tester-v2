// node modules
import { useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";

// helpers
import { bindEnterKey } from "../helpers/ExperimentStepsHelper";

export default function ModalEditScore({
    showModal,
    handleHide,
    newScore,
    setNewScore,
    handleSave,
    isBidirectional,
    maxScore,
}: {
    showModal: boolean;
    handleHide: () => void;
    newScore: number;
    setNewScore: (score: number) => void;
    handleSave: () => void;
    isBidirectional: boolean;
    maxScore: number;
}) {
    const saveBtnRef = useRef<HTMLButtonElement>(null);
    bindEnterKey(saveBtnRef);
    const minScore = isBidirectional ? -maxScore : 0;
    return (
        <Modal show={showModal} onHide={handleHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Score</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Score Value</Form.Label>
                        <Form.Control
                            type="number"
                            value={newScore}
                            onChange={(e) => {
                                const score = Number(e.target.value);
                                if (score >= minScore && score <= maxScore) {
                                    setNewScore(score);
                                } else {
                                    e.target.value = String(newScore); // revert to last valid value
                                }
                            }}
                            autoFocus
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave} ref={saveBtnRef}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}