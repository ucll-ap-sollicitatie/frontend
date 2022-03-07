import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Row } from "react-bootstrap";
import Video from "../../interfaces/Video";
import Unauthenticated from "../Unauthenticated";
import VideoCard from "./VideoCard";

interface Props {
  videos?: Video[];
}

const ProfileVideoOverview: NextPage<Props> = ({ videos }) => {
  const t = useTranslations("videos");

  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;
  if (!videos || videos.length < 1) return <p>{t("no_videos_user")}</p>;

  return (
    <Row className="g-4">
      {videos.map((video: Video) => (
        <div className="col-md-6 col-lg-4 col-xl-4" key={video.video_id}>
          <VideoCard video={video} />
        </div>
      ))}
    </Row>
  );
};

export default ProfileVideoOverview;
