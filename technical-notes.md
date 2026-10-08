# Technical Notes: Running Locally

The CKD Predictor web app estimates Chronic Kidney Disease (CKD) risk from blood report values (age, hemoglobin, BUN, creatinine, GFR) and pre-existing conditions (diabetes, hypertension).

> This tool is for educational purposes only and is not a substitute for professional medical advice.

For an overview of the machine learning model, see [README.md](README.md).

## Project structure

```
CKD-PREDICTOR/
└── project/
    ├── src/                              # React + TypeScript frontend (Vite, Tailwind)
    │   ├── App.tsx
    │   └── components/                   # PredictionForm, ResultsDisplay, etc.
    ├── supabase/functions/predict-ckd/   # Supabase Edge Function that computes the risk
    ├── train_model.py                    # Optional: trains a RandomForest model (scikit-learn)
    ├── package.json
    └── .env                              # Supabase credentials (not committed)
```

When you submit the form, the frontend sends the values to the `predict-ckd` Supabase Edge Function, which returns a risk score, a risk level (`low` / `moderate` / `high`) and a CKD probability.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer (includes `npm`)
- A Supabase project with the `predict-ckd` function deployed, **or** the [Supabase CLI](https://supabase.com/docs/guides/cli) and [Docker](https://www.docker.com/) to run the function locally
- Python 3.9+ (only if you want to run `train_model.py`)

## 1. Install dependencies

```bash
cd project
npm install
```

## 2. Configure environment variables

Create a file named `.env` inside `project/`:

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

You can find both values in the Supabase dashboard under **Project Settings → API**. The `.env` file is git-ignored, so never commit real keys.

## 3. Make the prediction function available

Pick one of the options below.

### Option A: Use a hosted Supabase project

Deploy the function to your Supabase project once:

```bash
cd project
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase functions deploy predict-ckd
```

Then use that project's URL and anon key in `.env`.

### Option B: Run Supabase locally

Requires Docker to be running.

```bash
cd project
npx supabase init          # only the first time; creates supabase/config.toml
npx supabase start         # starts the local Supabase stack
npx supabase functions serve predict-ckd
```

`supabase start` prints a local **API URL** (usually `http://127.0.0.1:54321`) and an **anon key**. Put those in `project/.env`:

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<anon key printed by supabase start>
```

## 4. Start the frontend

```bash
cd project
npm run dev
```

Open the URL Vite prints (by default [http://localhost:5173](http://localhost:5173)).

## Other scripts

Run these from `project/`:

| Command             | What it does                              |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Start the dev server with hot reload      |
| `npm run build`     | Build a production bundle into `dist/`    |
| `npm run preview`   | Serve the production build locally        |
| `npm run lint`      | Run ESLint                                |
| `npm run typecheck` | Run the TypeScript compiler without output |

## Machine learning model

`train_model.py` builds an optimized **Random Forest Classifier** and saves it as `ckd_model.pkl`; see [README.md](README.md) for the features and modeling process. The web app does not use this model yet; the Edge Function uses a rule-based scoring approach.

### Train the model

1. Place the dataset `kidney_disease_dataset.csv` in `project/`. It needs the columns `Age`, `BUN`, `Diabetes`, `Creatinine_Level`, `Hypertension`, `GFR` and `CKD_Status`.
2. Install the Python dependencies and run the script:

```bash
cd project
python -m venv venv
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# macOS / Linux:
source venv/bin/activate

pip install pandas scikit-learn
python train_model.py
```

## Troubleshooting

- **Results never load or show an error:** check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in `project/.env`, and restart `npm run dev` after editing `.env`.
- **404 from `/functions/v1/predict-ckd`:** the function isn't deployed (Option A) or isn't being served (Option B).
- **`supabase start` fails:** make sure Docker Desktop is running.
