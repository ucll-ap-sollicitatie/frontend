import { NextPage } from "next";
import { Row, Col } from "react-bootstrap";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import User from "../../interfaces/User";
import Layout from "../layout/Layout";
import OwnVideoOverview from "../videos/ProfileVideoOverview";
import ProfileCard from "../profile/ProfileCard";
import Video from "../../interfaces/Video";
import BreadcrumbComponent from "../BreadcrumbComponent";
import PageTitleComponent from "../PageTitleComponent";
import { useSession } from "next-auth/react";

interface Props {
  user: User;
  videos: Video[];
}

const UserProfile: NextPage<Props> = ({ user, videos }) => {
  const t = useTranslations("users");
  const title = t("user_profile");
  const [publicVideos, setPublicVideos] = useState<Video[]>([]);
  const { data: session } = useSession();
  const current_user = session?.user as User;

  useEffect(() => {
    let temp: Video[] = [];
    videos.forEach((video) => {
      if (video.email === user.email && (!video.private || current_user.role !== "Student")) {
        temp.push(video);
      }
    });
    setPublicVideos(temp);
  }, [videos, user.email]);

  const breadcrumb_items = [{ text: `${user.name} ${user.surname}` }];

  return (
    <Layout>
      <BreadcrumbComponent items={breadcrumb_items} />
      <PageTitleComponent title={title} />

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
