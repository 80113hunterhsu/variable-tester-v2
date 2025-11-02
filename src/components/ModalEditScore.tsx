// node modules
import { Modal, Button, Form } from "react-bootstrap";

export default function ModalEditScore({
    showModal,
    handleHide,
    newScore,
    setNewScore,
    handleSave,
    isBidirectional,
    maxScore,
    record,
    selectedTime
}: {
    showModal: boolean;
    handleHide: () => void;
    newScore: number;
    setNewScore: (score: number) => void;
    handleSave: () => void;
    isBidirectional: boolean;
    maxScore: number;
    record: Record<string, { time: string; timeMS: string; score: number }>;
    selectedTime: string|null;
}) {
    const minScore = isBidirectional ? -maxScore : 0;
    const timeMS = selectedTime && record[selectedTime].timeMS && record[selectedTime].timeMS;
    return (
        <Modal show={showModal} onHide={handleHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Score on {timeMS}</Modal.Title>
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
                <Button variant="primary" onClick={handleSave}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}