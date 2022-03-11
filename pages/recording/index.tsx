import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import router from "next/router";
import { FormEvent, useCallback, useRef, useState } from "react";
import { Alert, Button, Col, Row } from "react-bootstrap";
import Webcam from "react-webcam";
import { Stopwatch } from "ts-stopwatch";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import Layout from "../../components/layout/Layout";
import PageTitleComponent from "../../components/PageTitleComponent";
import CarouselNoQuestions from "../../components/recording/CarouselNoQuestions";
import CarouselWithQuestions from "../../components/recording/CarouselWithQuestions";
import ChoosingQuestions from "../../components/recording/ChoosingQuestions";
import CountDown from "../../components/recording/Countdown";
import RecordingUploadForm from "../../components/recording/RecordingUploadForm";
import SpinnerComponent from "../../components/SpinnerComponent";
import Unauthenticated from "../../components/Unauthenticated";
import { milisecondsToReadableTime } from "../../helpers/helperFunctions";
import Question from "../../interfaces/Question";
import QuestionCategory from "../../interfaces/QuestionCategory";
import User from "../../interfaces/User";

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question-categories`);
  const categories: QuestionCategory[] = await res.json();

  return {
    props: {
      categories: categories,
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
};

interface Props {
  categories: QuestionCategory[];
}

const webCamConstraints = {
  facingMode: "user",
  height: 480,
  width: 640,
};

const Recording: NextPage<Props> = ({ categories }) => {
  const t = useTranslations("recording");
  const i = useTranslations("interviews");
  const e = useTranslations("errors");

  const webcamRef = useRef<Webcam | null>(null);
  webcamRef.current?.stream?.getVideoTracks()[0].applyConstraints(webCamConstraints);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const stopwatch = useRef<Stopwatch | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [ready, setReady] = useState(false);
  const [maxChars, setMaxChars] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [webCamReady, setWebCamReady] = useState(false);
  const [choosingQuestions, setChoosingQuestions] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [category, setCategory] = useState<QuestionCategory>();
  const [previousTime, setPreviousTime] = useState(0);
  const [previousQuestion, setPreviousQuestion] = useState(0);
  const [subtitleCount, setSubtitleCount] = useState<number>(1);
  const [subtitles, setSubtitles] = useState<string>("");
  const { data: session } = useSession();
  const title = t("title");

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleBackClick = useCallback(() => {
    setReady(false);
  }, [setReady]);

  const handleGoToQuestionsClick = useCallback(() => {
    setRecordedChunks([]);
    setChoosingQuestions(true);
    setWebCamReady(false);
  }, [setChoosingQuestions]);

  const handleRandomClick = useCallback(async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions/random/${session?.user?.email}`);

    const data = await res.json();
    setQuestions(data);
    setChoosingQuestions(false);
  }, [session?.user?.email, setChoosingQuestions]);

  if (!session || session.user === undefined) return <Unauthenticated />;
  const user = session.user as User;

  const handleStartCaptureClick = () => {
    if (webcamRef.current === null || webcamRef.current.stream === null) return;
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
    mediaRecorderRef.current.start();
    stopwatch.current = new Stopwatch();
    stopwatch.current.start(true);
    setCapturing(true);
    setSubtitleCount(1);
    setSubtitles("");
    setPreviousTime(0);
  };

  const handleStopCaptureClick = () => {
    if (mediaRecorderRef.current !== null && stopwatch.current !== null) {
      setCapturing(false);
      mediaRecorderRef.current.stop();
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
      }
    }
    setPreviousQuestion(selectedIndex);
  };

  const handleUploadClick = () => {
    setReady(true);
    setWebCamReady(false);
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploading(true);

    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const target = event.target as HTMLFormElement;
      const formData = new FormData();
      const fileName = target.file_title.value.trim();
      const description = target.description.value.trim();
      const prive = target.privateCheckbox.checked;

      if (fileName.includes("#") || fileName.includes("?")) {
        setUploading(false);
        setError(t("recording_error_title"));
        setShow(true);
        return;
      }

      formData.append("newRecording", blob, fileName);
      formData.set("description", description);
      formData.set("title", fileName);
      formData.set("private", prive);
      formData.set("email", user.email);
      formData.set("user_id", user.user_id.toString());
      formData.set("subtitles", subtitles);

      axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_API_URL}/videos`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(() => {
          setUploading(false);
          window.URL.revokeObjectURL(url);
          setRecordedChunks([]);
          setReady(false);
          router.push(
            {
              pathname: `/profile`,
              query: { toast: t("upload_success") },
            },
            `/videos`
          );
        })
        .catch((err) => {
          if (err.response.status === 409) {
            setUploading(false);
            setError(t("recording_error_duplicate"));
            setShow(true);
            return;
          }
          setUploading(false);
          window.URL.revokeObjectURL(url);
          setReady(false);
          router.push(
            {
              pathname: `/recording`,
              query: { toast: t("upload_failed") },
            },
            `/recording`
          );
        });
    }
  };

  const handleCategoryClick = async (category: QuestionCategory) => {
    setCategory(category);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions/category/${category.question_category_id}`);
    const data = await res.json();
    setQuestions(data);
    setChoosingQuestions(false);
  };

  const viewChoosingQuestions = () => {
    if (choosingQuestions) {
      return <ChoosingQuestions handleRandomClick={handleRandomClick} categories={categories} handleCategoryClick={handleCategoryClick} />;
    }
  };

  const readyToUpload = () => {
    if (ready) {
      return (
        <RecordingUploadForm
          handleUpload={handleUpload}
          setMaxChars={setMaxChars}
          maxChars={maxChars}
          handleBackClick={handleBackClick}
          setUploading={setUploading}
          uploading={uploading}
        />
      );
    }
  };

  const viewCarousel = () => {
    if (questions.length > 0) {
      return <CarouselWithQuestions handleSelect={handleSelect} questions={questions} />;
    } else {
      return <CarouselNoQuestions />;
    }
  };

  const captureButtons = () => {
    if (!webCamReady) {
      return <SpinnerComponent />;
    }
    if (!capturing) {
      return (
        <>
          <div className="d-flex gap-2 flex-wrap">
            <Button variant="primary" onClick={handleStartCaptureClick}>
              {t("start_recording")}
            </Button>
            <Button variant="primary" onClick={handleUploadClick} disabled={!(recordedChunks.length > 0 && webCamReady)}>
              {t("continue")}
            </Button>
          </div>
        </>
      );
    } else {
      return (
        <Button variant="primary" onClick={handleStopCaptureClick}>
          {t("stop_recording")}
        </Button>
      );
    }
  };

  const breadcrumb_items = [{ text: t("title") }];

  return (
    <Layout>
      <BreadcrumbComponent items={breadcrumb_items} />

      <PageTitleComponent title={title} />

      <h1>
        {t("title")} {capturing && <CountDown handleStopCaptureClick={handleStopCaptureClick} />}
      </h1>

      {viewChoosingQuestions()}
      <Alert variant="danger" onClose={() => setShow(false)} show={show} transition={true} dismissible>
        <Alert.Heading>{e("error_title")}</Alert.Heading>
        <span>{error}</span>
      </Alert>
      {readyToUpload()}
      {!choosingQuestions && !ready && (
        <>
          <span>
            {i("category")}: {category?.category}
          </span>
          <p>
            {i("description")}: {category?.description}
          </p>

          <Row md={1} xl={2}>
            <Col>
              <Webcam onUserMedia={() => setWebCamReady(true)} className="border rounded mb-2" audio={true} ref={webcamRef} muted />
              {captureButtons()}
            </Col>
            <Col className="d-flex align-items-center">{viewCarousel()}</Col>
          </Row>
        </>
      )}
    </Layout>
  );
};

export default Recording;
