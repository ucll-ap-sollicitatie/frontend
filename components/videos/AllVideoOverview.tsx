import type { NextPage } from "next";
import { useSession } from "next-auth/react";
<<<<<<< HEAD
import User from "../../interfaces/User";
import Video from "../../interfaces/Video";
import Unauthenticated from "../Unauthenticated";
import VideoCard from "./VideoCard";
=======
import Link from "next/link";
import User from "../../interfaces/User";
import Video from "../../interfaces/Video";
import Unauthenticated from "../Unauthenticated";
>>>>>>> a7a717216b138e42a479ef337888082a14a236a1

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
<<<<<<< HEAD
                <VideoCard video={video} />
=======
                <Link href={`/videos/${video.video_id}`}>
                  <div className="card border-0">
                    <img
                      src={`https://res.cloudinary.com/dou4tgpae/video/upload/w_640,h_480/v1645438283/SOS/${video.email}/${video.title}.jpg`}
                      alt={video.title}
                    />
                    <div className="card-body">
                      <p>{video.title}</p>
                      <p>{new Date(video.date).toDateString()}</p>
                    </div>
                  </div>
                </Link>
>>>>>>> a7a717216b138e42a479ef337888082a14a236a1
              </div>
            )
        )}
      </div>
    </>
  );
};

<<<<<<< HEAD
export default AllVideoOverview;
=======
export default AllVideoOverview;
>>>>>>> a7a717216b138e42a479ef337888082a14a236a1
