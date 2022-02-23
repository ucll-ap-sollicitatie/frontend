import type { NextPage } from "next";
import { Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import CommentList from "./CommentList";

interface Props {
  handleAddComment: Function;
  setMaxChars: Function;
  maxChars: number;
}

const AddComment: NextPage<Props> = ({ handleAddComment, setMaxChars, maxChars }) => {
  return (
    <Form onSubmit={handleAddComment}>
      <div className="gap-4 flex-wrap">
        <Form.Label>Commentaar toevoegen</Form.Label>
        <Form.Group controlId="comment" className="d-flex">
          <Form.Control
            className="me-2"
            onChange={(e) => setMaxChars(e.target.value.length)}
            maxLength={255}
            as="textarea"
            placeholder="e.g. Wow wat een coole video!"
            required
          />
          <Button variant="primary" type="submit" className="input-group-addon">
            Voeg commentaar toe
          </Button>
        </Form.Group>
        <Form.Text className="text-muted">Karakters: {255 - maxChars}/255</Form.Text>
      </div>
    </Form>
  );
};

export default AddComment;
