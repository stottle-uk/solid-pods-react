import { graph } from 'rdflib';
import { AuthService } from '../auth/services/AuthService';
import { ProfileService } from '../profile/services/ProfileService';
import { FilesService } from '../storage/services/FilesService';

export const store = graph();
export const authService = new AuthService(store);
export const filesService = new FilesService(store);
export const profileService = new ProfileService(store, authService);
export { default as FileUploader } from './components/FileUploader';
