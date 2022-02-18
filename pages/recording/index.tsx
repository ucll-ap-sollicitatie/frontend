import type { NextPage } from "next";
import React from "react";
import Webcam from "react-webcam";
import Link from "next/link";
import Layout from "../../components/layout/Layout";
import { Upload } from "../../components/layout/Upload";

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };


const Recording: NextPage = () => {
    const webcamRef = React.useRef(null);
    const mediaRecorderRef = React.useRef(null);
    const [capturing, setCapturing] = React.useState(false);
    const [recordedChunks, setRecordedChunks] = React.useState([]);
  
    const handleStartCaptureClick = React.useCallback(() => {
      setCapturing(true);
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: "video/webm"
      });
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.start();
    }, [webcamRef, setCapturing, mediaRecorderRef]);
  
    const handleDataAvailable = React.useCallback(
      ({ data }) => {
        if (data.size > 0) {
          setRecordedChunks((prev) => prev.concat(data));
        }
      },
      [setRecordedChunks]
    );
  
    const handleStopCaptureClick = React.useCallback(() => {
      mediaRecorderRef.current.stop();
      setCapturing(false);
    }, [mediaRecorderRef, webcamRef, setCapturing]);
  
    const handleDownload = React.useCallback(() => {
      if (recordedChunks.length) {
        const blob = new Blob(recordedChunks, {
          type: "video/webm"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = "react-webcam-stream-capture.webm";
        a.click();
        window.URL.revokeObjectURL(url);
        setRecordedChunks([]);
      }
    }, [recordedChunks]);


  return (
    <>
      <Layout>
        <h1>Slim op sollicitatie</h1>
        <Webcam audio={true} ref={webcamRef} muted/>
        {capturing ? (
            <button onClick={handleStopCaptureClick}>Stop Recording</button>
        ) : (
            <button onClick={handleStartCaptureClick}>Start Recording</button>
        )}
        {recordedChunks.length > 0 && (
            <Upload recordedChunks={recordedChunks} />
        )}
      </Layout>
    </>
  );
};

export default Recording;
