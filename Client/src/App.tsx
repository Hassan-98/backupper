import { useState } from 'react';
//= Packages
import axios from 'axios';
//= Styles
import './App.css';

axios.defaults.baseURL = 'http://localhost:9999/api'

function App() {
  const [path, setPath] = useState<string>('');

  function handlePathChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPath(event.currentTarget.value);
  }

  async function handleUploadFile(event: React.MouseEvent) {
    let button = event.currentTarget;

    button.setAttribute('disabled', 'disabled');
    try {
      const response = await axios.post('/tasks/upload-file', { path });
      console.log(response.data.data);
      alert('file uploaded successfully');
    } catch (error: any) {
      alert(error.message);
    }

    button.removeAttribute('disabled');
  }

  async function handleArchiveFile(event: React.MouseEvent) {
    let button = event.currentTarget;

    button.setAttribute('disabled', 'disabled');
    try {
      const response = await axios.post('/tasks/archive', { path });
      console.log(response.data.data);
      alert('file/folder archived successfully');
    } catch (error: any) {
      alert(error.message);
    }

    button.removeAttribute('disabled');
  }

  async function handleUpload(event: React.MouseEvent) {
    let button = event.currentTarget;
    button.setAttribute('disabled', 'disabled');

    try {
      const response = await axios.post('/tasks/upload-works');
      console.log(response.data.data);
      alert('web works files/folders uploaded successfully');
    } catch (error: any) {
      alert(error.message);
    }

    button.removeAttribute('disabled');
  }

  async function handleArchive(event: React.MouseEvent) {
    let button = event.currentTarget;
    button.setAttribute('disabled', 'disabled');

    try {
      const response = await axios.post('/tasks/archive-works');
      console.log(response.data.data);
      alert('web works files/folders archived successfully');
    } catch (error: any) {
      alert(error.message);
    }

    button.removeAttribute('disabled');
  }

  return (
    <div className="App">
      <div className="card">
        <h1>Backupper</h1>
        <p>archive and backup my web works to my google drive</p>
        <input type="text" placeholder="Type File/Folder Path" className="form-control mt-5 mb-3" onChange={handlePathChange} />
        <div>
          <button onClick={handleArchiveFile}>Archive File At Path</button>
          <button onClick={handleUploadFile} className="ms-3">Upload File At Path</button>
        </div>
        <hr className="my-5" />
        <div>
          <button onClick={handleArchive}>Archive Web Works</button>
          <button onClick={handleUpload} className="ms-3">Upload Archived Web Works</button>
        </div>
      </div>
    </div>
  )
}

export default App
