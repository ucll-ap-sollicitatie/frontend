import { GetStaticProps, NextPage } from "next";
import { Breadcrumb } from "react-bootstrap";
import { useEffect, useState } from "react";
import User from "../../interfaces/User";
import Layout from "../layout/Layout";
import OwnVideoOverview from "../videos/ProfileVideoOverview";
import ProfileCard from "../profile/ProfileCard";
import Video from "../../interfaces/Video";
import { useSession } from "next-auth/react";

interface Props {
  user: User;
  videos: Video[];
}

const MyProfile: NextPage<Props> = ({ user, videos }) => {
  const [myVideos, setVideos] = useState<Video[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    let temp: Video[] = [];
    videos.forEach((video) => {
      if (video.email === session?.user?.email) {
        temp.push(video);
      }
    });
    setVideos(temp);
  }, [videos, session?.user?.email]);

  return (
    <Layout>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Profiel</Breadcrumb.Item>
      </Breadcrumb>

      <h1>Uw profiel</h1>
      <ProfileCard user={user} />
      <br />

      <h2 className="h2">Uw video&apos;s</h2>
      <OwnVideoOverview videos={myVideos} />
    </Layout>
  );
};

export default MyProfile;
