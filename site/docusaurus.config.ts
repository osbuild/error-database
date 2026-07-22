import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Composer CI Error Database',
  tagline: 'Tracking recurring CI errors',

  // GitHub Pages with custom domain.
  // osbuild.org is configured on the osbuild.github.io repo;
  // project repos are served at osbuild.org/<repo-name>/.
  url: 'https://osbuild.org',
  baseUrl: '/error-database/',

  organizationName: 'osbuild',
  projectName: 'error-database',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'CI Error Database',
      items: [
        {
          href: 'https://github.com/osbuild/error-database/blob/main/ci-error-db.json',
          label: 'ci-error-db.json',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright \u00a9 ${new Date().getFullYear()} Red Hat, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
