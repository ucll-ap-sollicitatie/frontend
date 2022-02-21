import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import VideoPlayer from "../../components/VideoPlayer";
import { Video } from "../../interfaces/Video";

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await fetch("http://localhost:3001/videos/");
  const videos = await data.json();

  const paths = videos.map((video: Video) => {
    return {
      params: { id: video.video_id.toString() },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (params !== undefined) {
    const res = await fetch(`http://localhost:3001/videos/${params.id}`);
    const video = await res.json();

    return {
      props: { video: video },
    };
  } else {
    return {
      props: { video: null },
    };
  }
};

interface Props {
  video: Video;
}

const Video: NextPage<Props> = ({ video }) => {
  const { data: session } = useSession();
  if (!session || session !== undefined) return <Unauthenticated />;

  const userEmail = session.user.email;
  const videoTitle = video.title;

  console.table({ userEmail, videoTitle });
  return (
    <Layout>
      <h1>{video.title}</h1>
      <VideoPlayer userEmail={userEmail} videoTitle={videoTitle} />
    </Layout>
  );
};

export default Video;
