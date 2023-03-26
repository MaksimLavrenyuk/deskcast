// Forge Configuration
const path = require('path');
const { exec } = require('child_process');
const pkg = require('../../package.json');

const rootDir = process.cwd();
const iconDir = path.resolve(rootDir, 'src', 'assets', 'icons');

const commonLinuxConfig = {
  icon: {
    scalable: path.resolve(iconDir, 'icon.svg'),
  },
};

module.exports = {
  // Packager Config
  packagerConfig: {
    // Create asar archive for main, renderer process files
    asar: true,
    icon: 'src/assets/icons/icon',
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
        setupIcon: 'src/assets/icons/icon.ico',
        // certificateFile: process.env['WINDOWS_CODESIGN_FILE'],
        // certificatePassword: process.env['WINDOWS_CODESIGN_PASSWORD'],
      }),
    },
    {
      name: '@electron-forge/maker-wix',
      config: {
        language: 1033,
        manufacturer: 'Maksim Lavrenyuk',
        icon: 'src/assets/icons/icon.ico',
        ui: {
          chooseDirectory: true,
        },
      },
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: 'src/assets/icons/icon.png',
      },
    },
    {
      // The deb target builds .deb packages, which are the standard package format for Debian-based
      // Linux distributions such as Ubuntu.
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      config: commonLinuxConfig,
    },
    {
      // The RPM target builds .rpm files, which is the standard package format for
      // RedHat-based Linux distributions such as Fedora.
      name: '@electron-forge/maker-rpm',
      platforms: ['linux'],
      config: commonLinuxConfig,
    },
    {
      name: '@electron-forge/maker-snap',
      config: {
        version: pkg.version,
        summary: pkg.description,
      },
    },
  ],
  // Forge Plugins
  plugins: [
    // The Webpack plugin allows you to use standard Webpack tooling to compile both your main process code
    // and your renderer process code, with built in support for Hot Module Reloading in the renderer
    // process and support for multiple renderers.
    {
      name: '@electron-forge/plugin-webpack',
      config: {
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
    },
  ],
};
