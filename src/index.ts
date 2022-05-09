import { BrowserWindow, Event, Rectangle } from 'electron';
import { debounce } from './debounce';
import { createFileStore } from './fileStore';
import { SettingsStore } from './types';

export type CreateWindowSizerOptions = {
  store?: SettingsStore<Rectangle>;
};

export const createWindowSizer = ({
  store = createFileStore<Rectangle>(),
}: CreateWindowSizerOptions = {}) => {
  const windowSizer = {
    watch: (mainWindow: BrowserWindow) => {
      const onBoundsChange = debounce((ev: Event) => {
        const bounds = mainWindow.getBounds();
        store.set(bounds);
      });

      mainWindow.on('resized', onBoundsChange);
      mainWindow.on('moved', onBoundsChange);

      return windowSizer;
    },
    getBounds: async (): Promise<Rectangle | null> => {
      return store.get();
    },
  };

  return windowSizer;
};
