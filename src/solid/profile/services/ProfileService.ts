import { Fetcher, Namespace, st, sym, UpdateManager } from 'rdflib';
import { combineLatest, from, merge, Observable, Subject } from 'rxjs';
import { map, mergeMap, startWith, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../auth/services/AuthService';
import { fileReader } from '../../shared/operators/operators';
import { ProfileCard, UpdateProfileCard } from '../types/profile';

export class ProfileService {
  private updateProfileCardValueInner$ = new Subject<UpdateProfileCard>();
  private uploadQueueInner$ = new Subject<FileList>();

  profileImageUpdate$ = this.uploadQueue$.pipe(
    switchMap(file => this.updateProfileImage(file))
  );

  profileCardUpdate$ = merge(
    this.updateProfileCardValue$,
    this.profileImageUpdate$
  ).pipe(
    switchMap(value => this.updateProfile(value.statement, value.value)),
    startWith('')
  );

  profileCard$ = combineLatest(
    this.authService.webId$,
    this.profileCardUpdate$
  ).pipe(
    map(([webId]) => webId),
    switchMap(webId => this.getProfile(webId))
  );

  get updateProfileCardValue$() {
    return this.updateProfileCardValueInner$.asObservable();
  }

  get uploadQueue$() {
    return this.uploadQueueInner$
      .asObservable()
      .pipe(mergeMap(files => from(files)));
  }

  constructor(
    private fetcher: Fetcher,
    private updateManager: UpdateManager,
    private authService: AuthService
  ) {}

  updateProfileCardValue(value: UpdateProfileCard) {
    this.updateProfileCardValueInner$.next(value);
  }

  updateProfileCardImage(files: FileList) {
    this.uploadQueueInner$.next(files);
  }

  private getProfile(webId: string): Observable<ProfileCard> {
    const VCARD = Namespace('http://www.w3.org/2006/vcard/ns#');
    const person = webId;
    return from(this.fetcher.load(person)).pipe(
      map(() => {
        const personSym = sym(person);
        const fullName = this.fetcher.store.any(personSym, VCARD('fn'));
        const hasPhoto = this.fetcher.store.any(personSym, VCARD('hasPhoto'));
        const note = this.fetcher.store.any(personSym, VCARD('note'));
        const organizationName = this.fetcher.store.any(
          personSym,
          VCARD('organization-name')
        );
        return {
          fullName,
          hasPhoto,
          note,
          organizationName
        };
      })
    );
  }

  private updateProfileImage(file: File): Observable<UpdateProfileCard> {
    return fileReader(file).pipe(
      switchMap(data => {
        const fileBase = 'https://stottle.solid.community/profile';
        const destinationUri = `${fileBase}/${encodeURIComponent(file.name)}`;
        const doc = sym(destinationUri);

        return from(this.fetcher.createIfNotExists(doc, file.type, data)).pipe(
          map(() => ({
            statement: 'hasPhoto',
            value: destinationUri
          }))
        );
      })
    );
  }

  private updateProfile(statement: string, value: string) {
    const VCARD = Namespace('http://www.w3.org/2006/vcard/ns#');
    const me = this.fetcher.store.sym(
      'https://stottle.solid.community/profile/card#me'
    );
    let ins = st(me, VCARD(statement), value, me.doc());
    let del = this.fetcher.store.statementsMatching(
      me,
      VCARD(statement),
      null,
      me.doc()
    );
    return this.update(del, ins).pipe(tap(console.log));
  }

  private update(del: any, ins: any) {
    return new Observable<string>(observer => {
      this.updateManager.update(
        del,
        ins,
        (uri: string, ok: boolean, message: string) => {
          if (ok) {
            observer.next(message);
          } else {
            observer.error(message);
          }
        }
      );
    });
  }
}
