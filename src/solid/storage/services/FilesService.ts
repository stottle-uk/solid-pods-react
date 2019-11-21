import { Fetcher, Namespace, sym } from 'rdflib';
import auth from 'solid-auth-client';

export class FilesService {
  constructor(private store: any) {}

  getFiles() {
    const folder = sym('https://stottle.solid.community/profile/');
    const fetcher = new Fetcher(this.store);
    const LDP = Namespace('http://www.w3.org/ns/ldp#');

    return fetcher
      .load(folder)
      .then(() => this.store.match(folder, LDP('contains')));
  }

  deleteFile(filePath: string) {
    auth.fetch(filePath, {
      method: 'DELETE'
    });
  }

  getFile(filePath: string) {
    auth.fetch(filePath, {
      method: 'GET'
    });
  }

  addFolder(root: string) {
    auth.fetch(`${root}/.dummy`, {
      method: 'PUT',
      headers: {
        credentials: 'include'
      }
    });
  }

  deleteFolder(filePath: string) {
    auth.fetch(filePath, {
      method: 'DELETE'
    });
  }

  uploadFiles(files: FileList) {
    const reader = new FileReader();

    const file = files.item(0);

    if (file) {
      reader.onload = f => {
        if (f.target) {
          const data = f.target.result;

          const newFileName = new Date().getTime() + file.name;

          // Get destination file url
          const fileBase = 'https://stottle.solid.community/private';
          const destinationUri = `${fileBase}/${encodeURIComponent(
            newFileName
          )}`;

          auth.fetch(destinationUri, {
            method: 'PUT',
            headers: {
              'content-type': file.type,
              credentials: 'include'
            },
            body: data
          });
        }
      };

      reader.readAsArrayBuffer(file);
    }
  }
}
