import { useState } from "react";

export function Upload(recordedChunks: any & never[]) {
    const [publicId, setPublicId] = useState("");
    const onChange = async (event: { preventDefault: () => void; target: { files: any[]; }; }) => {
    event.preventDefault();
    console.log(recordedChunks)
    const blob = new Blob(recordedChunks[-1], {
        type: "video/webm"
    });
    const url = URL.createObjectURL(blob);
    const formData = new FormData();
    const file = url;
    formData.append("inputFile", file);
    try {
      const response = await fetch("http://localhost:3001/video-uploading", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      setPublicId(data.public_id);
    } catch (error) {
    } finally {
    }
  };
  return (
    <div>
        <button onClick={onChange}>Upload</button>
    </div>
  );
}
