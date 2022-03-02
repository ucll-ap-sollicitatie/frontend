import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { Button, Card, Col, Form, Row, Stack } from "react-bootstrap";
import { useSWRConfig } from "swr";
import React, { FormEvent, useEffect, useState } from "react";
import router from "next/router";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import VideoPlayer from "../../components/videos/VideoPlayer";
import DeleteCommentModal from "../../components/videos/DeleteCommentModal";
import UpdateCommentModal from "../../components/videos/UpdateCommentModal";
import AddComment from "../../components/videos/AddComment";
import FeedbackModal from "../../components/videos/FeedbackModal";
import Video from "../../interfaces/Video";
import Comment from "../../interfaces/Comment";
import FeedbackList from "../../components/videos/FeedbackList";
import Unauthorized from "../../components/Unauthorized";
import CommentList from "../../components/videos/CommentList";
import User from "../../interfaces/User";
import { useTranslations } from "next-intl";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import Head from "next/head";

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`);
  const videos = await data.json();

  let paths = [] as any;

  videos.map((video: Video) => {
    paths.push(
      { params: { id: video.video_id.toString() }, locale: "en" },
      { params: { id: video.video_id.toString() }, locale: "fr" },
      { params: { id: video.video_id.toString() }, locale: "nl" }
    );
  });

  return {
    paths: paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const props = {
    video: null,
    comments: null,
    feedback: null,
    messages: (await import(`../../public/locales/${locale}.json`)).default,
  };

  if (params !== undefined) {
    const video_id = params.id;
    const videoRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/${video_id}`);
    const video = await videoRes.json();
    const commentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/video/${video_id}`);
    const comments = await commentRes.json();
    const feedbackRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/video/${video_id}/feedback`);
    const feedback = await feedbackRes.json();

    props.video = video;
    if (commentRes.ok) {
      props.comments = comments;
    }
    if (feedbackRes.ok) {
      props.feedback = feedback;
    }
  }

  return {
    props,
  };
};

interface Props {
  video: Video;
  comments: Comment[];
  feedback: Comment[];
}

