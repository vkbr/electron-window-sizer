import { BrowserWindow, Event, Rectangle } from 'electron';
import { debounce } from './debounce';
import { createFileStore } from './fileStore';
import { SettingsStore } from './types';

export type WindowStateOptions = {
  bounds: Rectangle;
  isMaximized?: boolean;
};

export type CreateWindowSizerOptions = {
  store?: SettingsStore<WindowStateOptions>;
};

const getDefaultFileStore = () => {
  return createFileStore<WindowStateOptions>({
    settingValidator: (data: object) => {
      return !data || ('bounds' in data && 'isMaximized' in data);
    },
  });
};

export const createWindowSizer = ({
  store = getDefaultFileStore(),
}: CreateWindowSizerOptions = {}) => {
  const windowSizer = {
    watch: (mainWindow: BrowserWindow) => {
      const onBoundsChange = debounce((ev: Event) => {
        const bounds = mainWindow.getBounds();
        const isMaximized = mainWindow.isMaximized();
        store.set({ bounds, isMaximized });
      });

      mainWindow.on('resized', onBoundsChange);
      mainWindow.on('moved', onBoundsChange);

      return windowSizer;
    },
    getState: async (): Promise<WindowStateOptions | null> => {
      return store.get();
    },
  };

  return windowSizer;
};
