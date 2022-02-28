import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Video from "../../interfaces/Video";
import Unauthenticated from "../Unauthenticated";
import { Row } from "react-bootstrap";
import VideoCard from "./VideoCard";

interface Props {
  videos: Video[];
}

const OwnVideoOverview: NextPage<Props> = ({ videos }) => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  if (!videos || videos.length !== 0) return <p>U heeft momenteel nog geen video's geüpload.</p>;

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
