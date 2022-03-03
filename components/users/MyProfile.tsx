import { NextPage } from "next";
import { Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import User from "../../interfaces/User";
import Layout from "../layout/Layout";
import OwnVideoOverview from "../videos/ProfileVideoOverview";
import ProfileCard from "../profile/ProfileCard";
import Video from "../../interfaces/Video";
import BreadcrumbComponent from "../BreadcrumbComponent";
import PageTitleComponent from "../PageTitleComponent";

interface Props {
  user: User;
}

const MyProfile: NextPage<Props> = ({ user }) => {
  const t = useTranslations("users");
  const title = t("my_profile");
  const [myVideos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/email/${user.email}`);
      const data = await res.json();

      if (res.ok) {
        setVideos(data);
      }
    };

    fetchData();
  }, [user.email]);

  const breadcrumb_items = [{ text: t("my_profile") }];

  return (
    <Layout>
      <PageTitleComponent title={title} />
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
