import type { NextPage } from "next";
import { Modal, Button, Form } from "react-bootstrap";
import User from "../../interfaces/User";

interface Props {
  maxChars: number;
  user: User;
  showFeedback: Function;
  handleClose: Function;
  handleAddFeedback: Function;
  setMaxChars: Function;
}

const FeedbackModal: NextPage<Props> = ({ maxChars, user, showFeedback, handleClose, handleAddFeedback, setMaxChars }) => {
  return (
    <Modal show={showFeedback} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          Feedback geven aan {user.name} {user.surname}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleAddFeedback} className="col-md-12 col-lg-10 col-xl-8">
          <div className="gap-4 flex-wrap">
            <Form.Group controlId="comment">
              <Form.Label>Gelieve uw feedback hieronder te typen</Form.Label>
              <Form.Control
                onChange={(e) => setMaxChars(e.target.value.length)}
                maxLength={510}
                as="textarea"
                rows={3}
                placeholder="e.g. Goed gedaan, Maarten! Probeer wel op uw formeel taalgebruik te letten."
                required
              />
              <Form.Text className="text-muted">Karakters: {510 - maxChars}/510</Form.Text>
            </Form.Group>
            <Button variant="success" type="submit" className="mt-3">
              Toevoegen
            </Button>
            <Button variant="outline-secondary" onClick={handleClose} className="mt-3 ms-2">
              Sluiten
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FeedbackModal;
