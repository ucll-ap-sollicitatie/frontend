import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Video from "../../interfaces/Video";
import VideoCard from "./VideoCard";
import Unauthenticated from "../Unauthenticated";
import { Row } from "react-bootstrap";

interface Props {
  videos: Video[] | null;
}

const ProfileVideoOverview: NextPage<Props> = ({ videos }) => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  if (!videos) return <p>Deze gebruiker heeft nog geen video&apos;s.</p>;

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
