import { NextPage } from "next";
import { useTranslations } from "next-intl";
import { FormEvent } from "react";
import { Form, OverlayTrigger, Tooltip, Button, Spinner } from "react-bootstrap";

interface Props {
  handleUpload: (event: FormEvent<HTMLFormElement>) => void;
  setMaxChars: (maxChars: number) => void;
  maxChars: number;
  handleBackClick: () => void;
  setUploading: (uploading: boolean) => void;
  uploading: boolean;
}

const RecordingUploadForm: NextPage<Props> = ({ handleUpload, setMaxChars, maxChars, handleBackClick, setUploading, uploading }) => {
  const t = useTranslations("recording");

  return (
    <Form onSubmit={handleUpload} className="col-md-12 col-lg-10 col-xl-8">
      <div className="d-flex gap-4 flex-wrap">
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
          <Form.Text className="text-muted">
            {t("characters")}: {255 - maxChars}/255
          </Form.Text>
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
          <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /> {t("uploading")}
        </Button>
      )}
      <Button variant="light" className="mt-3 ms-2" onClick={handleBackClick}>
        {t("back")}
      </Button>
    </Form>
  );
};

export default RecordingUploadForm;
