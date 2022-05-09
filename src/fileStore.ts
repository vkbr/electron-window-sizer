import { app } from 'electron';
import { join } from 'path';
import { readFile, writeFile, rm } from 'fs/promises';
import { SettingsStore } from './types';

export type CreateFileStoreOptions = {
  fileDir?: string;
  fileName?: string;
  settingValidator?: (data: object) => boolean;
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
        .then((data) => {
          if (!options.settingValidator?.(data) ?? false) {
            return rm(filePath).finally(() => {
              throw new Error('Invalid settings in file.');
            });
          }
          return data;
        })
        .catch((err) => {
          console.error(`Cannot read file ${filePath}: ${err}`);
          return null;
        }),
    set: async (data: object) => writeFile(filePath, JSON.stringify(data)),
  };
}
