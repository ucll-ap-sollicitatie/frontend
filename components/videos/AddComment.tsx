import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { FormEvent } from "react";
import { Button, Form } from "react-bootstrap";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

interface Props {
  handleAddComment: (event: FormEvent) => void;
  setMaxChars: Function;
  maxChars: number;
}

const AddComment: NextPage<Props> = ({ handleAddComment, setMaxChars, maxChars }) => {
  const t = useTranslations("videos");

  return (
    <Form onSubmit={handleAddComment}>
      <Form.Group controlId="comment" className="flex-fill">
        <Form.Label>{t("add_comment")}</Form.Label>
        <div className="d-flex gap-3 flex-wrap flex-md-nowrap">
          <Form.Control onChange={(e) => setMaxChars(e.target.value.length)} maxLength={255} as="textarea" placeholder="Uw commentaar" required />
          <Button variant="primary" type="submit" className="input-group-addon">
            {t("comment_add")}
          </Button>
        </div>
      </Form.Group>
      <Form.Text className="text-muted">
        {t("characters")}: {255 - maxChars}/255
      </Form.Text>
    </Form>
  );
};

export default AddComment;
