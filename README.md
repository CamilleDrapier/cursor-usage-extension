# Cursor Usage Tracker Extension

A browser extension that visualizes your Cursor usage against ideal pacing throughout the billing cycle. It adds a visual indicator to the Cursor dashboard showing whether you're ahead or behind your ideal usage rate.

## Features

- Shows a pulsing indicator on the usage progress bar
- **Red**: You're using requests faster than your ideal pace
- **Aquamarine**: You're using requests slower than ideal (you have budget to spare!)
- Hover over the indicator to see how many requests you're ahead/behind
- Automatically prevents duplicate initialization
- Comprehensive error handling with DevTools logging

## Prerequisites

- Node.js v24.0.0 or later
- npm

## Project Structure

```
cursor-usage-extension/
├── src/
│   ├── constants.ts       # Configuration values and selectors
│   ├── types.ts           # TypeScript interfaces
│   ├── utility.ts         # General utility functions
│   ├── dom_extraction.ts  # DOM parsing functions
│   ├── analysis.ts        # Usage calculation logic
│   ├── ui.ts              # UI manipulation functions
│   ├── main.ts            # Entry point
│   └── *.test.ts          # Unit tests
├── icons/
│   ├── icon.svg           # Source icon
│   ├── icon-16.png        # Generated icon
│   ├── icon-48.png        # Generated icon
│   └── icon-128.png       # Generated icon
├── scripts/
│   └── generate-icons.js  # Icon generation script
├── dist/                  # Build output (generated)
├── manifest.json          # Extension manifest (MV3)
├── package.json           # Project configuration
├── tsconfig.json          # TypeScript configuration
├── eslint.config.js       # ESLint configuration (flat config)
├── .prettierrc            # Prettier configuration
├── vitest.config.ts       # Test configuration
└── README.md
```

## Building

1. Install dependencies:

```bash
npm install
```

2. Generate icons (first time only):

```bash
npm run generate-icons
```

3. Build the extension:

```bash
npm run build
```

This bundles TypeScript to JavaScript and copies assets to the `dist/` folder.

## Development

Watch for changes and automatically rebuild:

```bash
npm run watch
```

This starts a long-lived content script bundle that relies on a `MutationObserver` to track updates to the Cursor dashboard. **The observer is intentionally never disconnected** so that the extension continues to react to DOM changes on the single-page application without needing a full reload.

### Linting

```bash
npm run lint
npm run lint:fix
```

### Formatting

```bash
npm run format
npm run format:check
```

### Testing

```bash
npm test
npm run test:watch
npm run test:coverage
```

## Installing in Chrome

1. Build the extension (`npm run build`)
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `dist` folder from this project

## Installing in Firefox

1. Build the extension (`npm run build`)
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on..."
4. Select the `manifest.json` file inside the `dist` folder

Note: Temporary add-ons in Firefox are removed when Firefox closes. For permanent installation, you need to sign the extension through Mozilla.

## Packaging for Distribution

### Chrome Web Store

```bash
npm run package:chrome
```

This creates `cursor-usage-chrome.zip` ready for upload to the Chrome Web Store.

### Firefox Add-ons

```bash
npm run package:firefox
```

This creates `cursor-usage-firefox.zip` ready for submission to Firefox Add-ons.

## Usage

1. Install the extension in your browser
2. Navigate to https://cursor.com/dashboard?tab=usage
3. The extension automatically adds the usage indicator to your progress bar

## Troubleshooting

### Extension not working

1. Make sure you're on the correct URL: `https://cursor.com/dashboard?tab=usage`
2. Open browser DevTools (F12) and check the Console for errors starting with `[Cursor Usage Tracker]`
3. Try refreshing the page
4. Clear the extension marker: In DevTools Console, run `document.body.removeAttribute('data-cursor-usage-tracker')`

### Build errors

1. Make sure you have Node.js v24+ installed: `node --version`
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Icons not showing

1. Run `npm run generate-icons` to regenerate icons
2. Rebuild with `npm run build`

## License

MIT
