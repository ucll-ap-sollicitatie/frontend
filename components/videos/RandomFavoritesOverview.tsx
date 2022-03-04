import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button, Form, Row } from "react-bootstrap";
import User from "../../interfaces/User";
import Video from "../../interfaces/Video";
import Unauthenticated from "../Unauthenticated";
import VideoCard from "./VideoCard";

interface Props {
  videos: Video[];
  user: User;
}

const RandomFavoritesOverview: NextPage<Props> = ({ videos, user }) => {
  const t = useTranslations("videos");
  const r = useTranslations("recording");

  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;
  if (!videos) return <p>{t("no_videos")}</p>;

  return (
    <>
      <Row className="g-4">
        {videos.map(
          (video: Video) =>
            (!video.private || user.role != "Student") && (
              <div className="col-md-6 col-lg-4 col-xl-3" key={video.video_id}>
                <VideoCard video={video} />
              </div>
            )
        )}
      </Row>
    </>
  );
};

export default RandomFavoritesOverview;
