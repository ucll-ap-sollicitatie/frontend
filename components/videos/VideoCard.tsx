import { NextPage } from "next";
import Link from "next/link";
import Video from "../../interfaces/Video";

interface Props {
  video: Video;
}

const VideoCard: NextPage<Props> = ({ video }) => {
  return (
    <Link href={`/videos/${video.video_id}`}>
      <div className="card border-0">
        <img
          src={`https://res.cloudinary.com/dou4tgpae/video/upload/w_640,h_480/v1645438283/SOS/${video.email}/${video.title}.jpg`}
          alt={video.title}
        />
        <div className="card-body">
          <p>{video.title}</p>
          <p>{new Date(video.date).toDateString()}</p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
