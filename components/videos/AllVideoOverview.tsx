import type { NextPage } from "next";
import { useSession } from "next-auth/react";
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
  if (!videos) return <h1>Geen video's gevonden</h1>;

  return (
    <>
      <h1>Alle video's</h1>
      <div className="row">
        {videos.map(
          (video: Video) =>
            (!video.private || user.role != "Student") && (
              <div className="col-md-4 border" key={video.video_id}>
                <VideoCard video={video} />
              </div>
            )
        )}
      </div>
    </>
  );
};

export default AllVideoOverview;
