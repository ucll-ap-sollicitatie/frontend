import { NextPage } from "next";
import { Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import User from "../../interfaces/User";
import Layout from "../layout/Layout";
import OwnVideoOverview from "../videos/ProfileVideoOverview";
import ProfileCard from "../profile/ProfileCard";
import Video from "../../interfaces/Video";
import { useSession } from "next-auth/react";
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

const MyProfile: NextPage<Props> = ({ user, videos }) => {
  const t = useTranslations("users");
  const h = useTranslations("home");

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

  const breadcrumb_items = [{ text: t("my_profile") }];

  return (
    <Layout>
      <Head>
        <title>{`${h("title_short")} | ${t("my_profile")}`}</title>
      </Head>

      <BreadcrumbComponent items={breadcrumb_items} />

      <Row>
        <Col lg={4}>
          <h1>{t("my_profile")}</h1>
          <ProfileCard user={user} />
        </Col>
        <Col>
          <h1>{t("my_videos")}</h1>
          <OwnVideoOverview videos={myVideos} />
        </Col>
      </Row>
    </Layout>
  );
};

export default MyProfile;
