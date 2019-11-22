import { Fetcher, Namespace, sym } from 'rdflib';
import { combineLatest, from, merge, of, Subject } from 'rxjs';
import {
  map,
  mergeMap,
  startWith,
  switchMap,
  withLatestFrom
} from 'rxjs/operators';
import auth from 'solid-auth-client';
import { fileReader } from '../../shared/operators/operators';

export class FilesService {
  private fetcher = new Fetcher(this.store);
  private currentFolderInner$ = new Subject<string>();
  private uploadQueueInner$ = new Subject<FileList>();
  private deleteItemInner$ = new Subject<string>();
  private addFolderInner$ = new Subject<string>();

  uploadedFiles$ = this.uploadQueue$.pipe(
    mergeMap(file => this.uploadFile(file))
  );

  deletedFiles$ = this.deleteItem$.pipe(
    mergeMap(file => this.deleteItem(file))
  );

  addedFolders$ = this.addFolder$.pipe(
    mergeMap(folder => this.createFolder(folder))
  );

  actions$ = merge(
    this.uploadedFiles$,
    this.deletedFiles$,
    this.addedFolders$
  ).pipe(startWith(''));

  filesInFolder$ = combineLatest(this.currentFolder$, this.actions$).pipe(
    map(([folderName]) => folderName),
    switchMap(folder => this.getFiles(folder))
  );

  get currentFolder$() {
    return this.currentFolderInner$.asObservable().pipe(
      startWith('public'),
      map(folderName => `https://stottle.solid.community/${folderName}/`)
    );
  }

  get uploadQueue$() {
    return this.uploadQueueInner$
      .asObservable()
      .pipe(mergeMap(files => from(files)));
  }

  get deleteItem$() {
    return this.deleteItemInner$.asObservable();
  }

  get addFolder$() {
    return this.addFolderInner$.asObservable();
  }

  constructor(private store: any) {}

  uploadFiles(files: FileList) {
    this.uploadQueueInner$.next(files);
  }

  deleteFile(filePath: string) {
    this.deleteItemInner$.next(filePath);
  }

  addFolder(filePath: string) {
    this.addFolderInner$.next(filePath);
  }

  deleteFolder(filePath: string) {
    this.deleteItemInner$.next(filePath);
  }

  getFile(filePath: string) {
    auth.fetch(filePath, {
      method: 'GET'
    });
  }

  private getFiles(folderName: string) {
    const folder = sym(folderName);
    const LDP = Namespace('http://www.w3.org/ns/ldp#');

    return from(
      this.fetcher.load(folder, {
        force: true,
        clearPreviousData: true
      })
    ).pipe(
      map(() => this.store.match(folder, LDP('contains'))),
      map(res => res as any[])
    );
  }

  private uploadFile(file: File) {
    return fileReader(file).pipe(
      withLatestFrom(this.currentFolder$),
      switchMap(([data, currentFolder]) => {
        const newFileName = new Date().getTime() + file.name;

        const destinationUri = `${currentFolder}/${encodeURIComponent(
          newFileName
        )}`;

        return this.addFile(destinationUri, file.type, data);
      })
    );
  }

  private createFolder(foldername: string) {
    return of(foldername).pipe(
      withLatestFrom(this.currentFolder$),
      map(
        ([foldername, currentFolder]) => `${currentFolder}/${foldername}/.dummy`
      ),
      switchMap(folderPath =>
        this.addItem(folderPath).pipe(() => this.deleteItem(folderPath))
      )
    );
  }

  private addFile(
    filePath: string,
    contentType: string,
    data: string | ArrayBuffer | null
  ) {
    return this.fetch(filePath, {
      method: 'PUT',
      headers: {
        'content-type': contentType
      },
      body: data
    });
  }

  private addItem(path: string) {
    return this.fetch(path, {
      method: 'PUT'
    });
  }

  private deleteItem(filePath: string) {
    return this.fetch(filePath, {
      method: 'DELETE'
    });
  }

  private fetch(filePath: string, init: RequestInit) {
    return from(
      auth.fetch(filePath, {
        credentials: 'include',
        ...init
      })
    );
  }
}
