import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Card, Nav, Stack, Button } from "react-bootstrap";
import { timeSince } from "../../helpers/helperFunctions";
import Comment from "../../interfaces/Comment";
import User from "../../interfaces/User";

interface Props {
  comment: Comment;
  user: User;
  handleSelect: Function;
  handleShowUpdate: Function;
  handleShowDelete: Function;
  handleAddLike: Function;
  handleRemoveLike: Function;
}

const CommentItem: NextPage<Props> = ({ comment, user, handleSelect, handleShowUpdate, handleShowDelete, handleAddLike, handleRemoveLike }) => {
  const [liked, setLiked] = useState(false);

  const fetchData = async () => {
    const res = await fetch(`http://localhost:3001/comments/likes/${comment.comment_id}/check`, {
      method: "POST",
      body: JSON.stringify({
        email: user.email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  };

  useEffect(() => {
    fetchData();
  });

  return (
    <Card>
      <Card.Header>
        <Nav variant="tabs" defaultActiveKey="0" onSelect={(e) => handleSelect(e, comment.comment_id)} className="d-flex justify-content-between">
          <div className="d-flex">
            <Nav.Item>
              <Nav.Link eventKey="0">Commentaar</Nav.Link>
            </Nav.Item>
            {comment.author === user.r_u_number && (
              <Nav.Item>
                <Nav.Link eventKey="1">Opties</Nav.Link>
              </Nav.Item>
            )}
            {comment.likes != 0 && (
              <Nav.Item>
                <Nav.Link disabled>Likes: {comment.likes}</Nav.Link>
              </Nav.Item>
            )}
          </div>
          <Nav.Item>
            <Nav.Link disabled>{timeSince(comment.date)}</Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>
      <Card.Body id={`commentBody_${comment.comment_id}`}>
        <Stack direction="horizontal" gap={3}>
          <blockquote className="blockquote mb-0">
            <p>{comment.text}</p>
            <footer className="blockquote-footer">
              <cite title="Author of comment">
                {comment.name} {comment.surname}
              </cite>
            </footer>
          </blockquote>
          {liked && (
            <Button variant="outline-secondary" onClick={() => handleRemoveLike(user.email, comment.comment_id)} className="ms-auto">
              Vind ik niet leuk
            </Button>
          )}
          {!liked && (
            <Button variant="outline-secondary" onClick={() => handleAddLike(user.email, comment.comment_id)} className="ms-auto">
              Vind ik leuk
            </Button>
          )}
        </Stack>
      </Card.Body>
      <Card.Body className="d-flex justify-content-between d-none" id={`commentOptions_${comment.comment_id}`}>
        <div className="d-flex gap-3">
          <Button
            variant="outline-success"
            onClick={() => {
              handleShowUpdate(comment.comment_id, comment);
            }}
          >
            Bijwerken
          </Button>
          <Button
            variant="outline-danger"
            onClick={() => {
              handleShowDelete(comment.comment_id, comment);
            }}
          >
            Verwijderen
          </Button>
        </div>
        <Button variant="light" disabled>
          {new Date(comment.date).toLocaleDateString()}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default CommentItem;
