import type { NextPage } from "next";
import { Modal, Button, Form } from "react-bootstrap";
import Comment from "../../interfaces/Comment";

interface Props {
  comment: Comment;
  maxChars: number;
  showUpdate: Function;
  handleClose: Function;
  handleUpdateComment: Function;
  setMaxChars: Function;
}

const UpdateCommentModal: NextPage<Props> = ({ comment, maxChars, showUpdate, handleClose, handleUpdateComment, setMaxChars }) => {
  return (
    <Modal show={showUpdate} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Commentaar bijwerken</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpdateComment} className="col-md-12 col-lg-10 col-xl-8">
          <div className="gap-4 flex-wrap">
            <Form.Group controlId="comment">
              <Form.Label>Commentaar bijwerken</Form.Label>
              <Form.Control
                onChange={(e) => setMaxChars(e.target.value.length)}
                maxLength={255}
                as="textarea"
                placeholder={comment.text}
                required
              />
              <Form.Text className="text-muted">Karakters: {255 - maxChars}/255</Form.Text>
            </Form.Group>
            <Button variant="success" type="submit" className="mt-3">
              Bijwerken
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

export default UpdateCommentModal;
