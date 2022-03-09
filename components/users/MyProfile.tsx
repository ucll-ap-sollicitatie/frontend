import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Modal, Row, Spinner } from "react-bootstrap";
import User from "../../interfaces/User";
import Video from "../../interfaces/Video";
import BreadcrumbComponent from "../BreadcrumbComponent";
import Layout from "../layout/Layout";
import PageTitleComponent from "../PageTitleComponent";
import ProfileCard from "../profile/ProfileCard";
import OwnVideoOverview from "../videos/ProfileVideoOverview";

interface Props {
  user: User;
}

const MyProfile: NextPage<Props> = ({ user }) => {
  const t = useTranslations("users");
  const r = useTranslations("recording");
  const title = t("my_profile");

  const session = useSession();
  const router = useRouter();

  const [myVideos, setVideos] = useState<Video[]>([]);
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const [image, setImage] = useState<Blob>();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

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

  const showUploadModal = () => {
    setShowUpload(true);
  };

  const handleClose = () => {
    setShowUpload(false);
    setError(false);
  };

  const uploadToServer = async () => {
    if (image?.type === "image/jpeg" && image?.size <= 1e7) {
      setError(false);
      setUploading(true);

      const body = new FormData();
      body.append("newImage", image);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.user_id}/image`, {
        method: "PUT",
        body,
      });

      const user_updated_res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/email/${user.email}`);
      const user_updated = await user_updated_res.json();
      console.log(user_updated);
      if (session.data !== null) session.data.user = user_updated;
      console.log(session);
      handleClose();

      // Redirect to /profile
      router.push({
        pathname: `/profile`,
      });

      setUploading(false);
    } else {
      setError(true);
      setImage(undefined);
    }
  };

  const uploadToClient = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setError(false);
    }
  };

  const breadcrumb_items = [{ text: t("my_profile") }];

  return (
    <Layout>
      <Modal show={showUpload} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t("profile_picture_upload")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <p className="alert alert-danger">{t("profile_picture_upload_format_error")}</p>}

          <div className="d-flex align-items-center justify-content-around">
            <input type="file" name="newProfileImage" onChange={uploadToClient} accept="image/*" />
            {image && !uploading && (
              <button className="btn btn-primary" type="submit" onClick={uploadToServer}>
                {t("profile_picture_upload")}
              </button>
            )}

            {image && uploading && (
              <>
                <button className="btn btn-primary" type="submit" onClick={uploadToServer}>
                  <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /> {r("uploading")}
                </button>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
      <PageTitleComponent title={title} />
      <BreadcrumbComponent items={breadcrumb_items} />
      <Row>
        <Col lg={4}>
          <h1>{t("my_profile")}</h1>
          <ProfileCard user={user} showUploadModal={showUploadModal} />
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
