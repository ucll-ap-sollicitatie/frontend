import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Row } from "react-bootstrap";
import Video from "../../interfaces/Video";
import Unauthenticated from "../Unauthenticated";
import VideoCard from "./VideoCard";

interface Props {
  videos: Video[];
}

const OwnVideoOverview: NextPage<Props> = ({ videos }) => {
  const t = useTranslations("videos");

  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  if (!videos || videos.length < 1) return <p>{t("no_videos_user")}</p>;
  return (
    <Row>
      {videos.map(
        (video: Video) =>
          video.email === session.user?.email && (
            <div className="col-md-5 border" key={video.video_id}>
              <VideoCard video={video} />
            </div>
          )
      )}
    </Row>
  );
};

export default OwnVideoOverview;
