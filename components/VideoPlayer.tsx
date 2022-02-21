import { useRef } from "react";
import { Video, CloudinaryContext } from "cloudinary-react";
const VideoPlayer = () => {
  const videoRef = useRef();
  return (
    <CloudinaryContext cloud_name="dou4tgpae">
      <div>
        <Video publicId="SOS/test" width="50%" controls innerRef={videoRef} />
      </div>
    </CloudinaryContext>
  );
};
export default VideoPlayer;
