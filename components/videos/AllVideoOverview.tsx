import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { Row } from "react-bootstrap";
import User from "../../interfaces/User";
import Video from "../../interfaces/Video";
import Unauthenticated from "../Unauthenticated";
import VideoCard from "./VideoCard";

interface Props {
  videos: Video[];
  user: User;
}

const AllVideoOverview: NextPage<Props> = ({ videos, user }) => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;
  if (!videos) return <p>Geen video's gevonden</p>;

  return (
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
  );
};

export default AllVideoOverview;
