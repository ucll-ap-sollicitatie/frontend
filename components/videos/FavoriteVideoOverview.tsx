import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { ChangeEvent, useState } from "react";
import { Form, Row } from "react-bootstrap";
import User from "../../interfaces/User";
import Video from "../../interfaces/Video";
import Unauthenticated from "../Unauthenticated";
import VideoCard from "./VideoCard";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

interface Props {
  videos: Video[];
  user: User;
}

const AllVideoOverview: NextPage<Props> = ({ videos, user }) => {
  const t = useTranslations("videos");

  const [videosFiltered, setVideosFiltered] = useState(videos);
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value;
    const videosFiltered = videos.filter(
      (video) => video.title.toLowerCase().includes(search.toLowerCase()) || video.email.toLowerCase().includes(search.toLowerCase())
    );
    setVideosFiltered(videosFiltered);
  };

  if (!videos) return <p>{t("no_videos")}</p>;
  return (
    <>
      <Form.Group controlId="search">
        <Form.Label>{t("search")}</Form.Label>
        <Form.Control onChange={handleSearch} type="text" placeholder={t("search")} required />
      </Form.Group>
      <br />

      <Row className="g-4">
        {videosFiltered.map(
          (video: Video) =>
            (user.email === video.favorite_email) && (
              <div className="col-md-6 col-lg-4 col-xl-3" key={video.video_id}>
                <VideoCard video={video} />
              </div>
            )
        )}
      </Row>
    </>
  );
};

export default AllVideoOverview;
