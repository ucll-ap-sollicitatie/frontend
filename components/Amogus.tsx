import { NextPage } from "next";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    amogus: any;
  }
}

const useAudio = (url: string) => {
  const [audio] = useState(typeof Audio !== "undefined" ? new Audio(url) : undefined);
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    if (audio) playing ? audio.play() : audio.pause();
  }, [playing, audio]);

  useEffect(() => {
    if (audio) {
      audio.addEventListener("ended", () => setPlaying(false));
      return () => {
        audio.removeEventListener("ended", () => setPlaying(false));
      };
    }
  }, [audio]);

  return [playing, toggle];
};

interface Props {
  url: string;
}

const Amogus: NextPage<Props> = ({ url }) => {
  const [_, setPlaying] = useAudio(url);

  useEffect(() => {
    class Amogus {
      constructor() {}

      sus() {
        //@ts-ignore
        setPlaying();
        document.getElementsByTagName("body")[0].style.backgroundImage = "url('/amogus.gif')";

        console.log("Imposter????");
        console.log("Kinda sus ngl");
        console.log("Sussy baka");
      }
    }

    const amogus = new Amogus();
    window.amogus = amogus;
  }, [setPlaying]);

  return <></>;
};

export default Amogus;
