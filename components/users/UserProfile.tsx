import { NextPage } from "next";
import { Breadcrumb, Row, Col } from "react-bootstrap";
import User from "../../interfaces/User";
import Layout from "../layout/Layout";
import OwnVideoOverview from "../videos/ProfileVideoOverview";
import ProfileCard from "../profile/ProfileCard";
import { useEffect, useState } from "react";
import Video from "../../interfaces/Video";
import { useTranslations } from "next-intl";
import Head from "next/head";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

interface Props {
  user: User;
  videos: Video[];
}

const UserProfile: NextPage<Props> = ({ user, videos }) => {
  const t = useTranslations("users");
  const h = useTranslations("home");

  const [publicVideos, setPublicVideos] = useState<Video[]>([]);

  useEffect(() => {
    let temp: Video[] = [];
    videos.forEach((video) => {
      if (video.email === user.email && !video.private) {
        temp.push(video);
      }
    });
    setPublicVideos(temp);
  }, [videos, user.email]);

  return (
    <Layout>
      <Head>
        <title>{`${h("title_short")} | ${t("user_profile")} ${user.name} ${user.surname}`}</title>
      </Head>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>{`Gebruiker ${user.email}`}</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col lg={4}>
          <h1>
            {t("user_profile")} {user.name}
          </h1>
          <ProfileCard user={user} />
        </Col>
        <Col>
          <h1>
            {t("user_videos")} {user.name}
          </h1>
          <OwnVideoOverview videos={publicVideos} />
        </Col>
      </Row>
    </Layout>
  );
};

export default UserProfile;
