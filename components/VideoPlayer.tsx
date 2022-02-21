import type { NextPage } from "next";
import { useRef } from "react";
import { Video, CloudinaryContext } from "cloudinary-react";

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
        <Video publicId={publicId} width="50%" controls innerRef={videoRef} />
      </div>
    </CloudinaryContext>
  );
};

export default VideoPlayer;
