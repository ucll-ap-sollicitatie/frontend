import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { Video } from "../../interfaces/Video";
import { Comment } from "../../interfaces/Comment";
import router from "next/router";
import React, { FormEvent } from "react";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import VideoPlayer from "../../components/VideoPlayer";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";

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

  const [maxChars, setMaxChars] = React.useState(0);
  const [show, setShow] = React.useState(false);
  const [error, setError] = React.useState("");

  const userEmail = session?.user?.email;
  const videoTitle = video.title;
  const videoEmail = video.email;

  const handleComment = async (event: FormEvent) => {
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
      setShow(true);
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

  return (
    <Layout>
      <h1>{video.title}</h1>
      <Row>
        <Col>
          <VideoPlayer userEmail={videoEmail} videoTitle={videoTitle} />
          <h2>Beschrijving</h2>
          <p>{video.description}</p>
          <p>Geüpload op: {new Date(video.date).toDateString()}</p>
        </Col>
        <Col>
          <Alert variant="danger" onClose={() => setShow(false)} show={show} transition={true} dismissible>
            <Alert.Heading>Slim op sollicitatie</Alert.Heading>
            <span>{error}</span>
          </Alert>

          <Form onSubmit={handleComment} className="col-md-12 col-lg-10 col-xl-8">
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
                  <Card.Header className="d-flex justify-content-end">{new Date(comment.date).toLocaleString()}</Card.Header>
                  <Card.Body>
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
        </Col>
      </Row>
    </Layout>
  );
};

export default Video;
