# electron-window-sizer

Use this simple and small library to persist position and dimension of an electron app. The setting is persisted in `settings.json` file in your app's user data dir with option for provide your own store.

## Installation

Npm:

```bash
npm install electron-window-sizer
```

Yarn:

```bash
yarn add electron-window-sizer
```

## Usage

```ts
import { createWindowSizer } from 'electron-window-sizer';
import { app } from 'electron';

const windowSizer = createWindowSizer();

function createWindow() {
  const bounds = await windowSizer.getBounds(); // Read the existing window bounds

  const mainWindow = new BrowserWindow({
    show: false,
    width: bounds?.width ?? 1024,
    height: bounds?.height ?? 728,
    x: bounds?.x,
    y: bounds?.y,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  windowSizer.watch(mainWindow); // Watch the window for change in bounds.
}

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
```

## Advanced usage

You can provide your own strage for saving or modify the file store.

### Modifying the existing file store with options

```ts
import { createWindowSizer, createFileStore } from 'electron-window-sizer';

const persistantFileStore = createFileStore({
  fileDir: '/path/to/your/custom/dir',
  fileName: 'my-settings.json',
});

const windowSizer = createWindowSizer({ store: persistantFileStore });
```

### Creating your own store

```ts
import type { Rectangle } from 'electron';
import { createWindowSizer } from 'electron-window-sizer';

import { persistantSettingsStore } from './helpers/settings';

const windowSizer = createWindowSizer({
  store: {
    get: async (): Promise<Rectangle> => {
      return persistantSettingsStore.getSetting('window-size');
    },
    set: async (data: Rectangle): Promise<void> => {
      return persistantSettingsStore.setSetting('window-size', data);
    },
  },
});
```
