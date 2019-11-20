import React, { useRef } from 'react';
import { FilesService } from '../services/FilesService';

const FileUploader: React.FC = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const uploadFiles = (files: FileList | null) => {
    const service = new FilesService();
    files && service.uploadFiles(files);
  };

  const showFileDialog = () =>
    inputFileRef.current && inputFileRef.current.click();

  return (
    <div className="input-file">
      <input
        style={{ display: 'none' }}
        ref={inputFileRef}
        type="file"
        multiple={true}
        onChange={e => uploadFiles(e.target.files)}
      />
      <button onClick={() => showFileDialog()}>
        Click here to Upload File
      </button>
    </div>
  );
};

export default FileUploader;
