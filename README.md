# Bloom of Memories

Generative oil painting driven by colour data extracted from photographs. 750 paint daubs rendered in p5.js. 

Example from using local dataset
![Bloom of Memories](preview01.png)

Example from using the Unsplash Lite dataset 
![Bloom of Memories](preview02.png)

---

## How the dataset becomes a painting

Every photograph is reduced to a set of RGB colour samples. These are grouped into a pool, one pool per photo. Each colour in the pool carries a saturation value, brightness, and hue. Once all pools are built, a statistical profile of the entire dataset is computed: average saturation, brightness, warmth, contrast, and hue spread.

When painting begins, each of the 750 daubs picks a random photo pool, then draws a colour from it. 60% of daubs favour the most saturated candidate from 10 samples pulling vivid, prominent colours to the surface. 40% take any colour at random, preserving quieter and neutral tones. The result is a painting whose palette is a direct reflection of the colour memory of the dataset: its warmth, its contrast, how wide or narrow its range of hues.

---

## Dataset modes

**`'unsplash'`** — reads `colors.csv000` from the Unsplash Lite Dataset. Each row contains pre-extracted RGB values and a prominence score for a colour region within a photo. Colours are weighted by score so dominant colours appear proportionally more.

**`'local'`** — loads JPEG images from `/photos`, pixel-samples each one at 80px wide, and builds colour pools directly from the pixel data.

Both modes produce identical pool structures and feed into the same painting pipeline.

---

## Getting the Unsplash Lite Dataset

1. Go to [unsplash.com/data](https://unsplash.com/data) and download the Lite dataset (~700 MB compressed)
2. Unzip
3. Place folder in your project directory 

Your working directory should look like this:

```
project/
├── index.html
├── sketch.js
├── dataConfig.js
├── painting.js
├── photos/                                      ← only needed for local mode
└── unsplash-research-dataset-lite-latest/
    ├── colors.csv000
    ├── colors.csv001
    ├── colors.csv002
    ├── photos.csv000
    └── ...
```

---

## Setup

Requires a local server (e.g. [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or `python3 -m http.server`).

Set `ACTIVE_DATASET = 'unsplash'` in `sketch.js`, then open the project via the local server. The dataset loads automatically from the path set in configuration.

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
