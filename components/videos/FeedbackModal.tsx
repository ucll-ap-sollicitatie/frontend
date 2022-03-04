import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { FormEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import User from "../../interfaces/User";

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
        <Form onSubmit={handleAddFeedback}>
          <div className="gap-4 flex-wrap">
            <Form.Group controlId="comment">
              <Form.Label>
                {t("feedback_form_label")} <br /> {t("feedback_privacy")}
              </Form.Label>
              <Form.Control
                onChange={(e) => setMaxChars(e.target.value.length)}
                maxLength={510}
                as="textarea"
                rows={3}
                placeholder={t("feedback_placeholder")}
                required
              />
              <Form.Text className="text-muted">
                {t("characters")}: {510 - maxChars}/510
              </Form.Text>
            </Form.Group>
            <div className="d-flex mt-2 gap-5">
              <Form.Group controlId="van">
                <Form.Label>{t("from")}</Form.Label>
                <div className="d-flex gap-1">
                  <Form.Control
                    onChange={(e) => setMaxChars(e.target.value.length)}
                    maxLength={510}
                    type="number"
                    max={10}
                    min={0}
                    placeholder="Min"
                    required
                  />
                  <Form.Control
                    onChange={(e) => setMaxChars(e.target.value.length)}
                    maxLength={510}
                    type="number"
                    max={59}
                    min={0}
                    placeholder="Sec"
                    required
                  />
                </div>
              </Form.Group>
              <Form.Group controlId="tot">
                <Form.Label>{t("to")}</Form.Label>
                <div className="d-flex gap-1">
                  <Form.Control
                    onChange={(e) => setMaxChars(e.target.value.length)}
                    maxLength={510}
                    type="number"
                    max={10}
                    min={0}
                    placeholder="Min"
                    required
                  />
                  <Form.Control
                    onChange={(e) => setMaxChars(e.target.value.length)}
                    maxLength={510}
                    type="number"
                    max={59}
                    min={0}
                    placeholder="Sec"
                    required
                  />
                </div>
              </Form.Group>
            </div>
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
