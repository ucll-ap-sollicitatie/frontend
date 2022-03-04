import { NextPage } from "next";
import { Col, Modal, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
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
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const [image, setImage] = useState<Blob>();
  const [uploadError, setUploadError] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);

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

  const showUploadModal = () => {
    setShowUpload(true);
  };

  const handleClose = () => {
    setShowUpload(false);
  };

  const uploadToServer = async () => {
    if (image?.type === "image/jpeg" && image?.size <= 1e7) {
      const body = new FormData();
      body.append("newImage", image);
      const response = await fetch(`http://localhost:3001/users/${user.user_id}/image`, {
        method: "PUT",
        body,
      });
    }
  };

  const uploadToClient = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
    }
  };

  return (
    <Layout>
      <Modal show={showUpload} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t("profile_picture_upload")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center justify-content-around">
            <input type="file" name="newProfileImage" onChange={uploadToClient} accept="image/*" />
            {image && (
              <button className="btn btn-primary" type="submit" onClick={uploadToServer}>
                {t("profile_picture_upload")}
              </button>
            )}
          </div>
        </Modal.Body>
      </Modal>
      <PageTitleComponent title={title} />
      <BreadcrumbComponent items={breadcrumb_items} />
      <Row>
        <Col lg={4}>
          <h1>{t("my_profile")}</h1>
          <ProfileCard user={user} showUploadModal={showUploadModal} showUpload={showUpload} />
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
