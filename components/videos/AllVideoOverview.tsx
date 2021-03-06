import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { ChangeEvent, useState } from "react";
import { Form, Row } from "react-bootstrap";
import User from "../../interfaces/User";
import Video from "../../interfaces/Video";
import Unauthenticated from "../Unauthenticated";
import VideoCard from "./VideoCard";

interface Props {
  videos: Video[];
  user: User;
}

const AllVideoOverview: NextPage<Props> = ({ videos, user }) => {
  const t = useTranslations("videos");
  const r = useTranslations("recording");

  const [videosFiltered, setVideosFiltered] = useState(videos);
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value;
    const videosFiltered = videos.filter(
      (video) => video.title.toLowerCase().includes(search.toLowerCase()) || video.email.toLowerCase().includes(search.toLowerCase())
    );
    setVideosFiltered(videosFiltered);
  };

  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;
  if (!videos) return <p>{t("no_videos")}</p>;

  return (
    <>
      <div className="d-flex flex-wrap gap-2">
        <Form.Group controlId="search" className="col-lg-6 col-sm-12">
          <Form.Label>{t("search")}</Form.Label>
          <Form.Control onChange={handleSearch} type="text" placeholder={t("search_placeholder")} required />
        </Form.Group>
      </div>
      <br />

      <Row className="g-4">
        {videosFiltered.length > 0 ? (
          videosFiltered.map(
            (video: Video) =>
              (!video.private || user.role != "Student") && (
                <div className="col-md-6 col-lg-4 col-xl-3" key={video.video_id}>
                  <VideoCard video={video} />
                </div>
              )
          )
        ) : (
          <p>{t("no_videos")}</p>
        )}
      </Row>
    </>
  );
};

export default AllVideoOverview;
