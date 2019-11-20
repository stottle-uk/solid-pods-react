import { graph } from 'rdflib';
import { ProfileService } from '../profile/services/ProfileService';
import { FilesService } from '../storage/services/FilesService';

export const store = graph();
export const filesService = new FilesService(store);
export const profileService = new ProfileService(store);
export { default as FileUploader } from './components/FileUploader';
