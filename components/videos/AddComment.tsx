import type { NextPage } from "next";
import { FormEvent } from "react";
import { Button, Form } from "react-bootstrap";

interface Props {
  handleAddComment: (event: FormEvent) => void;
  setMaxChars: Function;
  maxChars: number;
}

const AddComment: NextPage<Props> = ({ handleAddComment, setMaxChars, maxChars }) => {
  return (
    <Form onSubmit={handleAddComment}>
      <Form.Group controlId="comment" className="flex-fill">
        <Form.Label>Commentaar toevoegen</Form.Label>
        <div className="d-flex gap-3 flex-wrap flex-md-nowrap">
          <Form.Control onChange={(e) => setMaxChars(e.target.value.length)} maxLength={255} as="textarea" placeholder="Uw commentaar" required />
          <Button variant="primary" type="submit" className="input-group-addon">
            Voeg commentaar toe
          </Button>
        </div>
      </Form.Group>
      <Form.Text className="text-muted">Karakters: {255 - maxChars}/255</Form.Text>
    </Form>
  );
};

export default AddComment;
