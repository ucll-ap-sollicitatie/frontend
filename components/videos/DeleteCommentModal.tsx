import type { NextPage } from "next";
import { Modal, Button } from "react-bootstrap";
import { Comment } from "../../interfaces/Comment";

interface Props {
  comment: Comment;
  showDelete: Function;
  handleClose: Function;
  handleDeleteComment: Function;
}

const DeleteCommentModal: NextPage<Props> = ({ comment, showDelete, handleClose, handleDeleteComment }) => {
  return (
    <Modal show={showDelete} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Commentaar verwijderen</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Bent u zeker dat u dit commentaar wilt verwijderen?
        <br />
        <br />
        {`"${comment.text}"`}
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="danger" onClick={handleDeleteComment}>
          Verwijderen
        </Button>
        <Button variant="outline-secondary" onClick={handleClose}>
          Sluiten
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteCommentModal;
