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
  const stopwatch = useRef<Stopwatch | null>(null);

  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [ready, setReady] = useState(false);
  const [maxChars, setMaxChars] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const [choosingQuestions, setChoosingQuestions] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);

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
      }
    }
    setPreviousQuestion(selectedIndex);
  };

  const handleUploadClick = () => {
    setReady(true);
  };

  const handleBackClick = useCallback(() => {
    setReady(false);
  }, [setReady]);

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
        setError("Titel mag geen '?' of '#' bevatten.");
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
              query: { toast: "Video geupload" },
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
              query: { toast: "Video upload gefaald" },
            },
            `/recording`
          );
        });
    }
  };

  const handleRandomClick = useCallback(async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions/random/${session.user?.email}`);

    const data = await res.json();
    setQuestions(data);
    setChoosingQuestions(false);
  }, [setChoosingQuestions]);

  const handleCategoryClick = async (category: QuestionCategory) => {
    const res = await fetch(`http://localhost:3001/questions/category/${category.question_category_id}`);
    const data = await res.json();
    setQuestions(data);
    setChoosingQuestions(false);
  };

  const handleGoToQuestionsClick = useCallback(() => {
    setRecordedChunks([]);
    setChoosingQuestions(true);
  }, [setChoosingQuestions]);

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
    if (!capturing) {
      return (
        <>
          <Button variant="primary" className="w-25" onClick={handleStartCaptureClick}>
            Begin opname
          </Button>
          <Button variant="light" onClick={handleGoToQuestionsClick}>
            Terug naar categoriekeuze
          </Button>
        </>
      );
    } else {
      return (
        <Button variant="primary" className="w-25" onClick={handleStopCaptureClick}>
          Stop opname
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
      <h1>Interview opname</h1>
      {viewChoosingQuestions()}
      <Alert variant="danger" onClose={() => setShow(false)} show={show} transition={true} dismissible>
        <Alert.Heading>Upload error</Alert.Heading>
        <span>{error}</span>
      </Alert>
      {readyToUpload()}

      {!choosingQuestions && !ready && (
        <div>
          <Stack direction="horizontal">
            <Webcam className="border rounded" audio={true} height={480} ref={webcamRef} width={640} muted />
            {viewCarousel()}
          </Stack>
          <div className="w-50 d-flex justify-content-between mt-3">
            {captureButtons()}
            {recordedChunks.length > 0 && (
              <Button variant="primary" onClick={handleUploadClick}>
                Verdergaan
              </Button>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Recording;