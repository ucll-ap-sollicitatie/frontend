import type { NextPage } from "next";
import { useRef } from "react";
import { Video, Transformation, CloudinaryContext } from "cloudinary-react";

interface Props {
  userEmail: string;
  videoTitle: string;
}

const VideoPlayer: NextPage<Props> = ({ userEmail, videoTitle }) => {
  const videoRef = useRef();
  const publicId = `SOS/${userEmail}/${videoTitle}`;

  return (
    <CloudinaryContext cloud_name="dou4tgpae">
      <div>
        <Video publicId={publicId} width="100%" controls innerRef={videoRef}>
          <Transformation overlay={{ publicId: `SOS/${userEmail}/${videoTitle}.srt`, resourceType: "subtitles" }} />
        </Video>
      </div>
    </CloudinaryContext>
  );
};

export default VideoPlayer;
