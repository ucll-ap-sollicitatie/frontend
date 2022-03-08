import { NextPage } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Card } from "react-bootstrap";
import Video from "../../interfaces/Video";

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
          src={`https://res.cloudinary.com/dou4tgpae/video/upload/w_640,h_480/v1645438283/SOS/${video.user_id}/${video.title}.jpg`}
          alt={video.title}
        ></Card.Img>

        <Card.Body>
          <Card.Title>{video.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {video.name} {video.surname}
          </Card.Subtitle>
        </Card.Body>

        <Card.Footer className="text-muted d-flex justify-content-between">
          <span>{new Date(video.date).toDateString()}</span>
          {video.likes < 0 && <span>Likes: {video.likes}</span>}
        </Card.Footer>
      </Card>
    </Link>
  );
};

export default VideoCard;
