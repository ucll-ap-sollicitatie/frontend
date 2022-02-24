import type { GetStaticProps, NextPage } from "next";
import React from "react";
import { FormEvent, useState } from "react";
import Webcam from "react-webcam";
import Layout from "../../components/layout/Layout";
import axios from "axios";
import { useSession } from "next-auth/react";
import Unauthenticated from "../../components/Unauthenticated";
import { useRef, useCallback } from "react";
import { Breadcrumb, Button, Form, OverlayTrigger, Tooltip, Col, Row, DropdownButton, Dropdown, Carousel } from "react-bootstrap";
import { Question } from "../../interfaces/Question";
import { QuestionCategory } from "../../interfaces/QuestionCategory";

// const videoConstraints = {
//   width: 1280,
//   height: 720,
//   facingMode: "user",
// };
export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`http://localhost:3001/question-categories`);
  const categories = await res.json();

  return {
    props: { categories: categories },
  };
};

interface Props {
  categories: QuestionCategory[];
}

const Recording: NextPage<Props> = ({ categories }) => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  const webcamRef = useRef<Webcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [uploading, setUploading] = React.useState(false);
  const [maxChars, setMaxChars] = React.useState(0);

  const [choosingQuestions, setChoosingQuestions] = React.useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

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
      const prive = event.target.privateCheckbox.checked;

      formData.append("newRecording", blob, fileName);
      formData.set("description", description);
      formData.set("title", fileName);
      formData.set("private", prive);
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

  const handleRandomClick = React.useCallback(async () => {
    const res = await fetch("http://localhost:3001/questions/random/random");

    if (res.status !== 200) {
      setError(true);
    } else {
      const data = await res.json();
      setQuestions(data);
      setChoosingQuestions(false);
    }
  }, [setChoosingQuestions]);

  const handleCategoryClick = async (category: QuestionCategory) => {
    const res = await fetch(`http://localhost:3001/questions/category/${category.question_category_id}`);

    if (res.status !== 200) {
      setError(true);
    } else {
      const data = await res.json();
      setQuestions(data);
      setChoosingQuestions(false);
    }
  };

  const handleGoToQuestionsClick = React.useCallback(() => {
    setChoosingQuestions(true);
  }, [setChoosingQuestions]);

  if (choosingQuestions) return (
    <Layout>
      <h1>Recording</h1>
      <div className="d-flex">
      <Button variant="primary" onClick={handleRandomClick}>
        Random Questions 
      </Button>
      <DropdownButton id="dropdown-basic-button" title="Kies Categorie">
        {categories.map(
              (category: QuestionCategory) =>
                <Dropdown.Item onClick={()=>handleCategoryClick(category)}>{category.category}</Dropdown.Item>
            )}
      </DropdownButton>
      </div>

    </Layout>
  )

  if (!choosingQuestions) return (
    <Layout>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Recording</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Recording</h1>

      {uploading ? (
        <div>
          <Form onSubmit={handleUpload} className="col-md-12 col-lg-10 col-xl-8">
            <div className="d-flex gap-4 flex-wrap">
              <Form.Group controlId="title">
                <Form.Label>Titel:</Form.Label>
                <Form.Control type="text" placeholder="e.g. Mijn interviewopname" required />
              </Form.Group>
            </div>
            <div className="gap-4 flex-wrap">
              <Form.Group controlId="description">
                <Form.Label>Omschrijving:</Form.Label>
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
            <div className="d-flex gap-4 flex-wrap">
              <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Privé: alleen lectoren kunnen u video zien</Tooltip>}>
                <Form.Group className="mb-3" controlId="privateCheckbox">
                  <Form.Check type="checkbox" label="Privé" />
                </Form.Group>
              </OverlayTrigger>
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
          <Row>
            <Col>
              <Webcam className="w-75" audio={true} ref={webcamRef} muted />

              <div className="d-flex gap-2 flex-column col-md-2">
                {capturing ? (
                  <Button variant="primary" onClick={handleStopCaptureClick}>
                    Stop recording
                  </Button>
                ) : (
                  <div className="d-flex">
                    <Button variant="primary" onClick={handleStartCaptureClick}>
                      Start recording
                    </Button>
                    <Button variant="light" className="mt-3 ms-2" onClick={handleGoToQuestionsClick}>
                      Back
                    </Button>
                  </div>
                )}
                {recordedChunks.length > 0 && (
                  <Button variant="primary" onClick={handleUploadClick}>
                    Upload
                  </Button>
                )}
              </div>
            </Col>
            <Col>
              {questions.length === 0 ? (
            <Carousel interval={null} variant="dark" wrap={false}>
              <Carousel.Item>
                <img className="d-block w-100" src="https://via.placeholder.com/800x400/f8f9fa/f8f9fa" alt="Carousel slide" />
                <Carousel.Caption>
                  <h3>Deze categorie bevat geen vragen</h3>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          ) : (
            <Carousel interval={null} variant="dark" wrap={false}>
              {questions.map((question, index) => (
                <Carousel.Item key={index}>
                  <img className="d-block w-100" src="https://via.placeholder.com/800x400/f8f9fa/f8f9fa" alt="Carousel slide" />
                  <Carousel.Caption>
                    <h3>Vraag {index + 1}</h3>
                    <h1>{question.question}</h1>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          )}
            </Col>
          </Row>
        </div>
      )}
    </Layout>
  );
};

export default Recording;
