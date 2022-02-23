import type { GetStaticProps, NextPage } from "next";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { useSession } from "next-auth/react";
import { Table } from "react-bootstrap";
import Link from "next/link";
import Layout from "./layout/Layout";
import { Video } from "../interfaces/Video";
import Unauthenticated from "./Unauthenticated";

interface Props {
  videos: Video[];
}

const OwnVideoOverview: NextPage<Props> = ({ videos }) => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;
  return (
    <>
      <div className="row">
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
      </div>
    </>
  );
};

export default OwnVideoOverview;
