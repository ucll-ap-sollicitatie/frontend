import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { Video } from "../../interfaces/Video";
import { Comment } from "../../interfaces/Comment";
import router from "next/router";
import React, { FormEvent } from "react";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import VideoPlayer from "../../components/VideoPlayer";
import { Alert, Button, Card, Col, Form, Modal, Nav, Row, Tab, Tabs } from "react-bootstrap";
import { useSWRConfig } from "swr";
import { timeSince } from "../../helpers/helperFunctions";

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await fetch("http://localhost:3001/videos/");
  const videos = await data.json();

  const paths = videos.map((video: Video) => {
    return {
      params: { id: video.video_id.toString() },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const props = {
    video: null,
    comments: null,
  };

  if (params !== undefined) {
    const video_id = params.id;
    const videoRes = await fetch(`http://localhost:3001/videos/${video_id}`);
    const video = await videoRes.json();
    const commentRes = await fetch(`http://localhost:3001/comments/video/${video_id}`);
    const comments = await commentRes.json();

    props.video = video;
    if (commentRes.status !== 404) {
      props.comments = comments;
    }
  }
  return {
    props,
  };
};

interface Props {
  video: Video;
  comments: Comment[];
}

const Video: NextPage<Props> = ({ video, comments }) => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;
  const { mutate } = useSWRConfig();

  const [maxChars, setMaxChars] = React.useState(0);
  const [error, setError] = React.useState("");
  const [showDelete, setShowDelete] = React.useState(false);
  const [showUpdate, setShowUpdate] = React.useState(false);
  const [commentId, setCommentId] = React.useState(0);
  const [currentComment, setCurrentComment] = React.useState(comments[0]);

  const userEmail = session?.user?.email;
  const videoTitle = video.title;

  const handleAddComment = async (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const text = target.comment.value;
    const author = session.user?.r_u_number;
    const video_id = video.video_id;
    const request = await fetch(`http://localhost:3001/comments`, {
      method: "POST",
      body: JSON.stringify({
        text: text,
        author: author,
        video_id: video_id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (request.status === 400) {
      const response = await request.json();
      setError(response.messages);
      setShowDelete(true);
    } else {
      router.push(
        {
          pathname: `/videos/${video.video_id}`,
          query: { toast: "Uw commentaar is toegevoegd!" },
        },
        `/videos/${video.video_id}`
      );
    }
  };

  const handleDeleteComment = async () => {
    await fetch(`http://localhost:3001/comments/${commentId}`, {
      method: "DELETE",
    });

    handleClose();
    mutate("http://localhost:3001/comments");
    router.push(
      {
        pathname: `/videos/${video.video_id}`,
        query: { toast: "Commentaar verwijderd" },
      },
      `/videos/${video.video_id}`
    );
  };

  const handleUpdateComment = async (event: FormEvent) => {
    const target = event.target as HTMLFormElement;
    const text = target.text.value;
    console.log(text);
    await fetch(`http://localhost:3001/comments/${commentId}`, {
      method: "PUT",
      body: JSON.stringify({
        text: text,
      }),
    });

    handleClose();
    mutate("http://localhost:3001/comments");
    router.push(
      {
        pathname: `/videos/${video.video_id}`,
        query: { toast: "Commentaar bijgewerkt" },
      },
      `/videos/${video.video_id}`
    );
  };

  const handleClose = () => {
    setShowDelete(false);
    setShowUpdate(false);
  };

  const handleShowDelete = (comment_id: number, comment: Comment) => {
    setCommentId(comment_id);
    setCurrentComment(comment);
    setShowDelete(true);
  };

  const handleShowUpdate = (comment_id: number, comment: Comment) => {
    setCommentId(comment_id);
    setCurrentComment(comment);
    setShowUpdate(true);
  };

  const handleSelect = (eventKey: string | null, comment_id: number) => {
    const commentBody = document.getElementById(`commentBody_${comment_id}`);
    const commentOptions = document.getElementById(`commentOptions_${comment_id}`);
    if (eventKey == "0") {
      commentOptions?.classList.add("d-none");
      commentBody?.classList.remove("d-none");
    } else {
      commentOptions?.classList.remove("d-none");
      commentBody?.classList.add("d-none");
    }
  };

  return (
    <>
      <Modal show={showDelete} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Commentaar verwijderen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bent u zeker dat u dit commentaar wilt verwijderen?
          <br />
          <br />
          {`"${currentComment.text}"`}
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="danger" onClick={handleDeleteComment}>
            Verwijderen
          </Button>
          <Button variant="outline-secondary" onClick={handleClose}>
            Sluiten
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdate} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Commentaar bijwerken</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateComment} className="col-md-12 col-lg-10 col-xl-8">
            <div className="gap-4 flex-wrap">
              <Form.Group controlId="text">
                <Form.Label>Commentaar bijwerken</Form.Label>
                <Form.Control
                  onChange={(e) => setMaxChars(e.target.value.length)}
                  maxLength={255}
                  as="textarea"
                  placeholder={currentComment.text}
                  required
                />
                <Form.Text className="text-muted">Karakters: {255 - maxChars}/255</Form.Text>
              </Form.Group>
              <Button variant="success" type="submit" className="mt-3">
                Bijwerken
              </Button>
              <Button variant="outline-secondary" onClick={handleClose} className="mt-3 ms-2">
                Sluiten
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Layout>
        <h1>{video.title}</h1>
        <Row>
          <Col>
            <VideoPlayer userEmail={userEmail} videoTitle={videoTitle} />
          </Col>
          <Col>
            <h2>Beschrijving</h2>
            <p>{video.description}</p>
            <p>Geüpload op: {new Date(video.date).toLocaleString()}</p>
          </Col>
        </Row>
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
        <div className="mt-3 gap-4 flex-wrap w-75">
          {comments &&
            comments.map((comment: Comment) => (
              <Card className="mt-2" key={comment.comment_id}>
                <Card.Header className="d-flex justify-content-between">
                  <Nav variant="tabs" defaultActiveKey="0" onSelect={(e) => handleSelect(e, comment.comment_id)}>
                    <Nav.Item>
                      <Nav.Link eventKey="0">Commentaar</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="1">Opties</Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <div className="mt-2">{timeSince(comment.date)}</div>
                </Card.Header>
                <Card.Body className="justify-content-around d-flex d-none" id={`commentOptions_${comment.comment_id}`}>
                  <Button variant="outline-success" onClick={() => handleShowUpdate(comment.comment_id, comment)}>
                    Bijwerken
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleShowDelete(comment.comment_id, comment)}>
                    Verwijderen
                  </Button>
                  <Button variant="light" disabled>
                    {new Date(comment.date).toLocaleDateString()}
                  </Button>
                </Card.Body>
                <Card.Body id={`commentBody_${comment.comment_id}`}>
                  <blockquote className="blockquote mb-0">
                    <p>{comment.text}</p>
                    <footer className="blockquote-footer">
                      <cite title="Author of comment">
                        {comment.name} {comment.surname}
                      </cite>
                    </footer>
                  </blockquote>
                </Card.Body>
              </Card>
            ))}
          {!comments && (
            <Card>
              <Card.Body>
                <Card.Text className="text-center text-muted">Geen commentaar onder deze video!</Card.Text>
              </Card.Body>
            </Card>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Video;
