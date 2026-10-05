# Azure DevOps Learning Hub

An installable, interactive learning system for building practical Azure DevOps fluency from a complete beginner level. It turns Microsoft Learn material into a guided path, visual models, retrieval practice, and project-manager scenarios. The application works without an account and keeps progress in the learner's browser.

## Open the app

After GitHub Pages is enabled for `main` at the repository root, the public app is available at:

<https://dustinford02.github.io/azure-devops-learning-hub/>

The page also opens locally through a static web server. Installation and offline support require HTTPS or `localhost`.

## What the learner can do

- Begin on a "Start here" page that gives a new learner three short steps: see how the work flows, do the next guided stop, and do the cards for the day.
- See three everyday workflow pictures, from simplest to most complete: a restaurant order, building and inspecting a house, and developing and publishing a training course. Each maps everyday steps to Azure DevOps services.
- Follow a 12-stop path from the Azure DevOps service model through planning, source control, pipelines, testing, artifacts, integrations, security, and administration.
- See the complete delivery lifecycle, platform structure, Boards hierarchy, access model, and pipeline anatomy as interactive visual maps.
- Follow a three-part Power BI reporting lesson in Visual maps: where Analytics view data comes from, how to choose among the three connection methods, and how to connect Power BI Desktop in five steps, with five Microsoft Learn screenshots.
- Study six reference pictures in Visual maps, from general to detailed: the DevOps loop, Microsoft's DevOps application lifecycle, "What is Azure DevOps?", the five core services, the Day 0 learner guide, and the platform orientation mind map as a still picture. Each has a text version, a source line, and a recall prompt.
- Explore an expandable mind map of platform orientation topics: open and close branches, move and zoom the map, read a short explanation of any topic, jump to the matching guided stop, and use recall mode to test yourself.
- Study a full-resolution identity, security, and governance infographic with zoom, pan, and open-original controls.
- Search and filter a bundled snapshot of 79 Microsoft Learn modules and 15 learning paths for Azure DevOps.
- Refresh the catalog from the public Microsoft Learn Catalog API when the endpoint is available.
- Practice in three ways: a daily set of 5 to 10 flashcards with spaced review dates, a weekly quiz of five spoken questions, and project-manager scenarios.
- Track guided lessons and catalog items locally without creating an account.
- Install the app and use its core learning content offline.

## Learning design

Each guided stop contains a concise explanation, a concrete project-manager action, a knowledge check, and official Microsoft documentation. The recurring fraud-detection release scenario makes abstract platform concepts concrete while keeping the technical depth appropriate for a project manager.

The application uses four complementary modes:

1. **Learn:** Read the ordered guided path.
2. **See:** Inspect compact visual models of relationships and flow.
3. **Recall:** Use flashcards and knowledge checks.
4. **Apply:** Respond to delivery scenarios and compare the response with a suggested answer.

## Microsoft sources

The guided content and catalog entries point to official Microsoft material, including:

- [Azure DevOps documentation](https://learn.microsoft.com/en-us/azure/devops/)
- [Azure DevOps get started documentation](https://learn.microsoft.com/en-us/azure/devops/get-started/)
- [Microsoft Learn Azure DevOps training](https://learn.microsoft.com/en-us/training/browse/?expanded=azure&products=azure-devops)
- [Microsoft Learn Catalog API](https://learn.microsoft.com/en-us/training/support/catalog-api)

The embedded catalog snapshot was retrieved on 2026-10-03. Microsoft owns the linked learning material. This project supplies the interactive organization, progress tools, visual explanations, and practice layer.

## Picture credits

Every picture in the app carries a short "Picture credit" line, and the Sources page has a Picture credits list with the full statement for each one: where it came from, which tool made it, and what this hub changed. The wording is in `learning-aids.js` under `pictureCredits`, which also records the basis for each statement.

- **Pictures from Microsoft sources (7):** the five Power BI screenshots and the DevOps application lifecycle diagram are Microsoft's and link to their Microsoft Learn pages. The DevOps loop diagram came from Microsoft's Azure DevOps training course according to the hub owner; its exact course page and original artist are not identified.
- **AI-generated pictures (5):** three reference pictures and the identity and governance infographic were made with Google generative AI, as recorded in the Content Credentials embedded in the original files (two of them, and the infographic's original, name Gemini Notebook, which is Google NotebookLM). The mind map picture was exported from Gemini Notebook according to the hub owner.
- **Pictures drawn for this hub with AI assistance (15):** the twelve guided path step pictures were redrawn with Claude from a Gemini-generated graphic, and the three workflow pictures were drawn with Claude; the hub owner credits Gemini for the original designs.

The picture files were resized or delivered with Claude, so the Content Credentials tag embedded in each file names Claude as the tool that provided the file. The web-sized copies do not carry the original Google credentials; the visible credits state the origin instead.

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
- `content.js`: Guided lessons, visual-map data, workflow analogies, glossary, and scenarios.
- `guided-path/`: Twelve step visuals, one per guided stop, shown directly above each stop's "Apply it" box. They are corrected redraws of the panels in the source graphic "12 Guided Path Steps.jpg"; the wording follows each stop's lesson text.
- `learning-aids.js`: Drawing instructions for the three workflow graphics, the reference picture entries, the Power BI reporting lesson, weekly quiz questions, and extra official reference links shown in Sources.
- `workflows/`: The three workflow graphics shown in Visual maps. Their wording comes from the workflow analogies in `content.js`.
- `reference-pictures/`: The six reference pictures shown in the third tab group of Visual maps. They were supplied by the hub owner and are shown unaltered apart from resizing. Titles, source lines, and text versions are in `learning-aids.js` under `referencePictures`. Two of them, the five core services and the Day 0 learner guide, contain misspelled labels; the app says so and shows the corrected wording as text. Two are third-party pictures: `reference-2-devops-lifecycle.png` is a Microsoft diagram, and the publisher and license of `reference-1-devops-loop.png` are not confirmed. Confirm reuse terms for both before public use.
- `power-bi/`: Five Microsoft Learn screenshots used by the Power BI reporting lesson in the fourth tab group of Visual maps. They are Microsoft's pictures with their picture content unchanged (delivery into this folder added a Content Credentials tag to each file), and each is credited in the app to the Microsoft Learn page it comes from. The lesson wording is in `learning-aids.js` under `reporting`; it is adapted from the Power BI assistant's instruction set of 2026-10-05 and was checked against the linked Microsoft pages on that date. The public repository that holds Microsoft's Azure DevOps documentation source (`MicrosoftDocs/azure-devops-docs`) carries a Creative Commons Attribution 4.0 license file. Confirm that reuse terms cover these screenshots before public use.
- `mindmaps.js`: Mind map topic trees. Topic names come from the notebook mind map; explanations are added by this hub. Append another object to add a map.
- `catalog-snapshot.js`: Bundled Microsoft Learn catalog metadata for offline use.
- `DevOps_Identity_and_Governance_Map.png`: Full-resolution identity and governance infographic.
- `app.js`: Navigation, filtering, progress tracking, practice interactions, and installation support.
- `sw.js`: Offline application-shell cache.
- `manifest.webmanifest` and `icon.svg`: Install metadata and application icon.

## Credential guidance

For unattended Azure DevOps access, prefer Microsoft Entra tokens through a managed identity or service principal. Use a short-lived, organization-scoped personal access token with minimum permissions only when a tool cannot use Microsoft Entra authentication.
