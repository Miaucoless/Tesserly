
# Tesserly – Electron (macOS)

## Prereqs
- Node.js (LTS)

## Install
```
npm install
```

## Run (dev)
```
npm start
```

## Build macOS (.dmg + zip)
```
npm run build
```

### Build Windows from macOS (optional)
Install Wine first, then:
```
npm run build -- --win
```

## Use your real app files
Replace `src/Tesserly.html` with your actual HTML app (self-hosted version). If your entry file is named differently, edit `src/main.js` (`win.loadFile(...)`). Copy your `vendor/`, `fonts/`, and any other asset folders into `src/`.
