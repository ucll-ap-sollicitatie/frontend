import type { GetStaticProps, NextPage } from "next";
import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { useRef, useCallback } from "react";
import { Breadcrumb, Button, Stack, Alert } from "react-bootstrap";
import { Question } from "../../interfaces/Question";
import { QuestionCategory } from "../../interfaces/QuestionCategory";
import { Stopwatch } from "ts-stopwatch";
import { milisecondsToReadableTime } from "../../helpers/helperFunctions";
import Webcam from "react-webcam";
import Layout from "../../components/layout/Layout";
import axios from "axios";
import router from "next/router";
import Unauthenticated from "../../components/Unauthenticated";
import React from "react";
import ChoosingQuestions from "../../components/recording/ChoosingQuestions";
import RecordingUploadForm from "../../components/recording/RecordingUploadForm";
import CarouselNoQuestions from "../../components/recording/CarouselNoQuestions";
import CarouselWithQuestions from "../../components/recording/CarouselWithQuestions";
import User from "../../interfaces/User";
import SpinnerComponent from "../../components/SpinnerComponent";
import { useTranslations } from "next-intl";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
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

// @ts-ignore
const Recording: NextPage<Props> = ({ categories }) => {
  const t = useTranslations("recording");
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
  const [previousTime, setPreviousTime] = useState(0);
  const [previousQuestion, setPreviousQuestion] = useState(0);
  const [subtitleCount, setSubtitleCount] = useState<number>(1);
  const [subtitles, setSubtitles] = useState<string>("");
  const { data: session } = useSession();

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
  };

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

    setUploading(true);

    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const target = event.target as HTMLFormElement;
      const formData = new FormData();
      const fileName = target.file_title.value;
      const description = target.description.value;
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
        .catch(() => {
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
    const res = await fetch(`http://localhost:3001/questions/category/${category.question_category_id}`);
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
          <Button variant="primary" className="w-25" onClick={handleStartCaptureClick}>
            {t("start_recording")}
          </Button>
          <Button variant="light" onClick={handleGoToQuestionsClick}>
            {t("back_to_categories")}
          </Button>
        </>
      );
    } else {
      return (
        <Button variant="primary" className="w-25" onClick={handleStopCaptureClick}>
          {t("stop_recording")}
        </Button>
      );
    }
  };

  return (
    <Layout>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Interview opname</Breadcrumb.Item>
      </Breadcrumb>

      <h1>{t("title")}</h1>

      {viewChoosingQuestions()}
      <Alert variant="danger" onClose={() => setShow(false)} show={show} transition={true} dismissible>
        <Alert.Heading>{e("error_title")}</Alert.Heading>
        <span>{error}</span>
      </Alert>
      {readyToUpload()}

      {!choosingQuestions && !ready && (
        <div>
          <Stack direction="horizontal">
            <Webcam onUserMedia={() => setWebCamReady(true)} className="border rounded" audio={true} height={480} ref={webcamRef} width={640} muted />
            {viewCarousel()}
          </Stack>
          <div className="w-50 d-flex justify-content-between mt-3">
            {captureButtons()}
            {recordedChunks.length > 0 && webCamReady && (
              <Button variant="primary" onClick={handleUploadClick}>
                {t("continue")}
              </Button>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Recording;
