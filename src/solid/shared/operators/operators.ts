import { Observable, Subscriber } from 'rxjs';

type ReadFileFn = (observer: Subscriber<string | ArrayBuffer | null>) => void;

const readFile = (file: File): ReadFileFn => observer => {
  const reader = new FileReader();
  reader.onload = f => {
    if (f.target) {
      observer.next(f.target.result);
    }
  };
  reader.readAsArrayBuffer(file);
};

export const fileReader = (file: File) => {
  return new Observable(readFile(file));
};
