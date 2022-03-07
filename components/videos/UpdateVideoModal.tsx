import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { FormEvent } from "react";
import { Button, Form, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import User from "../../interfaces/User";
import Video from "../../interfaces/Video";

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
  showUpdateVideo: boolean;
  handleClose: () => void;
  handleUpdateVideo: (event: FormEvent) => void;
  setMaxChars: Function;
  video: Video;
  handleDeleteVideo: () => void;
}

const UpdateVideoModal: NextPage<Props> = ({ maxChars, user, showUpdateVideo, handleClose, handleUpdateVideo, setMaxChars, video, handleDeleteVideo }) => {
  const t = useTranslations("videos");
  const m = useTranslations("modal");
  const r = useTranslations("recording");
  const e = useTranslations("errors");

  return (
    <Modal show={showUpdateVideo} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("edit_video")}.</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpdateVideo}>
          <div className="gap-4 flex-wrap">
            <Form.Group controlId="file_title">
              <Form.Label>{r("recording_title")}</Form.Label>
              <Form.Control type="text" defaultValue={video.title} required />
              <Form.Text className="text-muted">{r("recording_error_title")}</Form.Text>
            </Form.Group>
          </div>
          <div className="gap-4 flex-wrap mt-2">
            <Form.Group controlId="description">
              <Form.Label>{r("recording_description")}</Form.Label>
              <Form.Control onChange={(e) => setMaxChars(e.target.value.length)} as="textarea" rows={4} maxLength={255} defaultValue={video.description} />
              <Form.Text className="text-muted">Karakters: {255 - maxChars}/255</Form.Text>
            </Form.Group>
          </div>
          <div className="d-flex gap-4 flex-wrap">
            <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">{r("recording_private")}</Tooltip>}>
              <Form.Group className="mb-3" controlId="privateCheckbox">
                <Form.Check type="checkbox" label={r("recording_private_radio")} defaultChecked={video.private} />
              </Form.Group>
            </OverlayTrigger>
          </div>
          <Button variant="success" type="submit" className="mt-3">
            {m("update")}
          </Button>
          <Button variant="outline-secondary" onClick={handleClose} className="mt-3 ms-2">
            {m("close")}
          </Button>
          <Button onClick={handleDeleteVideo} variant="danger" className="mt-3 ms-2">
            {m("delete")}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

{
  /* <div className="d-flex gap-4 flex-wrap">
<Form.Group controlId="file_title">
  <Form.Label>{t("recording_title")}</Form.Label>
  <Form.Control type="text" placeholder={t("title_example")} required />
  <Form.Text className="text-muted">{t("recording_error_title")}</Form.Text>
</Form.Group>
</div>
<div className="gap-4 flex-wrap mt-2">
<Form.Group controlId="description">
  <Form.Label>{t("recording_description")}</Form.Label>
  <Form.Control onChange={(e) => setMaxChars(e.target.value.length)} as="textarea" rows={4} maxLength={255} placeholder={t("recording_description")} />
  <Form.Text className="text-muted">Karakters: {255 - maxChars}/255</Form.Text>
</Form.Group>
</div>
<div className="d-flex gap-4 flex-wrap">
<OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">{t("recording_private")}</Tooltip>}>
  <Form.Group className="mb-3" controlId="privateCheckbox">
    <Form.Check type="checkbox" label={t("recording_private_radio")} defaultChecked />
  </Form.Group>
</OverlayTrigger>
</div>
{!uploading && (
<Button variant="primary" type="submit" className="mt-3">
  {t("upload")}
</Button>
)}
{uploading && (
<Button variant="primary" className="mt-3" disabled>
  <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
  {t("uploading")}
</Button>
)}
<Button variant="light" className="mt-3 ms-2" onClick={handleBackClick}>
{t("back")}
</Button> */
}

export default UpdateVideoModal;
