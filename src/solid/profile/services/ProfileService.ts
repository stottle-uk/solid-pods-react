import { Fetcher, Namespace, st, sym, UpdateManager } from 'rdflib';

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

  updateProfile() {
    const updater = new UpdateManager(this.store);
    const VCARD = Namespace('http://www.w3.org/2006/vcard/ns#');
    const me = this.store.sym('https://stottle.inrupt.net/profile/card#me');

    let ins = st(me, VCARD('fn'), 'new name ' + new Date().getTime(), me.doc());
    let del = this.store.statementsMatching(me, VCARD('fn'), null, me.doc()); // null is wildcard
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
