import type { NextPage } from "next";
import React from "react";
import {
  RecordWebcam,
  useRecordWebcam,
  CAMERA_STATUS
} from "react-record-webcam";
import type {
  WebcamRenderProps,
  RecordWebcamOptions,
  RecordWebcamHook
} from "react-record-webcam";
import Link from "next/link";
import Layout from "../../components/layout/Layout";

const OPTIONS: RecordWebcamOptions = {
    filename: "test-filename",
    fileType: "mp4",
    width: 500,
    height: 300
  };

const Recording: NextPage = () => {
  const recordWebcam: RecordWebcamHook = useRecordWebcam(OPTIONS);

  //var previewVideo = document.getElementById("previewVideo");

  function playPreviewVideo() {
    //previewVideo.play();
  };

  function pausePreviewVideo() {
    //previewVideo.pause();
  };

  return (
    <>
      <Layout>
        <h1>Slim op sollicitatie</h1>
        <div className="demo-section">
            <h1>Hooks demo</h1>
            <video id="recordingVideo"
            ref={recordWebcam.webcamRef}
            style={{
                display: `${
                recordWebcam.status === CAMERA_STATUS.OPEN ||
                recordWebcam.status === CAMERA_STATUS.RECORDING
                    ? "block"
                    : "none"
                }`
            }}
            autoPlay
            muted
            />
            <video id="previewVideo"
            ref={recordWebcam.previewRef}
            style={{
                display: `${
                    recordWebcam.status === CAMERA_STATUS.PREVIEW ? "block" : "none"
                }`
            }}
            
            />
            <div>
            <button
                className="btn btn-primary"
                hidden={
                recordWebcam.status === CAMERA_STATUS.OPEN ||
                recordWebcam.status === CAMERA_STATUS.RECORDING ||
                recordWebcam.status === CAMERA_STATUS.PREVIEW
                }
                onClick={recordWebcam.open}
            >
                Open camera
            </button>
            <button
                hidden={
                recordWebcam.status === CAMERA_STATUS.CLOSED ||
                recordWebcam.status === CAMERA_STATUS.PREVIEW
                }
                onClick={recordWebcam.close}
                className="btn btn-primary"
            >
                Close camera
            </button>
            <button
                hidden={
                recordWebcam.status === CAMERA_STATUS.CLOSED ||
                recordWebcam.status === CAMERA_STATUS.RECORDING ||
                recordWebcam.status === CAMERA_STATUS.PREVIEW
                }
                onClick={recordWebcam.start}
                className="btn btn-primary"
            >
                Start recording
            </button>
            <button
                hidden={recordWebcam.status !== CAMERA_STATUS.RECORDING}
                onClick={recordWebcam.stop}
                className="btn btn-primary"
            >
                Stop recording
            </button>
            <button
                hidden={recordWebcam.status !== CAMERA_STATUS.PREVIEW}
                onClick={recordWebcam.retake}
                className="btn btn-primary"
            >
                Retake
            </button>
            <button
                hidden={recordWebcam.status !== CAMERA_STATUS.PREVIEW}
                onClick={recordWebcam.download}
                className="btn btn-primary"
            >
                Download
            </button>
            <button
                id="PlayPreview"
                hidden={recordWebcam.status !== CAMERA_STATUS.PREVIEW}
                onClick={() => playPreviewVideo()}
                className="btn btn-primary"
            >
                Play Preview
            </button>
            <button
                id="PausePreview"
                hidden={recordWebcam.status !== CAMERA_STATUS.PREVIEW}
                onClick={() => pausePreviewVideo()}
                className="btn btn-primary"
            >
                Pause Preview
            </button>
            </div>
        </div>
      </Layout>
    </>
  );
};

export default Recording;
