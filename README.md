# Bloom of Memories

Generative oil painting driven by colour data extracted from photographs. 750 paint daubs rendered in p5.js.  
No photographs are displayed, only the colours they carried.

![Bloom of Memories](preview01.png)
![Bloom of Memories](preview02.png)

---

## How the dataset becomes a painting

Regardless of which dataset is used, the process is the same.

Every photograph is reduced to a set of RGB colour samples. These are grouped into a pool — one pool per photo. Each colour in the pool carries a saturation value, brightness, and hue. Once all pools are built, a statistical profile of the entire dataset is computed: average saturation, brightness, warmth, contrast, and hue spread. This profile shapes the character of the painting as a whole.

When painting begins, each of the 750 daubs picks a random photo pool, then draws a colour from it. 60% of daubs favour the most saturated candidate from 10 samples — pulling vivid, prominent colours to the surface. 40% take any colour at random, preserving quieter and neutral tones. The result is a painting whose palette is a direct reflection of the colour memory of the dataset — its warmth, its contrast, how wide or narrow its range of hues.

---

## Dataset modes

**`'unsplash'`** — reads `colors.csv000` from the Unsplash Lite Dataset. Each row contains pre-extracted RGB values and a prominence score for a colour region within a photo. Colours are weighted by score so dominant colours appear proportionally more. Download from [unsplash.com/data](https://unsplash.com/data).

**`'local'`** — loads JPEG images from `/photos`, pixel-samples each one at 80px wide, and builds colour pools directly from the pixel data.

Both modes produce identical pool structures and feed into the same painting pipeline.

---

## Setup

Requires a local server (e.g. [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or `python3 -m http.server`).

```
project/
├── index.html
├── sketch.js
└── photos/        ← only needed for local mode
```

For Unsplash mode: place the unzipped dataset folder alongside `sketch.js`, or update the paths in configuration.

---

## Configuration

```js
const ACTIVE_DATASET = 'local';     // 'local' or 'unsplash'

// Local
const LOCAL_TOTAL_IMAGES = 59;
const LOCAL_IMAGE_PREFIX = 'photos/img';
const LOCAL_IMAGE_DIGITS = 3;

// Unsplash
const UNSPLASH_COLORS_PATH = 'unsplash-research-dataset-lite-latest/colors.csv000';
const UNSPLASH_PHOTOS_PATH = 'unsplash-research-dataset-lite-latest/photos.csv000';
```

---

## Interaction

- **Click** — regenerates the painting
- **Resize** — canvas adapts

---

## Credits

Colour data from the [Unsplash Lite Dataset 1.3.0](https://unsplash.com/data), used under the [Unsplash Dataset Terms](https://github.com/unsplash/datasets/blob/master/TERMS.md).
