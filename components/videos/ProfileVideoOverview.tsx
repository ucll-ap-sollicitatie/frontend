import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Video from "../../interfaces/Video";
import VideoCard from "./VideoCard";
import Unauthenticated from "../Unauthenticated";

interface Props {
  videos: Video[] | null;
}

const ProfileVideoOverview: NextPage<Props> = ({ videos }) => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;
  return (
    <>
      {!videos && <p>Deze gebruiker heeft geen video's.</p>}
      {videos && (
        <div className="row">
          {videos.map((video: Video) => (
            <div className="col-md-5 border" key={video.video_id}>
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProfileVideoOverview;
