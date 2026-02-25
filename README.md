# Bloom of Memories

Generative oil painting driven by the Unsplash Lite Dataset. 750 paint daubs rendered in p5.js.  
No photographs are displayed, only the colours they carried.

Example with local dataset (my own pictures)
![Bloom of Memories](preview01.png)

Example with the Unsplash Lite Dataset
![Bloom of Memories](preview02.png)

---

## Dataset

Two modes are supported:

**Unsplash Lite** (default) — uses `colors.csv000`, a tab-separated file of pre-extracted colour data for ~25,000 nature photographs. Download from [unsplash.com/data](https://unsplash.com/data).

**Local photos** — place your own JPEGs in `/photos` named `img001.jpg`, `img002.jpg` etc. The sketch pixel-samples each image directly to extract colour.

### How the colour data drives the painting

The `colors.csv000` file contains one row per colour region per photo:

```
photo_id    hex       red   green   blue   keyword    coverage   score
MJBb_q5y   7D0D10    125   13      16     maroon     0.008      0.094
```

| Field | How it's used |
|---|---|
| `red` `green` `blue` | Direct RGB values — no hex conversion. These become the paint colour for each daub |
| `photo_id` | Groups colour rows into per-photo pools, one pool per photograph |
| `score` | Visual prominence weight — higher score colours are sampled more often, so dominant colours appear more in the painting |
| `coverage` | Not used — `score` already encodes relative importance |
| `keyword` / `hex` | Not used |

Each paint blob picks a random photo pool, then draws a colour from it weighted by score. 60% of blobs favour the most saturated option from 10 candidates; 40% take any colour, giving the painting both vivid passages and quieter neutral areas.

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
