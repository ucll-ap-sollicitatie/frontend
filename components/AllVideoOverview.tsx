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

const AllVideoOverview: NextPage<Props> = ({ videos }) => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;
  return (
    <>
      <div className="container">
        <div className="row">
          {videos.map(
            (video: Video) =>
              (!video.private || session.user?.role != "Student") && (
                <div className="col-md-4 border" key={video.video_id}>
                  <Link href={`/videos/${video.video_id}`}>
                    <div className="card border-0">
                      <img
                        src={`https://res.cloudinary.com/dou4tgpae/video/upload/v1645438283/SOS/${video.email}/${video.title}.jpg`}
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
      </div>
    </>
  );
};

export default AllVideoOverview;
