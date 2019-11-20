import { Fetcher, Namespace, st, sym, UpdateManager } from 'rdflib';
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

  updateProfileImage(files: FileList) {
    const reader = new FileReader();

    const file = files.item(0);

    if (file) {
      reader.onload = f => {
        if (f.target) {
          const data = f.target.result;

          const newFileName = new Date().getTime() + file.name;

          // Get destination file url
          const fileBase = 'https://stottle.inrupt.net/profile';
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

  updateProfile() {
    const updater = new UpdateManager(this.store);
    const VCARD = Namespace('http://www.w3.org/2006/vcard/ns#');
    const me = this.store.sym('https://stottle.inrupt.net/profile/card#me');

    let ins = st(me, VCARD('hasPhoto'), '4807 TRO.jpg', me.doc());
    let del = this.store.statementsMatching(
      me,
      VCARD('hasPhoto'),
      null,
      me.doc()
    ); // null is wildcard
    updater.update(
      del,
      ins,
      (uri: string, ok: boolean, message: string, response: any) => {
        console.log(response);
        console.log(uri);
        console.log(ok);
        console.log(message);

        if (ok) console.log('Name changed');
        else alert(message);
      }
    );
  }
}
