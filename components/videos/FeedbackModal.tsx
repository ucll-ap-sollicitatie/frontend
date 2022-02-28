import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { FormEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import User from "../../interfaces/User";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

interface Props {
  maxChars: number;
  user: User;
  showFeedback: boolean;
  handleClose: () => void;
  handleAddFeedback: (event: FormEvent) => void;
  setMaxChars: Function;
}

const FeedbackModal: NextPage<Props> = ({ maxChars, user, showFeedback, handleClose, handleAddFeedback, setMaxChars }) => {
  const t = useTranslations("videos");
  const m = useTranslations("modal");

  return (
    <Modal show={showFeedback} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {t("feedback_to")} {user.name} {user.surname}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleAddFeedback} className="col-md-12 col-lg-10 col-xl-8">
          <div className="gap-4 flex-wrap">
            <Form.Group controlId="comment">
              <Form.Label>{t("feedback_form_label")}</Form.Label>
              <Form.Control
                onChange={(e) => setMaxChars(e.target.value.length)}
                maxLength={510}
                as="textarea"
                rows={3}
                placeholder="e.g. Goed gedaan, Maarten! Probeer wel op uw formeel taalgebruik te letten."
                required
              />
              <Form.Text className="text-muted">
                {t("characters")}: {510 - maxChars}/510
              </Form.Text>
            </Form.Group>
            <Button variant="success" type="submit" className="mt-3">
              {m("add")}
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

export default FeedbackModal;
