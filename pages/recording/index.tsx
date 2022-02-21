import type { NextPage } from "next";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import Layout from "../../components/layout/Layout";
import axios from "axios";
import { Button } from "react-bootstrap";

/* const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
}; */

const Recording: NextPage = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const handleStartCaptureClick = useCallback(() => {
    if (mediaRecorderRef !== null && webcamRef.current !== null && webcamRef.current.stream !== null) {
      setCapturing(true);
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: "video/webm",
      });
      mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
      mediaRecorderRef.current.start();
    }
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = useCallback(() => {
    if (mediaRecorderRef.current !== null) {
      mediaRecorderRef.current.stop();
      setCapturing(false);
    }
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleUpload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const formData = new FormData();
      const fileName = "Szymon-WebDev-2022.webm";
      formData.append("newRecording", blob, fileName);
      formData.set("title", fileName);
      formData.set("r_u_number", "r0790938");
      axios({
        method: "POST",
        url: "http://localhost:3001/videos",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((result) => {
          if (result.status === 200) {
            console.log("Video uploaded.");
          } else {
            console.log("Error uploading file.");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  return (
    <Layout>
      <h1>Recording</h1>

      <Webcam className="w-100" audio={true} ref={webcamRef} muted />

      <div className="d-flex gap-2 flex-column col-md-2">
        {capturing ? (
          <Button variant="primary" onClick={handleStopCaptureClick}>
            Stop recording
          </Button>
        ) : (
          <Button variant="primary" onClick={handleStartCaptureClick}>
            Start recording
          </Button>
        )}
        {recordedChunks.length > 0 && (
          <Button variant="primary" onClick={handleUpload}>
            Upload
          </Button>
        )}
      </div>
    </Layout>
  );
};

export default Recording;
