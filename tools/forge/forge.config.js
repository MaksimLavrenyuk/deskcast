// Forge Configuration
const path = require('path');
const { exec } = require('child_process');

const rootDir = process.cwd();

module.exports = {
  // Packager Config
  packagerConfig: {
    // Create asar archive for main, renderer process files
    asar: true,
    // Set executable name
    executableName: 'Deskcast',
    // Set application copyright
    appCopyright: 'Copyright (C) 2022 Maksim Lavrenyuk',
    icon: 'src/assets/icon',
  },
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'MaksimLavrenyuk',
          name: 'deskcast',
        },
        draft: true,
        prerelease: false,
      },
    },
  ],
  hooks: {
    generateAssets: async () => {
      await new Promise((resolve, reject) => {
        const inProd = process.env.NODE_ENV === 'production';
        const buildProcess = exec('yarn watcher-client-build');

        buildProcess.on('exit', () => {
          console.log('\nThe watcher\'s client has been compiled!');
          resolve();
        });

        buildProcess.on('error', () => {
          console.error('Error when building the watcher client!');
          reject();
        });
      });
    },
  },
  // Forge Makers
  makers: [
    {
      // Squirrel.Windows is a no-prompt, no-hassle, no-admin method of installing
      // Windows applications and is therefore the most user friendly you can get.
      name: '@electron-forge/maker-squirrel',
      config: (arch) => ({
        name: 'Deskcast',
        authors: 'Maksim Lavrenyuk',
        exe: 'Deskcast.exe',
        iconUrl:
          'https://raw.githubusercontent.com/MaksimLavrenyuk/deskcast/master/src/assets/icon.ico',
        noMsi: true,
        setupExe: 'Desckast-setup.exe',
        setupIcon: 'src/assets/icon.ico',
        // certificateFile: process.env['WINDOWS_CODESIGN_FILE'],
        // certificatePassword: process.env['WINDOWS_CODESIGN_PASSWORD'],
      }),
    },
    {
      name: '@electron-forge/maker-wix',
      config: {
        language: 1033,
        manufacturer: 'Maksim Lavrenyuk',
        icon: 'src/assets/icon.ico',
        ui: {
          chooseDirectory: true,
        },
      },
    },
    {
      // The Zip target builds basic .zip files containing your packaged application.
      // There are no platform specific dependencies for using this maker and it will run on any platform.
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {
        options: {
          icon: 'src/assets/icon.png',
        },
      },
    },
    {
      name: '@electron-forge/maker-flatpak',
      config: {
        options: {
          categories: ['Video', 'Education', 'Office'],
        },
      },
    },
    {
      // The deb target builds .deb packages, which are the standard package format for Debian-based
      // Linux distributions such as Ubuntu.
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: 'src/assets/icon.png',
        },
      },
    },
    {
      // The RPM target builds .rpm files, which is the standard package format for
      // RedHat-based Linux distributions such as Fedora.
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          icon: 'src/assets/icon.png',
        },
      },
    },
  ],
  // Forge Plugins
  plugins: [
    [
      // The Webpack plugin allows you to use standard Webpack tooling to compile both your main process code
      // and your renderer process code, with built in support for Hot Module Reloading in the renderer
      // process and support for multiple renderers.
      '@electron-forge/plugin-webpack',
      {
        // fix content-security-policy error when image or video src isn't same origin
        devContentSecurityPolicy: '',
        // Ports
        port: 3000, // Webpack Dev Server port
        loggerPort: 9000, // Logger port
        // Main process webpack configuration
        mainConfig: path.join(rootDir, 'tools/webpack/webpack.main.js'),
        // Renderer process webpack configuration
        renderer: {
          // Configuration file path
          config: path.join(rootDir, 'tools/webpack/webpack.renderer.js'),
          // Entrypoints of the application
          entryPoints: [
            {
              // Window process name
              name: 'app_window',
              // React Hot Module Replacement (HMR)
              rhmr: 'react-hot-loader/patch',
              // HTML index file template
              html: path.join(rootDir, 'src/renderer/app.html'),
              // Renderer
              js: path.join(rootDir, 'src/renderer/appRenderer.tsx'),
              // Main Window
              // Preload
              preload: {
                js: path.join(rootDir, 'src/renderer/appPreload.tsx'),
              },
            },
          ],
        },
        devServer: {
          liveReload: false,
        },
      },
    ],
  ],
};
