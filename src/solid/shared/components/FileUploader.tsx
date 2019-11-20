import React, { useRef } from 'react';

interface OwnProps {
  onFilesSelected: (files: FileList) => void;
}

const FileUploader: React.FC<OwnProps> = ({ onFilesSelected }) => {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const uploadFiles = (files: FileList | null) => {
    files && onFilesSelected(files);
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
