import React, { useEffect, useState } from 'react';
import { profileService } from '../../shared';

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>();
  const getProfileEffect = () => {
    profileService
      .getProfile('https://stottle.inrupt.net/profile/card#me')
      .then((profile: any) => {
        console.log(profile);
        setProfile(profile);
      });
  };
  useEffect(getProfileEffect, []);

  const updateProfile = () => {
    profileService.updateProfile();
  };

  return (
    <div>
      {profile && <img src={profile.hasPhoto[0].object.value} alt="Profile" />}
      <pre>{JSON.stringify(profile, undefined, 2)}</pre>
      <button onClick={() => updateProfile()}>Update</button>
    </div>
  );
};

export default UserProfile;
