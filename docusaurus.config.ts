import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Load environment variables from .env file
require('dotenv').config();

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
const siteUrl = process.env.SITE_URL || 'https://docs.walnut.dev/';
const config: Config = {
  title: 'Walnut docs',
  tagline: 'Walnut Documentation',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: siteUrl,
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  trailingSlash: false,
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content: 'Walnut is a transaction debugger and simulator for Starknet, EVM, and custom networks. Step through transactions at the source level, verify smart contracts, and simulate execution.',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:description',
        content: 'Walnut is a transaction debugger and simulator for Starknet, EVM, and custom networks. Step through transactions at the source level, verify smart contracts, and simulate execution.',
      },
    },
  ],
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // organizationName: 'walnuthq', // Usually your GitHub org/user name.
  // projectName: 'walnut-docs', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid', 'docusaurus-theme-openapi-docs'],
  plugins: [
    require.resolve('docusaurus-lunr-search'),
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'api',
        path: 'api-docs',
        routeBasePath: 'api',
        docItemComponent: '@theme/ApiItem',
        sidebarPath: './sidebarsApi.ts',
      },
    ],
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'API',
        docsPluginId: 'api',
        config: {
          walnut: {
            specPath: 'https://evm.walnut.dev/api/openapi.json',
            outputDir: 'api-docs',
            // sidebarOptions: {
            //   groupPathsBy: 'tag',
            // },
          },
          walnutStarknet: {
            specPath: 'openapi/walnut-starknet-simulation.json',
            outputDir: 'api-docs/simulation',
          },
        },
      },
    ],
  ],

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          docItemComponent: '@theme/ApiItem',
        },
        blog: false,

        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    headTags: [
      {
        tagName: 'meta',
        attributes: {
          name: 'description',
          content: 'Walnut is a transaction debugger and simulator for Starknet, EVM, and custom networks. Step through transactions at the source level, verify smart contracts, and simulate execution.',
        },
      },
      {
        tagName: 'meta',
        attributes: {
          property: 'og:description',
          content: 'Walnut is a transaction debugger and simulator for Starknet, EVM, and custom networks. Step through transactions at the source level, verify smart contracts, and simulate execution.',
        },
      },
      {
        tagName: 'meta',
        attributes: {
          property: 'og:image',
          content: `${siteUrl}img/metadata-preview.png`,
        },
      },
    ],
    metadata: [
      {
        name: 'type',
        content: 'website',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'image',
        content: 'img/metadata-preview.png',
      },
      {
        property: 'og:image',
        content: `${siteUrl}img/metadata-preview.png`,
      },
      {
        property: 'og:image:alt',
        content: 'Walnut logo',
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '309',
      },
    ],
    navbar: {
      logo: {
        alt: 'Walnut logo',
        src: 'img/logos/walnut.svg',
        srcDark: 'img/logos/walnut_white.svg',
      },
      items: [
        {
          to: '/',
          label: 'Documentation',
          position: 'left',
          className: 'navbar-button',
          activeBaseRegex: '^(?!/api).*$',
        },
        {
          to: '/api/walnut-simulation-api',
          label: 'API Reference',
          position: 'left',
          className: 'navbar-button',
          activeBasePath: '/api',
        },
        {
          href: 'https://github.com/walnuthq',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          html: `
          <div class='footer-wrapper'>
            <div class='footer-content'>
              <div class='footer-love'>
                Built with <span class='heart'>❤️</span> by
                <a href='https://walnut.dev/' target='_blank' rel="noopener noreferrer">Walnut</a>
              </div>
              <div class='footer-socials'>
                <a href="https://github.com/walnuthq" 
                   target='_blank' 
                   rel="noopener noreferrer"
                   aria-label="GitHub"
                   class='social-link'>
                  <img class="social-icon" src="/img/github-logo.svg" alt="GitHub"/>
                </a>
                <a href="https://t.me/walnuthq" 
                   target='_blank' 
                   rel="noopener noreferrer"
                   aria-label="Telegram"
                   class='social-link'>
                  <img class="social-icon" src="/img/telegram-logo.svg" alt="Telegram"/>
                </a>
                <a href="https://x.com/walnut_dev" 
                   target='_blank' 
                   rel="noopener noreferrer"
                   aria-label="Twitter"
                   class='social-link'>
                  <img class="social-icon" src="/img/twitter-logo.svg" alt="Twitter"/>
                </a>
              </div>
            </div>
          </div>`,
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    colorMode: {
      respectPrefersColorScheme: true, // Enables system preference
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
