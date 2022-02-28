import type { GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Breadcrumb, Col, Row } from "react-bootstrap";
import Layout from "../../components/layout/Layout";
import ProfileCard from "../../components/profile/ProfileCard";
import Unauthenticated from "../../components/Unauthenticated";
import OwnVideoOverview from "../../components/videos/OwnVideoOverview";
import User from "../../interfaces/User";
import Video from "../../interfaces/Video";

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`);
  const videos = await res.json();

  return {
    props: { videos: videos },
  };
};

interface Props {
  videos: Video[];
}

const Home: NextPage<Props> = ({ videos }) => {
  const t = useTranslations("users");

  const { data: session } = useSession();
  if (!session || session.user === undefined) return <Unauthenticated />;
  const user = session.user as User;

  return (
    <Layout>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Profiel</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col>
          <h1>{t("my_profile")}</h1>
          <ProfileCard user={user} />
        </Col>
        <Col>
          <h1>{t("my_videos")}</h1>
          <OwnVideoOverview videos={videos} />
        </Col>
      </Row>
    </Layout>
  );
};

export default Home;
