import React, { useEffect, useState } from 'react';
import { FilesService } from '../services/FilesService';

const FilesList: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);
  const getFilesEffect = () => {
    const service = new FilesService();
    service
      .getFiles()

      .then((files: any) => {
        console.log(files);
        setFiles(files);
      });
  };
  useEffect(getFilesEffect, []);

  const deleteFile = (file: string) => {
    const service = new FilesService();
    service.deleteFile(file);
  };

  const downloadFile = (file: string) => {
    const service = new FilesService();
    service.getFile(file);
  };

  const addFolder = () => {
    const service = new FilesService();
    service.addFolder('https://stottle.inrupt.net/private/newFolder2/1/2/3/4');
  };

  return (
    <div className="files-list">
      <button onClick={() => addFolder()}>add</button>
      {files.map(f => {
        return (
          <div key={f.object.value}>
            <a href={f.object.value}>{f.object.value}</a>
            <button onClick={() => deleteFile(f.object.value)}>delete</button>
            <button onClick={() => downloadFile(f.object.value)}>
              download
            </button>
          </div>
        );
      })}
      {/* <pre>{JSON.stringify(files, undefined, 2)}</pre> */}
    </div>
  );
};

export default FilesList;
