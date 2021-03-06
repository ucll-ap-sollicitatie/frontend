import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { Button, Modal } from "react-bootstrap";
import Comment from "../../interfaces/Comment";

interface Props {
  comment: Comment | null;
  showDelete: boolean;
  handleClose: () => void;
  handleDeleteComment: () => void;
}

const DeleteCommentModal: NextPage<Props> = ({ comment, showDelete, handleClose, handleDeleteComment }) => {
  const t = useTranslations("videos");
  const m = useTranslations("modal");

  return (
    <Modal show={showDelete} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("comment_remove")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t("comment_remove_confirm")}
        <br />
        <br />
        {comment?.text}
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="danger" onClick={handleDeleteComment}>
          {m("delete")}
        </Button>
        <Button variant="outline-secondary" onClick={handleClose}>
          {m("close")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteCommentModal;
