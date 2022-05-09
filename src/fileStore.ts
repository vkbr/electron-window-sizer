import { app } from 'electron';
import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { SettingsStore } from './types';

export type CreateFileStoreOptions = {
  fileDir?: string;
  fileName?: string;
};

const DEFAULT_FILE_NAME = 'settings.json';

const getFilePath = ({
  fileDir = app.getPath('userData'),
  fileName = DEFAULT_FILE_NAME,
}: CreateFileStoreOptions) => {
  return join(fileDir, fileName);
};

export function createFileStore<T extends object>(
  options: CreateFileStoreOptions = {},
): SettingsStore<T> {
  const filePath = getFilePath(options);
  return {
    get: (): Promise<T> =>
      readFile(filePath)
        .then((data) => data.toString('utf-8'))
        .then((txt) => JSON.parse(txt))
        .catch((err) => {
          console.error(`Cannot read file ${filePath}: ${err}`);
          return null;
        }),
    set: async (data: object) => writeFile(filePath, JSON.stringify(data)),
  };
}
