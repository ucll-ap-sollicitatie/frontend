import { NextPage } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Card } from "react-bootstrap";
import Video from "../../interfaces/Video";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../public/locales/${locale}.json`)).default,
    },
  };
}

interface Props {
  video: Video;
}

const VideoCard: NextPage<Props> = ({ video }) => {
  const t = useTranslations("videos");

  if (!video) return <p>{t("no_videos")}</p>;

  return (
    <Link href={`/videos/${video.video_id}`} passHref>
      <Card className="hover cursor-pointer">
        <Card.Img
          variant="top"
          src={`https://res.cloudinary.com/dou4tgpae/video/upload/w_640,h_480/v1645438283/SOS/${video.email}/${video.title}.jpg`}
          alt={video.title}
        ></Card.Img>

        <Card.Body>
          <Card.Title>{video.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {video.name} {video.surname}
          </Card.Subtitle>
        </Card.Body>

        <Card.Footer className="text-muted">{new Date(video.date).toDateString()}</Card.Footer>
      </Card>
    </Link>
  );
};

export default VideoCard;
