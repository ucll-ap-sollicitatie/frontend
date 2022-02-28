import type { GetStaticProps, NextPage } from "next";
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
import router from "next/router";
import { Stopwatch } from "ts-stopwatch";
import { milisecondsToReadableTime } from "../../helpers/helperFunctions";
import User from "../../interfaces/User";

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question-categories`);
  const categories: QuestionCategory[] = await res.json();

  return {
    props: { categories: categories },
  };
};

interface Props {
  categories: QuestionCategory[];
}

// @ts-ignore
const Recording: NextPage<Props> = ({ categories }) => {
  const { data: session } = useSession();
  if (!session || session.user === undefined) return <Unauthenticated />;
  const user = session.user as User;

  const webcamRef = useRef<Webcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [maxChars, setMaxChars] = useState(0);

  const [choosingQuestions, setChoosingQuestions] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const stopwatch = useRef<Stopwatch | null>(null);
  const [previousTime, setPreviousTime] = useState(0);
  const [previousQuestion, setPreviousQuestion] = useState(0);
  const [subtitleCount, setSubtitleCount] = useState<number>(1);
  const [subtitles, setSubtitles] = useState<string>("");

  const handleStartCaptureClick = () => {
    if (webcamRef.current === null || webcamRef.current.stream === null) return;
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
    mediaRecorderRef.current.start();
    stopwatch.current = new Stopwatch();
    stopwatch.current.start(true);
    setSubtitleCount(1);
    setSubtitles("");
    setPreviousTime(0);
    console.log("started recording");
  };

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = () => {
    if (mediaRecorderRef.current !== null && stopwatch.current !== null) {
      mediaRecorderRef.current.stop();
      setCapturing(false);
      stopwatch.current.stop();
      let data = `${subtitleCount}\n${milisecondsToReadableTime(previousTime)} --> ${milisecondsToReadableTime(stopwatch.current.getTime())}\nVraag ${
        previousQuestion + 1
      }: ${questions[previousQuestion].question}`;
      setSubtitles(subtitles + data);
    }
  };

  const handleSelect = (selectedIndex: number) => {
    if (stopwatch != null) {
      if (stopwatch.current?.getState() == "RUNNING") {
        let data = `${subtitleCount}\n${milisecondsToReadableTime(previousTime)} --> ${milisecondsToReadableTime(stopwatch.current.getTime())}\nVraag ${
          previousQuestion + 1
        }: ${questions[previousQuestion].question}\n\n`;
        setSubtitles(subtitles + data);
        setPreviousTime(stopwatch.current.getTime());
        setSubtitleCount(subtitleCount + 1);
        console.log("u moeder");
      }
    }
    setPreviousQuestion(selectedIndex);
  };

  const handleUploadClick = () => {
    setUploading(true);
    console.log(subtitles);
  };

  const handleBackClick = useCallback(() => {
    setUploading(false);
  }, [setUploading]);

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;

    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });

      const url = URL.createObjectURL(blob);
      const formData = new FormData();
      const fileName = target.file_title.value;
      const description = target.description.value;
      const prive = target.privateCheckbox.checked;

      formData.append("newRecording", blob, fileName);
      formData.set("description", description);
      formData.set("title", fileName);
      formData.set("private", prive);
      formData.set("r_u_number", user.r_u_number);
      formData.set("email", user.email);
      formData.set("subtitles", subtitles);

      axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_API_URL}/videos`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((result) => {
          if (result.status === 201) {
            router.push(
              {
                pathname: `/profile`,
                query: { toast: "Video geupload" },
              },
              `/videos`
            );
          } else {
            router.push(
              {
                pathname: `/recording`,
                query: { toast: "Video upload gefaald" },
              },
              `/recording`
            );
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

  const handleRandomClick = useCallback(async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions/random/${session.user?.email}`);

    if (res.status !== 200) {
      setError(true);
    } else {
      const data = await res.json();
      setQuestions(data);
      setChoosingQuestions(false);
    }
  }, [setChoosingQuestions]);

  const handleCategoryClick = async (category: QuestionCategory) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions/category/${category.question_category_id}`);

    if (res.status !== 200) {
      setError(true);
    } else {
      const data = await res.json();
      setQuestions(data);
      setChoosingQuestions(false);
    }
  };

  const handleGoToQuestionsClick = useCallback(() => {
    setChoosingQuestions(true);
  }, [setChoosingQuestions]);

  if (choosingQuestions)
    return (
      <Layout>
        <h1>Recording</h1>
        <div className="d-flex">
          <Button variant="primary" onClick={handleRandomClick}>
            Random Questions
          </Button>
          <DropdownButton id="dropdown-basic-button" title="Kies Categorie">
            {categories.map((category: QuestionCategory) => (
              <Dropdown.Item onClick={() => handleCategoryClick(category)}>{category.category}</Dropdown.Item>
            ))}
          </DropdownButton>
        </div>
      </Layout>
    );

  if (!choosingQuestions)
    return (
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
                <Form.Group controlId="file_title">
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
                    <Form.Check type="checkbox" label="Privé" defaultChecked />
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
                {/* <ReactStopwatch
                autostart={false}
                seconds={0}
                minutes={0}
                hours={0}
                render={({ formatted }) => {
                  return (
                    <div>
                      <p>
                        Formatted: { formatted }
                      </p>
                    </div>
                  );
                }}
              /> */}
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
                  <Carousel onSelect={handleSelect} interval={null} variant="dark" wrap={false}>
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
