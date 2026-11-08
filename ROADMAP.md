# Chronic Kidney Disease Predictor — Project Roadmap

## Vision

Evolve this project from an educational CKD prediction demo into a reliable, transparent machine-learning application that demonstrates a complete and reproducible clinical-data workflow.

The project should help users explore how clinical measurements relate to recorded CKD status and demonstrate responsible ML engineering. It is **not a diagnostic device**, and it should not present predictions as medical advice or clinically validated risk estimates.

The guiding principle is: **validate the data and prediction task before optimizing the model or expanding the product.**

## Current documented state

Based on the repository's public README and `technical-notes.md`:

- The application has a React + TypeScript frontend built with Vite and Tailwind.
- The frontend sends patient-entered values to a Supabase Edge Function named `predict-ckd`.
- The documented Edge Function currently uses hand-written, rule-based scoring.
- A separate Python training script is described as training a scikit-learn Random Forest with `GridSearchCV` and exporting a pickle model.
- The documented training features are Age, BUN, Diabetes, Creatinine Level, Hypertension, and GFR, with `CKD_Status` as the target.
- The technical notes list Hemoglobin among the app inputs, creating a potential mismatch between the app's inputs and the documented training features.
- The README describes the model as an educational project and explicitly warns against using it for medical diagnosis.
- The documented dataset, `kidney_disease_dataset.csv`, is not present in the public repository.

These are documentation-level findings. The actual source code, current working tree, dataset provenance, model artifact, and deployed Supabase configuration must be inspected before implementation decisions are made.

## Guiding principles

1. **Data before models:** do not claim model performance without a real, traceable dataset and a clearly defined target.
2. **No fabricated evidence:** synthetic data may test plumbing, but it cannot establish clinical validity or real-world performance.
3. **Prevent leakage:** determine how `CKD_Status` was assigned before deciding which features are appropriate.
4. **Use fair baselines:** compare simple clinical rules and interpretable models before more complex algorithms.
5. **Evaluate useful behavior:** report sensitivity, specificity, precision, calibration, and uncertainty—not accuracy alone.
6. **Keep the product honest:** clearly distinguish an educational estimate from a validated clinical tool.
7. **Prefer the simplest justified solution:** add model complexity only when measured evidence supports it.

---

## Phase 1 — Establish the actual baseline

**Goal:** Understand exactly what exists and determine whether the current ML work can be evaluated.

- Inspect the complete repository, including frontend, Supabase function, Python training code, dependencies, tests, and Git history.
- Trace the full prediction flow from form submission to displayed result.
- Identify whether the deployed application uses rule-based scoring, a trained model, or a mixture of both.
- Compare frontend input fields, training features, inference features, and documentation. Resolve any mismatches.
- Locate the dataset, if available. If it is absent, record that as a blocker rather than substituting invented data.
- Establish the dataset's source, licensing, collection process, sample size, class distribution, missingness, and label definition.
- Determine whether the labels represent current CKD status, a screening outcome, or a future outcome.
- Run existing tests and baseline build/type/lint checks; record failures without silently changing unrelated behavior.

**Deliverables:** a verified architecture/data-flow summary, a list of confirmed issues, a reproducible baseline test report, and a clear go/no-go decision for model evaluation.

**Exit criteria:** the prediction target and dataset provenance are documented, or the project explicitly records that model validation is blocked.

## Phase 2 — Build a trustworthy data pipeline

**Goal:** Make model training reproducible and resistant to common data-quality and leakage problems.

- Add explicit schema and type validation for the dataset.
- Audit missing values, duplicates, invalid ranges, class imbalance, and suspicious records.
- Investigate target leakage, especially whether GFR or creatinine was used to derive `CKD_Status`.
- Check for patient overlap across training and test sets if patient identifiers or repeated records exist.
- Separate training, validation, and final test data correctly. Keep the test set untouched during model selection.
- Make preprocessing and feature selection part of the reproducible training pipeline.
- Record dataset version, feature list, target definition, split strategy, random seed, and model configuration.
- Do not silently drop large numbers of records; report the impact of each cleaning decision.

**Deliverables:** validated data-loading pipeline, documented data-quality report, leakage assessment, and reproducible data splits.

**Exit criteria:** the dataset is sufficiently understood to support a defensible evaluation.

## Phase 3 — Establish meaningful model performance

**Goal:** Find out whether ML adds value over simple baselines.

