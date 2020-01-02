import React from "react";
import logo from "./logo.svg";
import axios from "axios";
import "./App.css";

const serverPath = "http://localhost:1234/";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFile: [],
      uploadedFile: null,
      loaded: 0
    };

    this.thumbnailRef = React.createRef();

    this.upload = this.upload.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  upload(e) {
    e.preventDefault();
    const data = new FormData();
    data.append("file", this.state.selectedFile);

    axios
      .post(`${serverPath}upload`, data, {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
          });
        }
      })
      .then(res => {
        console.log(res.statusText);
      })
      .catch(err => console.log(err));
  }

  onChangeHandler(e) {
    const reader = new FileReader();
    this.setState({
      selectedFile: e.target.files[0],
      loaded: 0
    });

    reader.onload = e => {
      this.thumbnailRef.current.src = e.target.result;
    };

    reader.readAsDataURL(e.target.files[0]);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>

        <div>
          <form method="post">
            <label>
              Choose file
              <input type="file" name="file" onChange={this.onChangeHandler} />
            </label>
          </form>
          <button type="button" onClick={this.upload}>
            Upload{" "}
            {this.state.loaded !== 0 &&
              this.state.loaded !== 100 &&
              `${this.state.loaded.toFixed(1)}%`}
          </button>

          <img ref={this.thumbnailRef} src={""} alt="" />
        </div>
      </div>
    );
  }
}

export default App;
