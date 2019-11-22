import { Fetcher, graph, UpdateManager } from 'rdflib';
import { AuthService } from '../auth/services/AuthService';
import { ProfileService } from '../profile/services/ProfileService';
import { FilesService } from '../storage/services/FilesService';

const store = graph();
const fetcher = new Fetcher(store);
const updateManager = new UpdateManager(store);

export const authService = new AuthService();
export const filesService = new FilesService(fetcher);
export const profileService = new ProfileService(
  fetcher,
  updateManager,
  authService
);
export { default as FileUploader } from './components/FileUploader';
