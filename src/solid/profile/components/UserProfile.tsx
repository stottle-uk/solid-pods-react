import React, { useEffect } from 'react';
import { useObservable } from 'rxjs-hooks';
import { FileUploader, profileService } from '../../shared';

const UserProfile: React.FC = () => {
  const profile = useObservable(
    () => profileService.profileCard$,
    undefined,
    []
  );
  const getProfileEffect = () => {
    profileService.getProfileCard(
      'https://stottle.solid.community/profile/card#me'
    );
  };
  useEffect(getProfileEffect, []);

  const updateProfile = () => {
    profileService.updateProfile('fn', 'Stuart Tottle').subscribe(console.log);
  };

  const onFilesSelected = (files: FileList) => {
    profileService.updateProfileImage(files).subscribe(console.log);
  };

  return (
    <div>
      {profile && profile.hasPhoto && (
        <img src={profile.hasPhoto.value} alt="Profile" />
      )}
      <div>
        <FileUploader onFilesSelected={onFilesSelected} />
      </div>
      <pre>{JSON.stringify(profile, undefined, 2)}</pre>
      <button onClick={() => updateProfile()}>Update</button>
    </div>
  );
};

export default UserProfile;

/*

@prefix : <#>.
@prefix sto: </>.
@prefix pro: <./>.
@prefix n0: <http://xmlns.com/foaf/0.1/>.
@prefix schem: <http://schema.org/>.
@prefix n: <http://www.w3.org/2006/vcard/ns#>.
@prefix n1: <http://www.w3.org/ns/auth/acl#>.
@prefix ldp: <http://www.w3.org/ns/ldp#>.
@prefix inbox: </inbox/>.
@prefix sp: <http://www.w3.org/ns/pim/space#>.
@prefix terms: <http://www.w3.org/ns/solid/terms#>.

pro:card a n0:PersonalProfileDocument; n0:maker :me; n0:primaryTopic :me.

:me
    a schem:Person, n0:Person;
    n:fn "new name 1574285021789";
    n:hasPhoto "4807 TRO.jpg";
    n:note "ffdffdfd";
    n:organization-name "The org";
    n:role "The role";
    n1:trustedApp
            [
                n1:mode n1:Append, n1:Control, n1:Read, n1:Write;
                n1:origin <http://localhost:3000>
            ],
            [
                n1:mode n1:Append, n1:Control, n1:Read, n1:Write;
                n1:origin <http://localhost:9000>
            ],
            [
                n1:mode n1:Append, n1:Control, n1:Read, n1:Write;
                n1:origin <https://generator.inrupt.com>
            ];
    ldp:inbox inbox:;
    sp:preferencesFile </settings/prefs.ttl>;
    sp:storage sto:;
    terms:account sto:;
    terms:privateTypeIndex </settings/privateTypeIndex.ttl>;
    terms:publicTypeIndex </settings/publicTypeIndex.ttl>;
    n0:name "Stuart Tottle".
*/
