import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { FormEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Comment from "../../interfaces/Comment";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../public/locales/${locale}.json`)).default,
    },
  };
}

interface Props {
  comment: Comment | null;
  maxChars: number;
  showUpdate: boolean;
  handleClose: () => void;
  handleUpdateComment: (event: FormEvent) => void;
  setMaxChars: Function;
}

const UpdateCommentModal: NextPage<Props> = ({ comment, maxChars, showUpdate, handleClose, handleUpdateComment, setMaxChars }) => {
  const t = useTranslations("videos");
  const m = useTranslations("modal");

  return (
    <Modal show={showUpdate} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("update_comment")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpdateComment} className="col-md-12 col-lg-10 col-xl-8">
          <div className="gap-4 flex-wrap">
            <Form.Group controlId="comment">
              <Form.Label>{t("update_comment")}</Form.Label>
              <Form.Control onChange={(e) => setMaxChars(e.target.value.length)} maxLength={255} as="textarea" placeholder={comment?.text} required />
              <Form.Text className="text-muted">Karakters: {255 - maxChars}/255</Form.Text>
            </Form.Group>
            <Button variant="success" type="submit" className="mt-3">
              {m("update")}
            </Button>
            <Button variant="outline-secondary" onClick={handleClose} className="mt-3 ms-2">
              {m("close")}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateCommentModal;
