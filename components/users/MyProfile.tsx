import { NextPage } from "next";
import { Breadcrumb, Row, Col } from "react-bootstrap";
import User from "../../interfaces/User";
import Layout from "../layout/Layout";
import OwnVideoOverview from "../videos/ProfileVideoOverview";
import ProfileCard from "../profile/ProfileCard";
import { useEffect, useState } from "react";

interface Props {
  user: User;
}

const MyProfile: NextPage<Props> = ({ user }) => {
  const [myVideos, setVideos] = useState(null);

  const fetchData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/email/${user.email}`);
    const data = await res.json();
    if (res.ok) {
      setVideos(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Profiel</Breadcrumb.Item>
      </Breadcrumb>

      <h1>Uw profiel</h1>
      <ProfileCard user={user} />
      <br />

      <h2 className="h2">Uw video's</h2>
      <OwnVideoOverview videos={myVideos} />
    </Layout>
  );
};

export default MyProfile;
