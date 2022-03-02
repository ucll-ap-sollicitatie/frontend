import { NextPage } from "next";
import { Breadcrumb, Row, Col } from "react-bootstrap";
import User from "../../interfaces/User";
import Layout from "../layout/Layout";
import OwnVideoOverview from "../videos/ProfileVideoOverview";
import ProfileCard from "../profile/ProfileCard";
import { useEffect, useState } from "react";
import Video from "../../interfaces/Video";
import { useTranslations } from "next-intl";
import BreadcrumbComponent from "../BreadcrumbComponent";

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

  const breadcrumb_items = [{ text: user.email }];

  return (
    <Layout>
      <BreadcrumbComponent items={breadcrumb_items} />

      <Row>
        <Col lg={4}>
          <h1>
            {user.name}
            {t("user_profile")}
          </h1>
          <ProfileCard user={user} />
        </Col>
        <Col>
          <h1>
            {user.name}
            {t("user_videos")}
          </h1>
          <OwnVideoOverview videos={publicVideos} />
        </Col>
      </Row>
    </Layout>
  );
};

export default UserProfile;
