import { graph } from 'rdflib';
import { AuthService } from '../auth/services/AuthService';
import { ProfileService } from '../profile/services/ProfileService';
import { FilesService } from '../storage/services/FilesService';
import { PodService } from './services/PodService';

const store = graph();

export const podService = new PodService(store);
export const authService = new AuthService();
export const filesService = new FilesService(podService);
export const profileService = new ProfileService(podService, authService);
export { default as FileUploader } from './components/FileUploader';
