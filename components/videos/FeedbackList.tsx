import type { NextPage } from "next";
import { Button, Card, Nav } from "react-bootstrap";
import { timeSince } from "../../helpers/helperFunctions";
import Comment from "../../interfaces/Comment";
import User from "../../interfaces/User";
import Video from "../../interfaces/Video";

interface Props {
  feedback: Comment[];
  user: User;
  video: Video;
  handleSelect: Function;
  handleShowUpdate: Function;
  handleShowDelete: Function;
}

const FeedbackList: NextPage<Props> = ({ feedback, user, video, handleSelect, handleShowUpdate, handleShowDelete }) => {
  return feedback.map(
    (feedback: Comment) =>
      (video.r_u_number === user.r_u_number || user.role !== "Student") && (
        <Card className="mt-2" border="success" key={feedback.comment_id}>
          <Card.Header className="d-flex justify-content-between">
            <Nav variant="tabs" defaultActiveKey="0" onSelect={(e) => handleSelect(e, feedback.comment_id)}>
              <Nav.Item>
                <Nav.Link eventKey="0">
                  <strong>Feedback</strong>
                </Nav.Link>
              </Nav.Item>
              {feedback.author === user.r_u_number && (
                <Nav.Item>
                  <Nav.Link eventKey="1">Opties</Nav.Link>
                </Nav.Item>
              )}
            </Nav>
            <div className="mt-2">{timeSince(feedback.date)}</div>
          </Card.Header>
          <Card.Body className="justify-content-around d-flex d-none" id={`commentOptions_${feedback.comment_id}`}>
            <Button variant="outline-success" onClick={() => handleShowUpdate(feedback.comment_id, feedback)}>
              Bijwerken
            </Button>
            <Button variant="outline-danger" onClick={() => handleShowDelete(feedback.comment_id, feedback)}>
              Verwijderen
            </Button>
            <Button variant="light" disabled>
              {new Date(feedback.date).toLocaleDateString()}
            </Button>
          </Card.Body>
          <Card.Body id={`commentBody_${feedback.comment_id}`}>
            <blockquote className="blockquote mb-0">
              <p>{feedback.text}</p>
              <footer className="blockquote-footer">
                <cite title="Author of comment">
                  {feedback.name} {feedback.surname}
                </cite>
              </footer>
            </blockquote>
          </Card.Body>
        </Card>
      )
  );
};

export default FeedbackList;