const Video: NextPage<Props> = ({ video, comments, feedback }) => {
  const t = useTranslations("videos");
  const h = useTranslations("home");

  const { mutate } = useSWRConfig();
  const [maxChars, setMaxChars] = useState(0);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [videoLiked, setVideoLiked] = useState(false);
  const [videoFavorited, setVideoFavorited] = useState(false);
  const [commentId, setCommentId] = useState(0);
  const [likes, setLikes] = useState<number>(video.likes > 0 ? video.likes : 0);
  const [currentComment, setCurrentComment] = useState<Comment | null>(comments == null ? null : comments[0]);
  const { data: session } = useSession();
  const user = session?.user as User;

  useEffect(() => {
    const fetchTest = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/likes/${video.video_id}/check`, {
        method: "POST",
        body: JSON.stringify({
          email: session?.user?.email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setVideoLiked(true);
      } else {
        setVideoLiked(false);
      }
      const res2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/${video.video_id}/check`, {
        method: "POST",
        body: JSON.stringify({
          email: session?.user?.email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res2.ok) {
        setVideoFavorited(true);
      } else {
        setVideoFavorited(false);
      }
    };
    fetchTest();
  }, [session?.user?.email, video.video_id]);

  if (!session || session.user === undefined) return <Unauthenticated />;
  if (video.private && user.role === "Student") return <Unauthorized />;

  const handleLikeVideo = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/likes/${video.video_id}/like`, {
      method: "POST",
      body: JSON.stringify({ email: user.email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setVideoLiked(true);
    setLikes(likes + 1);
  };

  const handleUnlikeVideo = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/likes/${video.video_id}/unlike`, {
      method: "POST",
      body: JSON.stringify({ email: user.email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setVideoLiked(false);
    setLikes(likes - 1);
  };

  const handleFavoriteVideo = async () => {
    if (!videoFavorited) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/${video.video_id}/favorite`, {
        method: "POST",
        body: JSON.stringify({ email: user.email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setVideoFavorited(true);
    } else {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/${video.video_id}/unfavorite`, {
        method: "POST",
        body: JSON.stringify({ email: user.email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setVideoFavorited(false);
    }
  };

  const handleAddFeedback = async (event: FormEvent) => {
    event.preventDefault();
    handleAddComment(event, true);
  };

  const handleAddComment = async (event: FormEvent, feedback: boolean = false) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const text = target.comment.value;
    const author = user.r_u_number;
    const video_id = video.video_id;
    const body = {
      text: text,
      author: author,
      video_id: video_id,
    };

    if (feedback) {
      Object.assign(body, { feedback: true });
    } else {
      Object.assign(body, { feedback: false });
    }

    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (request.status === 400) {
      const response = await request.json();
      setError(response.messages);
      setShowDelete(true);
    } else {
      handleClose();
      router.push(
        {
          pathname: `/videos/${video.video_id}`,
          query: { toast: `${feedback ? t("feedback_add_success") : t("comment_add_success")}` },
        },
        `/videos/${video.video_id}`
      );
    }
  };

  const handleDeleteComment = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`, {
      method: "DELETE",
    });

    handleClose();
    mutate(`${process.env.NEXT_PUBLIC_API_URL}/comments`);
    router.push(
      {
        pathname: `/videos/${video.video_id}`,
        query: { toast: t("comment_remove_success") },
      },
      `/videos/${video.video_id}`
    );
  };

  const handleUpdateComment = async (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const text = target.comment.value;
    console.log(text);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
      }),
    });

    handleClose();
    mutate(`${process.env.NEXT_PUBLIC_API_URL}/comments`);
    router.push(
      {
        pathname: `/videos/${video.video_id}`,
        query: { toast: t("comment_update_success") },
      },
      `/videos/${video.video_id}`
    );
  };

  const handleClose = () => {
    setShowDelete(false);
    setShowUpdate(false);
    setShowFeedback(false);
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

  const handleShowFeedback = () => {
    setShowFeedback(true);
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

  const breadcrumb_items = [{ href: "/videos", text: t("all") }, { text: video.title }];

  return (
    <>
      <DeleteCommentModal comment={currentComment} showDelete={showDelete} handleClose={handleClose} handleDeleteComment={handleDeleteComment} />
      <UpdateCommentModal
        comment={currentComment}
        maxChars={maxChars}
        showUpdate={showUpdate}
        handleClose={handleClose}
        handleUpdateComment={handleUpdateComment}
        setMaxChars={setMaxChars}
      />

      <FeedbackModal
        user={user}
        maxChars={maxChars}
        showFeedback={showFeedback}
        handleClose={handleClose}
        handleAddFeedback={handleAddFeedback}
        setMaxChars={setMaxChars}
      />

      <Layout>
        <Head>
          <title>{`${h("title_short")} | ${video.title}`}</title>
        </Head>

        <BreadcrumbComponent items={breadcrumb_items} />

        <h1>
          {t("title")}: {video.title}
        </h1>

        <div className="d-flex flex-wrap gap-3 gap-lg-5">
          <Col sm={12} lg={8}>
            <VideoPlayer userEmail={video.email} videoTitle={video.title} />
          </Col>
          <Col className="d-flex flex-column gap-2">
            <h2 className="h2 mt-0">{t("information")}</h2>
            <div>
              <h4>{t("title")}</h4>
              <p>{video.title}</p>
            </div>
            <div>
              <h4>{t("description")}</h4>
              <p>{video.description}</p>
            </div>
            <div>
              <h4>{t("uploaded_by")}</h4>
              <p>
                {video.name} {video.surname}
              </p>
            </div>
            <div>
              <h4>{t("date")}</h4>
              <span>{new Date(video.date).toLocaleString()}</span>
            </div>
            <hr />
            <div className="d-flex">
              {user.role == "Lector" && (
                <Button variant="outline-success" onClick={handleShowFeedback}>
                  {t("feedback_add")}
                </Button>
              )}
              {videoLiked ? (
                <Button variant="outline-secondary" className="ms-2" onClick={handleUnlikeVideo}>
                  {t("dislike_video")}
                </Button>
              ) : (
                <Button variant="outline-primary" className="ms-2" onClick={handleLikeVideo}>
                  {t("like_video")}
                </Button>
              )}
              {likes > 0 && <span className="ms-2 text-muted">Likes: {likes}</span>}
              {user.role == "Lector" && (
                <Form>
                  <Form.Group className="mb-3" controlId="favoriteCheckbox">
                    <Form.Check type="checkbox" label={t("favorite_video")} checked={videoFavorited} onChange={handleFavoriteVideo} />
                  </Form.Group>
                </Form>
              )}
            </div>
          </Col>
        </div>

        <hr className="mt-5 mb-5" />

        <Row>
          <Col>
            <AddComment handleAddComment={handleAddComment} setMaxChars={setMaxChars} maxChars={maxChars} />
            <br />

            <Stack gap={3}>
              {feedback && (
                <FeedbackList
                  feedback={feedback}
                  user={user}
                  video={video}
                  handleSelect={handleSelect}
                  handleShowUpdate={handleShowUpdate}
                  handleShowDelete={handleShowDelete}
                />
              )}
              {comments && (
                <CommentList
                  comments={comments}
                  user={user}
                  handleSelect={handleSelect}
                  handleShowUpdate={handleShowUpdate}
                  handleShowDelete={handleShowDelete}
                />
              )}
              {!comments && (
                <Card className="mt-2">
                  <Card.Body>
                    <Card.Text className="text-center text-muted">{t("no_comments")}</Card.Text>
                  </Card.Body>
                </Card>
              )}
            </Stack>
          </Col>
        </Row>
      </Layout>
    </>
  );
};

export default Video;
