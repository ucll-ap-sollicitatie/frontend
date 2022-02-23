import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { Video } from "../../interfaces/Video";
import { Comment } from "../../interfaces/Comment";
import { Card, Col, Row } from "react-bootstrap";
import { useSWRConfig } from "swr";
import React, { FormEvent } from "react";
import router from "next/router";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import VideoPlayer from "../../components/VideoPlayer";
import DeleteCommentModal from "../../components/videos/DeleteCommentModal";
import UpdateCommentModal from "../../components/videos/UpdateCommentModal";
import CommentList from "../../components/videos/CommentList";
import AddComment from "../../components/videos/AddComment";

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
  const [currentComment, setCurrentComment] = React.useState(comments == null ? [] : comments[0]);

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
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const text = target.text.value;
    console.log(text);
    await fetch(`http://localhost:3001/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
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
      <DeleteCommentModal
        comment={currentComment}
        showDelete={showDelete}
        handleClose={handleClose}
        handleDeleteComment={handleDeleteComment}
      />
      <UpdateCommentModal
        comment={currentComment}
        maxChars={maxChars}
        showUpdate={showUpdate}
        handleClose={handleClose}
        handleUpdateComment={handleUpdateComment}
        setMaxChars={setMaxChars}
      />

      <Layout>
        <h1>{video.title}</h1>
        <Row>
          <Col>
            <VideoPlayer userEmail={video.email} videoTitle={video.title} />
          </Col>
          <Col>
            <h2>Beschrijving</h2>
            <p>{video.description}</p>
            <p>Geüpload op: {new Date(video.date).toLocaleString()}</p>
          </Col>
        </Row>

        <AddComment handleAddComment={handleAddComment} setMaxChars={setMaxChars} maxChars={maxChars} />

        <div className="mt-3 gap-4 flex-wrap w-75">
          {comments && (
            <CommentList
              comments={comments}
              user={session.user}
              handleSelect={handleSelect}
              handleShowUpdate={handleShowUpdate}
              handleShowDelete={handleShowDelete}
            />
          )}
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
