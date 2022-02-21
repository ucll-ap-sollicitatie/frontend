import type { NextPage } from "next";
import React from "react";
import { FormEvent, useState } from "react";
import Webcam from "react-webcam";
import Layout from "../../components/layout/Layout";
import axios from "axios";
import { useSession } from "next-auth/react";
import Unauthenticated from "../../components/Unauthenticated";
import { useRef, useCallback } from "react";
import { Button, Form, Stack } from "react-bootstrap";

/* const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
}; */

const Recording: NextPage = () => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  const webcamRef = useRef<Webcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [uploading, setUploading] = React.useState(false);
  const [maxChars, setMaxChars] = React.useState(0);

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
    mediaRecorderRef.current.start();
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

  const handleUploadClick = React.useCallback(() => {
    setUploading(true);
  }, [setUploading]);

  const handleBackClick = React.useCallback(() => {
    setUploading(false);
  }, [setUploading]);

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const formData = new FormData();
      const fileName = event.target.title.value;
      const description = event.target.description.value;
      formData.append("newRecording", blob, fileName);
      formData.set("description", description);
      formData.set("title", fileName);
      formData.set("r_u_number", session?.user?.r_u_number);
      formData.set("email", session.user?.email);
      axios({
        method: "POST",
        url: "http://localhost:3001/videos",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((result) => {
          if (result.status === 201) {
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
      setUploading(false);
    }
  };

  return (
    <Layout>
      <h1>Recording</h1>

      {uploading ? (
        <div>
          <Form onSubmit={handleUpload} className="col-md-12 col-lg-10 col-xl-8">
            <div className="d-flex gap-4 flex-wrap">
              <Form.Group controlId="title">
                <Form.Label>Titel</Form.Label>
                <Form.Control type="text" placeholder="e.g. Mijn interviewopname" required />
              </Form.Group>
            </div>
            <div className="gap-4 flex-wrap">
              <Form.Group controlId="description">
                <Form.Label>Omschrijving</Form.Label>
                <Form.Control
                  onChange={(e) => setMaxChars(e.target.value.length)}
                  as="textarea"
                  rows={4}
                  maxLength={255}
                  placeholder="e.g. Mijn interview voor back-end web developer"
                  required
                />
                <Form.Text className="text-muted">Karakters: {255 - maxChars}/255</Form.Text>
              </Form.Group>
            </div>
            <Button variant="primary" type="submit" className="mt-3">
              Upload
            </Button>
            <Button variant="light" className="mt-3 ms-2" onClick={handleBackClick}>
              Back
            </Button>
          </Form>
        </div>
      ) : (
        <div>
          <Webcam className="w-50" audio={true} ref={webcamRef} muted />

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
              <Button variant="primary" onClick={handleUploadClick}>
                Upload
              </Button>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Recording;
