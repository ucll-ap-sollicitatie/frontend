import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Video from "../../interfaces/Video";
import Unauthenticated from "../Unauthenticated";
import { Row } from "react-bootstrap";
import VideoCard from "./VideoCard";
import { useTranslations } from "next-intl";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

interface Props {
  videos: Video[];
}

const OwnVideoOverview: NextPage<Props> = ({ videos }) => {
  const t = useTranslations("videos");

  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  if (!videos) return <p>{t("no_videos_user")}</p>;
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
