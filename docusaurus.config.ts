import { themes as prismThemes } from 'prism-react-renderer';
import type { Config, PluginConfig } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Load environment variables from .env file
require('dotenv').config();

// Which docs sections are published. Edit docs.features.json:
//   canton      - dpm trace docs (docs-canton/)
//   walnut      - Starknet/EVM debugger docs (docs/)
//   evmApi      - EVM simulation API reference (needs https://evm.walnut.dev to be reachable)
//   starknetApi - Starknet simulation API reference (openapi/)
const features: { canton: boolean; walnut: boolean; evmApi: boolean; starknetApi: boolean } = require('./docs.features.json');
const apiEnabled = features.evmApi || features.starknetApi;

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
const siteUrl = process.env.SITE_URL || 'https://docs.walnut.dev/';
const siteDescription = features.walnut
  ? 'Walnut is a transaction debugger and simulator for Starknet, EVM, and custom networks. Step through transactions at the source level, verify smart contracts, and simulate execution.'
  : 'dpm trace shows what a Canton transaction did as a tree of events, reads rejected submissions, previews and compares transactions, and runs Daml Script tests in CI.';
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
        content: siteDescription,
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:description',
        content: siteDescription,
      },
    },
  ],
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // organizationName: 'walnuthq', // Usually your GitHub org/user name.
  // projectName: 'walnut-docs', // Usually your repo name.

  onBrokenLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themes: ['@docusaurus/theme-mermaid', 'docusaurus-theme-openapi-docs'],
  plugins: [
    require.resolve('docusaurus-lunr-search'),
    // dpm trace docs live at / when they are the only section, else at /canton
    ...(features.canton
      ? [
          [
            '@docusaurus/plugin-content-docs',
            {
              id: 'canton',
              path: 'docs-canton',
              routeBasePath: features.walnut ? 'canton' : '/',
              sidebarPath: './sidebarsCanton.ts',
            },
          ] satisfies PluginConfig,
        ]
      : []),
    ...(apiEnabled
      ? [
          [
            '@docusaurus/plugin-content-docs',
            {
              id: 'api',
              path: 'api-docs',
              routeBasePath: 'api',
              docItemComponent: '@theme/ApiItem',
              sidebarPath: './sidebarsApi.ts',
            },
          ] satisfies PluginConfig,
        ]
      : []),
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'API',
        docsPluginId: 'api',
        config: {
          ...(features.evmApi && {
            walnut: {
              specPath: 'https://evm.walnut.dev/api/openapi.json',
              outputDir: 'api-docs/reference/evm-simulation',
            },
          }),
          ...(features.starknetApi && {
            walnutStarknet: {
              specPath: 'openapi/walnut-starknet-simulation.json',
              outputDir: 'api-docs/reference/starknet-simulation',
            },
          }),
        },
      },
    ],
  ],

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: features.walnut
          ? {
              routeBasePath: '/',
              docItemComponent: '@theme/ApiItem',
            }
          : false,
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
          content: siteDescription,
        },
      },
      {
        tagName: 'meta',
        attributes: {
          property: 'og:description',
          content: siteDescription,
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
        // Buttons only show for sections that are enabled; with a single section there is nothing to switch.
        ...(features.walnut
          ? [
              {
                to: '/',
                label: 'Documentation',
                position: 'left' as const,
                className: 'navbar-button',
                activeBaseRegex: '^(?!/api|/canton).*$',
              },
            ]
          : []),
        // Without this the mobile main menu only has GitHub and no way back to the docs sidebar.
        ...(!features.walnut && features.canton
          ? [
              {
                type: 'docSidebar' as const,
                sidebarId: 'cantonSidebar',
                docsPluginId: 'canton',
                label: 'Documentation',
                position: 'left' as const,
                className: 'navbar-mobile-only',
              },
            ]
          : []),
        ...(features.walnut && features.canton
          ? [
              {
                to: '/canton',
                label: 'DPM Trace',
                position: 'left' as const,
                className: 'navbar-button',
                activeBasePath: '/canton',
              },
            ]
          : []),
        ...(apiEnabled
          ? [
              {
                to: '/api/category/api-reference',
                label: 'API Reference',
                position: 'left' as const,
                className: 'navbar-button',
                activeBasePath: '/api',
              },
            ]
          : []),
        {
          href: features.walnut ? 'https://github.com/walnuthq' : 'https://github.com/walnuthq/dpm-trace',
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
                <a href="https://walnut.dev/contact"
                   target='_blank'
                   rel="noopener noreferrer"
                   aria-label="Contact"
                   class='social-link'>
                  <img class="social-icon" src="/img/email-icon.svg" alt="Contact"/>
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
