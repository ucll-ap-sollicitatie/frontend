import { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import router from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { Button, Card, Col, Form, OverlayTrigger, Row, Stack, Tooltip } from "react-bootstrap";
import { useSWRConfig } from "swr";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import Layout from "../../components/layout/Layout";
import PageTitleComponent from "../../components/PageTitleComponent";
import Unauthenticated from "../../components/Unauthenticated";
import Unauthorized from "../../components/Unauthorized";
import AddComment from "../../components/videos/AddComment";
import CommentList from "../../components/videos/CommentList";
import DeleteCommentModal from "../../components/videos/DeleteCommentModal";
import FeedbackList from "../../components/videos/FeedbackList";
import FeedbackModal from "../../components/videos/FeedbackModal";
import UpdateCommentModal from "../../components/videos/UpdateCommentModal";
import UpdateVideoModal from "../../components/videos/UpdateVideoModal";
import VideoPlayer from "../../components/videos/VideoPlayer";
import Comment from "../../interfaces/Comment";
import User from "../../interfaces/User";
import Video from "../../interfaces/Video";

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const props = {
    video: null,
    comments: null,
    feedback: null,
    messages: (await import(`../../public/locales/${locale}.json`)).default,
  };

  if (params !== undefined) {
    const video_id = params.id;
    const videoRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/${video_id}`);
    if (videoRes.status === 404) {
      return {
        notFound: true,
      };
    }
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
    props: props,
  };
};

interface Props {
  video: Video;
  comments: Comment[];
  feedback: Comment[];
}

const Video: NextPage<Props> = ({ video, comments, feedback }) => {
  const t = useTranslations("videos");
  const title = video?.title;
  const { mutate } = useSWRConfig();
  const [maxChars, setMaxChars] = useState(0);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showUpdateVideo, setShowUpdateVideo] = useState(false);
  const [videoLiked, setVideoLiked] = useState(false);
  const [videoFavorited, setVideoFavorited] = useState(false);
  const [commentId, setCommentId] = useState(0);
  const [likes, setLikes] = useState<number>(video?.likes > 0 ? video?.likes : 0);
  const [currentComment, setCurrentComment] = useState<Comment | null>(comments == null ? null : comments[0]);
  const { data: session } = useSession();
  const user = session?.user as User;
  const video_author = `${video.name} ${video.surname}`;

  useEffect(() => {
    const fetchTest = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/likes/${video?.video_id}/check`, {
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
      const res2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/${video?.video_id}/check`, {
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
  }, [session?.user?.email, video?.video_id]);

  if (!session || session.user === undefined) return <Unauthenticated />;
  if (user.email !== video?.email && video?.private && user.role === "Student") return <Unauthorized />;

  const handleLikeVideo = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/likes/${video?.video_id}/like`, {
      method: "POST",
      body: JSON.stringify({ email: user.email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setVideoLiked(true);
    setLikes(+likes + +1);
  };

  const handleUnlikeVideo = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/likes/${video?.video_id}/unlike`, {
      method: "POST",
      body: JSON.stringify({ email: user.email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setVideoLiked(false);
    setLikes(+likes - +1);
  };

  const handleFavoriteVideo = async () => {
    if (!videoFavorited) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/${video?.video_id}/favorite`, {
        method: "POST",
        body: JSON.stringify({ email: user.email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setVideoFavorited(true);
    } else {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/${video?.video_id}/unfavorite`, {
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
    const text = target.comment.value.trim();
    const author = user.email;
    const video_id = video?.video_id;
    const body = {
      text: text,
      author: author,
      video_id: video_id,
    };

    if (feedback) {
      const van = new Date(0, 0, 0, 0, target.van[0].value, target.van[1].value, 0);
      const tot = new Date(0, 0, 0, 0, target.tot[0].value, target.tot[1].value, 0);
      Object.assign(body, { feedback: true });
      Object.assign(body, { start_feedback: van });
      Object.assign(body, { end_feedback: tot });
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
          pathname: `/videos/${video?.video_id}`,
          query: { toast: `${feedback ? t("feedback_add_success") : t("comment_add_success")}` },
        },
        `/videos/${video?.video_id}`
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
        pathname: `/videos/${video?.video_id}`,
        query: { toast: t("comment_remove_success") },
      },
      `/videos/${video?.video_id}`
    );
  };

  const handleUpdateComment = async (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const text = target.comment.value.trim();
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
        pathname: `/videos/${video?.video_id}`,
        query: { toast: t("comment_update_success") },
      },
      `/videos/${video?.video_id}`
    );
  };

  const handleUpdateVideo = async (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const fileName = target.file_title.value.trim();
    const description = target.description.value.trim();
    const prive = target.privateCheckbox.checked;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/${video.video_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        new_title: fileName,
        description: description,
        private: prive,
        old_title: video.title,
        user_id: user.user_id,
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
    setShowUpdateVideo(false);
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

  const handleShowUpdateVideo = () => {
    setShowUpdateVideo(true);
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

  const handleDeleteVideo = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/${video.video_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      router.push(
        {
          pathname: `/profile`,
          query: { toast: t("video_delete_succes") },
        },
        `/profile`
      );
    });
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
        video_author={video_author}
        maxChars={maxChars}
        showFeedback={showFeedback}
        handleClose={handleClose}
        handleAddFeedback={handleAddFeedback}
        setMaxChars={setMaxChars}
      />
      <UpdateVideoModal
        user={user}
        maxChars={maxChars}
        showUpdateVideo={showUpdateVideo}
        handleClose={handleClose}
        handleUpdateVideo={handleUpdateVideo}
        setMaxChars={setMaxChars}
        video={video}
        handleDeleteVideo={handleDeleteVideo}
      />
      <Layout>
        <BreadcrumbComponent items={breadcrumb_items} />
        <PageTitleComponent title={title} />
        <div className="d-flex justify-content-between">
          <h1>
            {t("title")}: {video.title}
          </h1>
        </div>

        <div className="d-flex flex-wrap gap-3 gap-lg-5 text-break">
          <Col sm={12} lg={8}>
            <VideoPlayer user_id={video?.user_id} videoTitle={title} />
          </Col>
          <Col className="d-flex flex-column gap-2">
            <h2 className="h2 mt-0">{t("information")}</h2>
            <div>
              <h4>{t("title")}</h4>
              <p>{title}</p>
            </div>
            <div>
              <h4>{t("description")}</h4>
              <p>{video?.description}</p>
            </div>
            <div>
              <h4>{t("uploaded_by")}</h4>
              <p>
                {video.email === user.email ? (
                  <Link href={`/profile`}>
                    <a className="link-primary">
                      {video?.name} {video?.surname}
                    </a>
                  </Link>
                ) : (
                  <Link href={`/users/${video?.user_id}`}>
                    <a className="link-primary">
                      {video?.name} {video?.surname}
                    </a>
                  </Link>
                )}
              </p>
            </div>
            <div>
              <h4>{t("date")}</h4>
              <span>{new Date(video?.date).toLocaleString()}</span>
            </div>
            <hr />
            {user.user_id === video.user_id && (
              <Button variant="outline-secondary" className="col-xl-7 col-lg-8 col-md-5 col-sm-7" onClick={handleShowUpdateVideo}>
                <strong>{t("edit_video")}</strong>
              </Button>
            )}
            <div className="d-flex gap-2">
              {videoLiked ? (
                <Button variant="outline-secondary" onClick={handleUnlikeVideo}>
                  {t("dislike_video")}
                </Button>
              ) : (
                <Button variant="outline-primary" onClick={handleLikeVideo}>
                  <strong>{t("like_video")}</strong>
                </Button>
              )}
              {user.role == "Lector" && (
                <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">{t("feedback_privacy")}</Tooltip>}>
                  <Button variant="outline-success" onClick={handleShowFeedback}>
                    <strong>{t("feedback_add")}</strong>
                  </Button>
                </OverlayTrigger>
              )}
            </div>
            <div className="d-flex gap-5">
              <span className="text-muted">Likes: {likes}</span>
              {user.role == "Lector" && (
                <Form>
                  <Form.Group controlId="favoriteCheckbox">
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
