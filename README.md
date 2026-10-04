# Azure DevOps Learning Hub

An installable, interactive learning system for building practical Azure DevOps fluency from a complete beginner level. It turns Microsoft Learn material into a guided path, visual models, retrieval practice, and project-manager scenarios. The application works without an account and keeps progress in the learner's browser.

## Open the app

After GitHub Pages is enabled for `main` at the repository root, the public app is available at:

<https://dustinford02.github.io/azure-devops-learning-hub/>

The page also opens locally through a static web server. Installation and offline support require HTTPS or `localhost`.

## What the learner can do

- Follow a 12-stop path from the Azure DevOps service model through planning, source control, pipelines, testing, artifacts, integrations, security, and administration.
- See the complete delivery lifecycle, platform structure, Boards hierarchy, access model, and pipeline anatomy as interactive visual maps.
- Study a full-resolution identity, security, and governance infographic with zoom, pan, and open-original controls.
- Search and filter a bundled snapshot of 79 Microsoft Learn modules and 15 learning paths for Azure DevOps.
- Refresh the catalog from the public Microsoft Learn Catalog API when the endpoint is available.
- Practice with glossary flashcards, spaced review dates, and project-manager scenarios.
- Track guided lessons and catalog items locally without creating an account.
- Install the app and use its core learning content offline.

## Learning design

Each guided stop contains a concise explanation, a concrete project-manager action, a knowledge check, and official Microsoft documentation. The recurring fraud-detection release scenario makes abstract platform concepts concrete while keeping the technical depth appropriate for a project manager.

The application uses four complementary modes:

1. **Learn:** Read the ordered guided path.
2. **See:** Inspect compact visual models of relationships and flow.
3. **Recall:** Use flashcards and knowledge checks.
4. **Apply:** Respond to delivery scenarios and compare the response with a suggested answer.


## Retain: successive relearning

The Retain view is the retrieval scheduler. It is not a second app.

- The learner must produce an answer before the reference is shown.
- Glossary items rotate the cue: meaning-from-term, then term-from-meaning.
- Again stays in a 10-minute relearning step. Good or Easy graduates the item.
- Graduated intervals use published FSRS-4.5 defaults and a selectable retention target (80–97%, default 90%). The target is predicted retrievability at the next review, not a measured retention percentage.
- Due items are interleaved by topic. New items are capped at five per session.
- State and the review log stay in this browser under `ado-retain-v1`. Export writes that log to JSON. Population weights are not optimized to the learner.

Open it at <https://dustinford02.github.io/azure-devops-learning-hub/#retain> after the Pages deploy finishes.

## Microsoft sources

The guided content and catalog entries point to official Microsoft material, including:

- [Azure DevOps documentation](https://learn.microsoft.com/en-us/azure/devops/)
- [Azure DevOps get started documentation](https://learn.microsoft.com/en-us/azure/devops/get-started/)
- [Microsoft Learn Azure DevOps training](https://learn.microsoft.com/en-us/training/browse/?expanded=azure&products=azure-devops)
- [Microsoft Learn Catalog API](https://learn.microsoft.com/en-us/training/support/catalog-api)

The embedded catalog snapshot was retrieved on 2026-10-03. Microsoft owns the linked learning material. This project supplies the interactive organization, progress tools, visual explanations, and practice layer.

## Run locally

Serve the repository root with any static file server. For example:

```powershell
python -m http.server 8080
```

Then open <http://localhost:8080/>.

## Publish with GitHub Pages

The included GitHub Actions workflow deploys the static application after every push to `main`. In **Settings > Pages**, select **GitHub Actions** as the publishing source once. The workflow then keeps the public PWA current automatically.

## Project files

- `index.html`: Application shell and semantic structure.
- `styles.css`: Responsive layout, themes, accessibility, and print styles.
- `content.js`: Guided lessons, visual-map data, glossary, and scenarios.
- `catalog-snapshot.js`: Bundled Microsoft Learn catalog metadata for offline use.
- `DevOps_Identity_and_Governance_Map.png`: Full-resolution identity and governance infographic.
- `app.js`: Navigation, filtering, progress tracking, practice interactions, and installation support.
- `retain.js`: Successive relearning queue, variable cues, and FSRS-4.5 scheduling.
- `sw.js`: Offline application-shell cache.
- `manifest.webmanifest` and `icon.svg`: Install metadata and application icon.

## Credential guidance

For unattended Azure DevOps access, prefer Microsoft Entra tokens through a managed identity or service principal. Use a short-lived, organization-scoped personal access token with minimum permissions only when a tool cannot use Microsoft Entra authentication.
