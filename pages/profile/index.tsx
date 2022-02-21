import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "../../components/layout/Layout";
import ProfileCard from "../../components/ProfileCard";
import Unauthenticated from "../../components/Unauthenticated";
import React from "react";
import Link from "next/link";
import Video from "../../interfaces/Video";
import { useRequest } from "../../helpers/useRequest";
import { Spinner } from "react-bootstrap";

const Home: NextPage = () => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  const { data: videos, error } = useRequest(`videos/user/${session.user.r_u_number}`);

  if (error) return <div>Failed to load users</div>;
  if (!videos) {
    return (
      <div>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }
  return (
    <Layout>
      <h1>Profiel</h1>
      {/* @ts-ignore */}
      <ProfileCard user={session.user} />
      <div className="container">
        <div className="row">
            {videos.map((video: Video) =>
            <div className="col-md-4" key={video.video_id}>
                <Link href={`/player/${video.video_id}`}>
                    <div className="card border-0">
                        {/* <img src={`http://localhost:3001${video.poster}`} alt={video.name} /> */}
                        <div className="card-body">
                            <p>{video.title}</p>
                            {/* <p>{video.duration}</p> */}
                        </div>
                    </div>
                </Link>
            </div>
            )}
          </div>
        </div>
    </Layout>
  );
};

export default Home;
