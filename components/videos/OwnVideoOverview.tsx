import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Video from "../../interfaces/Video";
import Unauthenticated from "../Unauthenticated";
import { Row } from "react-bootstrap";

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
            </div>
          )
      )}
    </Row>
  );
};

export default OwnVideoOverview;