- Establish simple baselines, including prevalence-only and an appropriate GFR-based rule where the label definition makes that comparison meaningful.
- Compare interpretable logistic regression with Random Forest; consider additional models only if justified by dataset size and results.
- Use the same evaluation splits for every candidate model.
- Tune models using training data only.
- Evaluate ROC-AUC and PR-AUC alongside sensitivity, specificity, precision, F1, and confusion matrices.
- Examine performance at multiple thresholds instead of assuming 0.5 is appropriate.
- Assess probability calibration with reliability plots, Brier score, and calibration slope/intercept where feasible.
- Report confidence intervals or uncertainty estimates where practical.
- Perform feature ablations, including comparisons with and without GFR, to understand what the model is learning.
- Evaluate relevant subgroups only where sample sizes support meaningful conclusions.

**Deliverables:** reproducible model-comparison report, baseline comparisons, threshold analysis, calibration assessment, and a justified model-selection decision.

**Exit criteria:** a candidate model demonstrates a defensible improvement for the explicitly defined prediction task. If it does not, retain the simpler baseline.

## Phase 4 — Integrate the selected model safely

**Goal:** Ensure the application uses the same validated model that was evaluated.

- Define one canonical feature schema shared by the frontend, training pipeline, and inference service.
- Version model artifacts and store their metadata, feature order, preprocessing requirements, and evaluation results.
- Replace or clearly separate the current hand-written scoring logic only after the candidate model has passed evaluation.
- Validate all incoming values, including missing, non-finite, out-of-range, and malformed inputs.
- Ensure inference uses the exact preprocessing and feature ordering from training.
- Return clearly named outputs and avoid presenting uncalibrated scores as probabilities.
- Provide a safe, explicit behavior when a model artifact is unavailable or incompatible.
- Add automated tests for training-to-inference consistency and frontend/API contract compatibility.

**Deliverables:** reproducible model export, consistent inference path, versioned metadata, and integration tests.

**Exit criteria:** the deployed inference path uses the intended model and produces outputs consistent with the evaluated training pipeline.

## Phase 5 — Improve explanations and user experience

**Goal:** Make the application understandable without implying clinical authority.

- Explain what each input represents and use appropriate units and validation.
- Clarify whether an output is a model score, estimated probability, or rule-based category.
- Show relevant limitations and the model's intended population and prediction task.
- Add feature explanations only when they are methodologically appropriate; do not imply that feature importance establishes causation.
- Make uncertainty and out-of-scope inputs visible.
- Improve accessibility, responsive behavior, loading states, and error messages.
- Keep the educational/non-diagnostic disclaimer prominent.

**Deliverables:** clearer input guidance, transparent results presentation, and user-facing limitations.

**Exit criteria:** users can understand what the output means and, equally importantly, what it does not mean.

## Phase 6 — Reliability, documentation, and release readiness

**Goal:** Make the project straightforward to reproduce, test, and maintain.

- Add automated checks for Python tests, frontend tests, type checking, linting, and production builds.
- Document environment setup, dataset requirements, training, evaluation, model export, and deployment.
- Keep secrets, patient data, datasets with unclear licensing, and generated model artifacts out of Git.
- Add dependency/version management and basic security checks.
- Document model limitations, known failure modes, and the exact evidence supporting any performance claims.
- Add monitoring or drift checks only if the application is actually used with an appropriate, privacy-conscious data process.
- Review deployment configuration and access controls before any real patient information is handled.

**Deliverables:** reproducible setup guide, automated checks, deployment instructions, and a release checklist.

**Exit criteria:** another developer can reproduce the documented workflow and verify the project's claims.

---

## Immediate priorities

1. Inspect the real source code and verify the current prediction flow.
2. Find the dataset or confirm that it is unavailable.
3. Establish the exact meaning and provenance of `CKD_Status`.
4. Resolve the mismatch between app inputs and training features.
5. Determine whether the current model can be evaluated at all.
6. Only then decide which ML changes are justified.

## Explicitly out of scope for now

- Claiming clinical validation or diagnostic accuracy.
- Predicting future CKD without longitudinal data and a defined prediction horizon.
- Adding deep learning or complex ensembles without evidence that they are needed.
- Adding patient accounts, medical-record integrations, or real patient-data collection before privacy, security, and regulatory requirements are addressed.
- Displaying risk percentages as clinically meaningful unless calibration and intended-use validation support that interpretation.

## Roadmap maintenance

Update this document as work is completed. Mark items as **Done**, **In progress**, **Blocked**, or **Deferred**, and link important decisions to tests, reports, or code. Do not mark a phase complete merely because code was written; its exit criteria must be met.
