import axios from "axios";
import React, { Component } from "react";
class App extends Component {
  state = {
    // Initially, no file is selected
    selectedFile: null,
  };

  // On file select (from the pop up)
  onFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  // On file upload (click the upload button)
  onFileUpload = () => {
    const formData = new FormData();
    formData.append("myFile", this.state.selectedFile, this.state.selectedFile.name);
    axios.post("api/uploadfile", formData);
  };

  render() {
    return (
      <div>
        <div>
          <input type="file" onChange={this.onFileChange} />
          <button onClick={this.onFileUpload}>Upload!</button>
        </div>
      </div>
    );
  }
}

export default App;
