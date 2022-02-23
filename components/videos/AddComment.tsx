import type { NextPage } from "next";
import { Button, Form } from "react-bootstrap";
import CommentList from "./CommentList";

interface Props {
  handleAddComment: Function;
  setMaxChars: Function;
  maxChars: number;
}

const AddComment: NextPage<Props> = ({ handleAddComment, setMaxChars, maxChars }) => {
  return (
    <Form onSubmit={handleAddComment} className="col-md-12 col-lg-10 col-xl-8s">
      <div className="gap-4 flex-wrap">
        <Form.Group controlId="comment">
          <Form.Label>Commentaar toevoegen</Form.Label>
          <Form.Control
            onChange={(e) => setMaxChars(e.target.value.length)}
            maxLength={255}
            as="textarea"
            placeholder="e.g. Wow wat een coole video!"
            required
          />
          <Form.Text className="text-muted">Karakters: {255 - maxChars}/255</Form.Text>
        </Form.Group>
      </div>
      <Button variant="primary" type="submit" className="mt-3">
        Voeg commentaar toe
      </Button>
    </Form>
  );
};

export default AddComment;
