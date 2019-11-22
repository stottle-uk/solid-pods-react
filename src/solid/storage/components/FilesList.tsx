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

  const addFolder = () => {
    filesService.addFolder('newFolder3');
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
          </div>
        );
      })}
      {/* <pre>{JSON.stringify(files, undefined, 2)}</pre> */}
    </div>
  );
};

export default FilesList;
