# Bloom of Memories

Generative oil painting driven by the Unsplash Lite Dataset. 750 paint daubs rendered in p5.js.
No photographs are displayed, only the colours they carried.

![Bloom of Memories](preview01.png)

![Bloom of Memories](preview02.png)

---

## Dataset

Two modes are supported:

**Unsplash Lite** (default) — uses `colors.csv000`, a tab-separated file containing pre-extracted colour data (RGB values, coverage, score) for ~25,000 nature photographs. Download from [unsplash.com/data](https://unsplash.com/data).

**Local photos** — place your own JPEG images in a `/photos` folder named `img001.jpg`, `img002.jpg` etc. The sketch pixel-samples each image directly to extract colour.

---

## Setup

Requires a local server (e.g. [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or `python3 -m http.server`).

```
project/
├── index.html
├── sketch.js
└── photos/        ← only needed for local mode
```

Open in browser → click **Load colors.csv** → select `colors.csv000` from the unzipped dataset.

---

## Configuration

At the top of `sketch.js`:

```js
const USE_LOCAL_DATASET = false;  // true  = local /photos/ folder
                                  // false = Unsplash Lite colors.csv
```

For local mode, also set:

```js
const LOCAL_TOTAL_IMAGES = 64;           // number of images
const LOCAL_IMAGE_PREFIX = 'photos/img'; // path + filename prefix
const LOCAL_IMAGE_DIGITS = 3;            // zero-padding, e.g. 001
```

---

## Interaction

- **Click** — regenerates the painting
- **Resize** — canvas adapts

---

## Credits

Colour data from the [Unsplash Lite Dataset 1.3.0](https://unsplash.com/data), used under the [Unsplash Dataset Terms](https://github.com/unsplash/datasets/blob/master/TERMS.md).
