import { Fetcher, Namespace, st, sym, UpdateManager } from 'rdflib';
import { from, Observable } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import auth from 'solid-auth-client';

export class ProfileService {
  constructor(private store: any) {}

  getProfile(webId: string): Promise<any> {
    const VCARD = Namespace('http://www.w3.org/2006/vcard/ns#');
    const fetcher = new Fetcher(this.store);
    const person = webId;
    return fetcher.load(person).then(() => {
      const personSym = sym(person);
      const fullName = this.store.any(personSym, VCARD('fn'));
      const hasPhoto = this.store.match(personSym, VCARD('hasPhoto'));
      const note = this.store.any(personSym, VCARD('note'));
      const organizationName = this.store.any(
        personSym,
        VCARD('organization-name')
      );
      return {
        fullName,
        hasPhoto,
        note,
        organizationName
      };
    });
  }

  updateProfileImage(files: FileList): Observable<string> {
    return from(files).pipe(
      mergeMap(file =>
        this.fileReader(file).pipe(
          switchMap(data => {
            const fileBase = 'https://stottle.solid.community/profile';
            const destinationUri = `${fileBase}/${encodeURIComponent(
              file.name
            )}`;
            return from(
              auth.fetch(destinationUri, {
                method: 'PUT',
                headers: {
                  'content-type': file.type,
                  credentials: 'include'
                },
                body: data
              })
            ).pipe(map(() => destinationUri));
          }),
          switchMap(filename => this.updateProfile('hasPhoto', filename))
        )
      )
    );
  }

  updateProfile(statement: string, value: string) {
    const VCARD = Namespace('http://www.w3.org/2006/vcard/ns#');
    const me = this.store.sym(
      'https://stottle.solid.community/profile/card#me'
    );
    let ins = st(me, VCARD(statement), value, me.doc());
    let del = this.store.statementsMatching(
      me,
      VCARD(statement),
      null,
      me.doc()
    );
    return this.update(del, ins);
  }

  private update(del: any, ins: any) {
    return new Observable<string>(observer => {
      const updater = new UpdateManager(this.store);
      updater.update(
        del,
        ins,
        (uri: string, ok: boolean, message: string, response: any) => {
          console.log(uri);

          if (ok) {
            observer.next(message);
          } else {
            observer.error(message);
          }
        }
      );
    });
  }

  private fileReader(file: File) {
    return new Observable<string | ArrayBuffer | null>(observer => {
      const reader = new FileReader();
      reader.onload = f => {
        if (f.target) {
          observer.next(f.target.result);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }
}
