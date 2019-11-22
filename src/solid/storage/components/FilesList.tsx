import React from 'react';
import { useObservable } from 'rxjs-hooks';
import { filesService, FileUploader } from '../../shared';

const useFilesInFolder = () =>
  useObservable(() => filesService.filesInFolder$, [], []);

const FilesList: React.FC = () => {
  const files = useFilesInFolder();

  const deleteFile = (file: string) => {
    filesService.deleteFile(file);
  };

  const downloadFile = (file: string) => {
    filesService.getFile(file);
  };

  const addFolder = () => {
    filesService.addFolder(
      'https://stottle.solid.community/private/newFolder2/1/2/3/4'
    );
  };

  const onFilesSelected = (files: FileList) => filesService.uploadFiles(files);

  return (
    <div className="files-list">
      <div>
        <FileUploader onFilesSelected={onFilesSelected} />
      </div>
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
