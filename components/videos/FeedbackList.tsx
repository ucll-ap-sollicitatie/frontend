import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { Button, Card, Nav, Stack } from "react-bootstrap";
import { timeSince } from "../../helpers/helperFunctions";
import Comment from "../../interfaces/Comment";
import User from "../../interfaces/User";
import Video from "../../interfaces/Video";

interface Props {
  feedback: Comment[];
  user: User;
  video: Video;
  handleSelect: (eventKey: string | null, comment_id: number) => void;
  handleShowUpdate: (comment_id: number, comment: Comment) => void;
  handleShowDelete: (comment_id: number, comment: Comment) => void;
}

const FeedbackList: NextPage<Props> = ({ feedback, user, video, handleSelect, handleShowUpdate, handleShowDelete }) => {
  const t = useTranslations("videos");
  const b = useTranslations("buttons");

  return (
    <Stack gap={3}>
      {feedback.map(
        (feedback: Comment) =>
          (video.r_u_number === user.r_u_number || user.role !== "Student") && (
            <Card border="success" key={feedback.comment_id}>
              <Card.Header>
                <Nav variant="tabs" defaultActiveKey="0" onSelect={(e) => handleSelect(e, feedback.comment_id)} className="d-flex justify-content-between">
                  <div className="d-flex">
                    <Nav.Item>
                      <Nav.Link eventKey="0">
                        <strong>{t("feedback")}</strong>
                      </Nav.Link>
                    </Nav.Item>
                    {feedback.author === user.r_u_number && (
                      <Nav.Item>
                        <Nav.Link eventKey="1">{t("options")}</Nav.Link>
                      </Nav.Item>
                    )}
                  </div>
                  <Nav.Item>
                    <Nav.Link disabled>{timeSince(feedback.date)}</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body className="d-flex justify-content-between d-none" id={`commentOptions_${feedback.comment_id}`}>
                <div className="d-flex gap-3">
                  <Button variant="outline-success" onClick={() => handleShowUpdate(feedback.comment_id, feedback)}>
                    {b("update")}
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleShowDelete(feedback.comment_id, feedback)}>
                    {b("delete")}
                  </Button>
                </div>
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
      )}
    </Stack>
  );
};

export default FeedbackList;
