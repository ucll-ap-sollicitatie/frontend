import { CloudinaryContext, Transformation, Video } from "cloudinary-react";
import type { NextPage } from "next";
import { useRef } from "react";

interface Props {
  user_id: number;
  videoTitle: string;
}

const VideoPlayer: NextPage<Props> = ({ user_id, videoTitle }) => {
  const videoRef = useRef();
  const publicId = `SOS/${user_id}/${videoTitle}`;

  return (
    <CloudinaryContext cloud_name="dou4tgpae">
      <div>
        <Video publicId={publicId} width="100%" controls innerRef={videoRef}>
          <Transformation overlay={{ publicId: `SOS/${user_id}/${videoTitle}.srt`, resourceType: "subtitles" }} />
        </Video>
      </div>
    </CloudinaryContext>
  );
};

export default VideoPlayer;
