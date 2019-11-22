import { Fetcher, sym, UpdateManager } from 'rdflib';
import { from, Observable } from 'rxjs';

export class PodService {
  private fetcher = new Fetcher(this.store);
  private updateManager = new UpdateManager(this.store);

  constructor(public store: any) {}

  getItem(item: string) {
    const doc = sym(item);
    return from(
      this.fetcher.load(doc, {
        force: true,
        clearPreviousData: true
      })
    );
  }

  createItem(
    filePath: string,
    contentType: string,
    data: string | ArrayBuffer | null
  ) {
    const doc = sym(filePath);
    return from(this.fetcher.createIfNotExists(doc, contentType, data));
  }

  createFolder(currentFolder: string, folderName: string) {
    const doc = sym(`${currentFolder}/`);
    return from(this.fetcher.createContainer(doc, folderName));
  }

  updateItem(del: any, ins: any) {
    return new Observable<string>(observer => {
      this.updateManager.update(
        del,
        ins,
        (uri: string, ok: boolean, message: string) => {
          if (ok) {
            observer.next(uri);
          } else {
            observer.error(message);
          }
        }
      );
    });
  }

  deleteItem(filePath: string) {
    const doc = sym(filePath);
    return from(this.fetcher.delete(doc));
  }
}
