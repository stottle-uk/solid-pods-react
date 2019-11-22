import { Fetcher, Namespace, sym } from 'rdflib';
import { combineLatest, from, Subject } from 'rxjs';
import { map, mergeMap, startWith, switchMap } from 'rxjs/operators';
import auth from 'solid-auth-client';
import { fileReader } from '../../shared/operators/operators';

export class FilesService {
  private currentFolderInner$ = new Subject<string>();
  private uploadQueueInner$ = new Subject<FileList>();

  uploadedFiles$ = this.uploadQueue$.pipe(
    mergeMap(file => this.uploadFile(file)),
    startWith('')
  );

  filesInFolder$ = combineLatest(this.currentFolder$, this.uploadedFiles$).pipe(
    map(([folder]) => folder),
    switchMap(folder => this.getFiles(folder))
  );

  get uploadQueue$() {
    return this.uploadQueueInner$
      .asObservable()
      .pipe(mergeMap(files => from(files)));
  }

  get currentFolder$() {
    return this.currentFolderInner$.asObservable().pipe(startWith('private'));
  }

  constructor(private store: any) {}

  uploadFiles(files: FileList) {
    this.uploadQueueInner$.next(files);
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

  private getFiles(folderName: string) {
    const folder = sym(`https://stottle.solid.community/${folderName}/`);
    const fetcher = new Fetcher(this.store);
    const LDP = Namespace('http://www.w3.org/ns/ldp#');

    return from(fetcher.load(folder)).pipe(
      map(() => this.store.match(folder, LDP('contains'))),
      map(res => res as any[])
    );
  }

  private uploadFile(file: File) {
    return fileReader(file).pipe(
      switchMap(data => {
        const newFileName = new Date().getTime() + file.name;

        // Get destination file url
        const fileBase = 'https://stottle.solid.community/private';
        const destinationUri = `${fileBase}/${encodeURIComponent(newFileName)}`;

        return from(
          auth.fetch(destinationUri, {
            method: 'PUT',
            headers: {
              'content-type': file.type,
              credentials: 'include'
            },
            body: data
          })
        );
      })
    );
  }
}
