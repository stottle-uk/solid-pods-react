import React from 'react';
import { useObservable } from 'rxjs-hooks';
import { FileUploader, profileService } from '../../shared';

const useProfileCard = () =>
  useObservable(() => profileService.profileCard$, undefined, []);

const UserProfile: React.FC = () => {
  const profile = useProfileCard();

  const updateProfile = () =>
    profileService.updateProfileCardValue({
      statement: 'fn',
      value: 'Stuart Tottle' + new Date().getTime()
    });

  const onFilesSelected = (files: FileList) =>
    profileService.updateProfileCardImage(files);

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
