/*
  Learning aids for the Azure DevOps Learning Hub.

  Where each part comes from:
  - "framing": the closing sentence of the Workflow analogies section already in the app.
  - "workflows": drawing instructions for the three everyday workflow pictures in Visual maps. Each entry is matched
    by "title" to an analogy in content.js ("workflowAnalogies"), which holds all of the wording. "icon", "service",
    and "sub" only control how each step is drawn; they must stay in the same order as the steps in content.js.
  - "referencePictures": the reference pictures shown in the third tab group of Visual maps. The image files in
    "reference-pictures/" were supplied by the hub owner on 2026-10-05 and are shown unaltered apart from resizing.
    Each picture's credit is the "pictureCredits" entry with the same "id"; "text" is the text version written by
    this hub; "note" marks a picture whose own labels contain misspellings, so the text version is the correct
    wording. "size" is the display size in CSS pixels. Lines headed "added by this hub" are not in the picture.
  - "reporting": the Power BI reporting lesson shown in the fourth tab group of Visual maps. It is adapted from the
    instruction set that the hub owner's Power BI assistant finished on 2026-10-05 ("INSTRUCTIONS.md" and
    "MANIFEST.md"). Each fact was checked by this hub against the linked Microsoft Learn pages on the "checked" date,
    and wording was adjusted where the page says something more exact. The five screenshots in "power-bi/" are
    Microsoft Learn pictures with their picture content unchanged (the files matched Microsoft's byte counts when
    received; delivery into this folder added a Content Credentials tag to each file). "credit" names the
    "pictureCredits" entry that holds the Microsoft page each one comes from. The recall prompts on the first and third panels are added by this hub. In lesson text,
    two asterisks on each side of a term make it bold. "stop" is the zero-based guided stop the lesson links to.
  - "pictureCredits": the credit for every picture in the app. "short" is shown under the picture; "credit" is the
    full line in the Picture credits list on the Sources page; "link" is the Microsoft page a picture comes from.
    Basis for each statement, as of the "reviewed" date:
      * "Google generative AI" and "Gemini Notebook (Google NotebookLM)": read by this hub from the Content
        Credentials embedded in the original files (three reference pictures and the infographic).
      * The mind map picture, the Gemini origin of "12 Guided Path Steps" and of the workflow design, and the DevOps
        loop coming from Microsoft's Azure DevOps training course: stated by the hub owner. Not independently
        confirmed. The loop's exact course page and original artist are not identified.
      * Claude redrawing the step pictures, drawing the workflow pictures, and correcting the infographic: this
        project's own change records.
      * Microsoft pages: each link was opened and the picture's place on the page confirmed.
  - "quiz": conversational questions for the weekly quiz. Items with "scenario" reuse the reference response of
    that project-manager scenario in content.js (zero-based). Items with "answer" are plain-language answers.
  - "references": official Microsoft pages from the list "azure_devops_training_urls.md" that the guided path
    does not already link. Migration is an administrator topic and is optional. The "Power BI reporting" group
    lists the Microsoft pages behind the Power BI reporting lesson.
*/
window.ADO_AIDS = {
  "framing": "Azure DevOps does not create the product for the team. It connects planning, source control, reviews, testing, and delivery.",
  "workflows": [
    {
      "id": "restaurant", "title": "Restaurant Order", "tab": "Restaurant order", "level": "Simplest",
      "file": "workflow-1-restaurant-order.jpg", "icon": "plate",
      "steps": [
        { "icon": "doc", "service": "boards" },
        { "icon": "list", "service": "repos" },
        { "icon": "gear", "service": "pipelines" },
        { "icon": "check", "service": "test" },
        { "icon": "up", "service": "all" }
      ]
    },
    {
      "id": "house", "title": "Building and Inspecting a House", "tab": "Building a house", "level": "Intermediate",
      "file": "workflow-2-building-a-house.jpg", "icon": "house",
      "steps": [
        { "icon": "list", "service": "boards" },
        { "icon": "doc", "service": "repos" },
        { "icon": "flow", "service": "pipelines" },
        { "icon": "check", "service": "test" },
        { "icon": "box", "service": "artifacts" },
        { "icon": "house", "service": "all" }
      ]
    },
    {
      "id": "course", "title": "Developing and Publishing a Training Course", "tab": "Training course", "level": "Most comprehensive, and the recommended analogy",
      "file": "workflow-3-training-course.jpg", "icon": "book",
      "steps": [
        { "icon": "list", "service": "boards" },
        { "icon": "doc", "service": "repos" },
        { "icon": "merge", "service": "repos", "sub": "Pull requests" },
        { "icon": "gear", "service": "pipelines", "sub": "CI/CD" },
        { "icon": "check", "service": "test" },
        { "icon": "box", "service": "artifacts" },
        { "icon": "up", "service": "all" },
        { "icon": "cycle", "service": "boards", "sub": "New work items" }
      ]
    }
  ],
  "referencePictures": [
    {
      "id": "ref-loop",
      "tab": "DevOps loop",
      "title": "The DevOps loop",
      "file": "reference-1-devops-loop.png",
      "size": [760, 425],
      "intro": "DevOps joins the people who build software (Dev) and the people who run it (Ops) in one loop that never stops. This picture describes DevOps in general. It is not specific to Azure DevOps.",
      "alt": "DevOps loop drawn as a figure eight. The Dev side shows Plan, Create, Verify, and Package. The Ops side shows Release, Configure, and Monitor. The loop then returns to Plan.",
      "text": [
        ["Dev side", ["Plan: decide what to build and in what order.", "Create: write the code and build it.", "Verify: test the change.", "Package: prepare the tested build for release."]],
        ["Ops side", ["Release: move the package toward production.", "Configure: set up the environment the software runs in.", "Monitor: watch how the software behaves, then feed what you learn into the next plan."]],
        ["How it lines up with Azure DevOps (added by this hub)", ["Plan: Azure Boards.", "Create: Azure Repos for the code and Azure Pipelines for the build.", "Verify: Azure Pipelines tests and Azure Test Plans.", "Package: Azure Artifacts.", "Release and Configure: Azure Pipelines, with environments, approvals, and checks.", "Monitor: dashboards and Analytics show delivery progress. Watching the running application is done with tools outside Azure DevOps, such as Azure Monitor."]]
      ],
      "recall": "Without looking, name the four Dev stages and the three Ops stages in order. Which Azure DevOps service supports each one?"
    },
    {
      "id": "ref-lifecycle",
      "tab": "Microsoft DevOps cycle",
      "title": "Microsoft's DevOps application lifecycle",
      "file": "reference-2-devops-lifecycle.png",
      "size": [560, 332],
      "intro": "Microsoft describes DevOps as four phases that repeat around one application: Plan, Develop, Deliver, and Operate. Four habits run through every phase.",
      "alt": "Microsoft diagram of the DevOps application lifecycle. Four phases circle an application: Plan, Develop, Deliver, and Operate. An inner ring reads Collaboration, Workflow, Security and Compliance, and Continuous Improvement.",
      "links": [["What is DevOps? (Microsoft Learn)", "https://learn.microsoft.com/en-us/devops/what-is-devops"]],
      "text": [
        ["The four phases", ["Plan: teams define and describe the features they will build, and track progress with backlogs, boards, and dashboards.", "Develop: teams write, test, review, and integrate code, using version control, automated testing, and continuous integration.", "Deliver: teams deploy the application into production environments in a consistent and reliable way, using continuous delivery and automated gates.", "Operate: teams maintain, monitor, and troubleshoot the application in production, aiming for reliability, high availability, and security."]],
        ["The inner ring: habits in every phase", ["Collaboration.", "Workflow.", "Security and compliance.", "Continuous improvement."]],
        ["How it lines up with Azure DevOps (added by this hub)", ["Plan: Azure Boards.", "Develop: Azure Repos, Azure Pipelines builds, and Azure Test Plans.", "Deliver: Azure Pipelines deployments and Azure Artifacts.", "Operate: tools outside Azure DevOps, such as Azure Monitor. Findings return to Azure Boards as new work."]]
      ],
      "recall": "Name the four phases in order and the four habits in the inner ring. Which phase does your current work sit in?"
    },
    {
      "id": "ref-what-is",
      "tab": "What is Azure DevOps?",
      "title": "What is Azure DevOps?",
      "file": "reference-3-what-is-azure-devops.jpg",
      "size": [1000, 545],
      "intro": "A one-page answer to the first question a new learner asks. Azure DevOps is a cloud-based platform of connected tools that a software team uses to plan work, collaborate on code, build applications, test them, and deploy them.",
      "alt": "Summary picture titled What is Azure DevOps? A banner reads: cloud-based platform providing integrated tools for software development teams. Below it: plan work, collaborate on code, build applications, test functionality, deploy to production. Three panels follow: end-to-end project management, client and server model delivery, and flexible and scalable service options. The full wording is in the text version below the picture.",
      "links": [["What is Azure DevOps? (Microsoft Learn)", "https://learn.microsoft.com/en-us/azure/devops/user-guide/what-is-azure-devops?view=azure-devops"]],
      "text": [
        ["End-to-end project management", ["One connected suite covers the complete life of a software project.", "Plan (backlog), Develop (coding), Test, and Deploy (release) happen in the same place, so one piece of work can be traced from idea to release."]],
        ["Client and server delivery", ["Web interface: most features are used in a browser, through the web portal.", "Client tools: source control, build pipelines, and work tracking can also be reached from tools such as Visual Studio or the command line."]],
        ["Flexible and scalable options", ["Teams of any size can use it.", "Small teams start free: the first five users with Basic access cost nothing.", "Larger teams pay a monthly price for each additional user and pay for extra capacity as they use it."]]
      ],
      "recall": "In one sentence, say what Azure DevOps is. Then name the two ways people reach it and how a small team starts."
    },
    {
      "id": "ref-core",
      "tab": "Five core services",
      "title": "Azure DevOps: five core services",
      "file": "reference-4-core-services.jpg",
      "size": [1000, 545],
      "intro": "The five services side by side, in the order work usually moves through them. Each column lists what the service does and shows a small example of a team using it.",
      "note": "Some labels inside this picture are misspelled or cut off. The picture is shown as supplied. Use the text version below as the correct wording.",
      "alt": "Summary picture titled Azure DevOps: Core Integrated Services. Five columns joined by arrows: Azure Boards, Azure Repos, Azure Pipelines, Azure Test Plans, and Azure Artifacts. Each column has a short feature list and a small scene of a team at work. Some small labels are misspelled. The full, corrected wording is in the text version below the picture.",
      "links": [["What is Azure DevOps? (Microsoft Learn)", "https://learn.microsoft.com/en-us/azure/devops/user-guide/what-is-azure-devops?view=azure-devops"]],
      "text": [
        ["Azure Boards: plan and track work", ["Agile tools: Kanban boards, backlogs, and dashboards.", "Work items such as user stories, bugs, and tasks.", "Sprint planning with burndown charts and velocity tracking.", "Customizable workflows.", "Example: the team uses Boards to plan user stories, track them, and monitor the sprint. The board columns in the drawing should read To Do, Doing, and Done."]],
        ["Azure Repos: source code management", ["Unlimited private Git repositories, or Team Foundation Version Control (TFVC).", "Branch policies.", "Pull requests with reviews.", "Conflict resolution.", "Integration with editors such as Visual Studio and Visual Studio Code.", "Example: the team creates feature branches, submits pull requests for review, and applies policies."]],
        ["Azure Pipelines: build, test, and deploy (CI/CD)", ["CI/CD for any language, platform, or cloud, including Azure, Amazon Web Services, and Google Cloud.", "Support for Docker and Kubernetes.", "Parallel jobs.", "Release approvals and deployment gates.", "Example: code is built and tested automatically, passes a release approval, and is deployed to staging and then to production."]],
        ["Azure Test Plans: testing and tracking", ["Manual test cases and exploratory testing.", "Automated tests, which can be linked to test cases.", "Test suites and results.", "Screenshots and video capture.", "Detailed reporting.", "Example: the quality assurance team runs manual and exploratory tests, captures the results, and generates reports."]],
        ["Azure Artifacts: package management", ["Host and share packages: NuGet, npm, Maven, and Python. Microsoft also lists Cargo and Universal Packages as supported types.", "Integrate with build pipelines and manage packages.", "Control access, upstream sources, and retention policies.", "Example: the development team creates, hosts, and shares common code as packages, for example NuGet packages."]]
      ],
      "recall": "Cover the picture and name the five services in order. Give one job that each service does for the team."
    },
    {
      "id": "ref-day0",
      "tab": "Day 0 learner guide",
      "title": "Day 0 learner guide to Azure DevOps",
      "file": "reference-5-day-0-learner-guide.jpg",
      "size": [1000, 558],
      "intro": "The most detailed one-page summary: how an organization is structured, where the settings are, what each of the five services contains, and how one piece of work connects all five.",
      "note": "Some labels inside this picture are misspelled or cut off. The picture is shown as supplied. Use the text version below as the correct wording.",
      "alt": "Summary picture titled Day 0 Learner Guide to Azure DevOps. Top row: an organization containing two projects, each with two teams, and the four levels of settings (user, team, project, organization). Middle row: five panels for Azure Boards, Azure Repos, Azure Pipelines, Azure Test Plans, and Azure Artifacts. Bottom row: one lifecycle that links a business requirement to a code commit, an automated build, a linked test run, and a published package. Many small labels are misspelled. The full, corrected wording is in the text version below the picture.",
      "links": [["What is Azure DevOps? (Microsoft Learn)", "https://learn.microsoft.com/en-us/azure/devops/user-guide/what-is-azure-devops?view=azure-devops"]],
      "text": [
        ["Structure: organization, project, and team", ["An organization (called a project collection in Azure DevOps Server) is the top-level container for projects.", "Each project keeps its own data separate.", "Inside a project, work is assigned to teams, for example a development team and a quality assurance team. Each team manages its own backlogs, boards, and dashboards."]],
        ["Web portal navigation and settings", ["The sidebar switches between the core services.", "User settings: preferences, preview features, and tokens.", "Team settings: sprint iterations and area paths.", "Project settings: service toggles and security permissions.", "Organization settings: billing, auditing, and global policies."]],
        ["Azure Boards: Agile work item tracking", ["Work items: epics, features, user stories, bugs, and tasks. The exact names depend on the process the project uses.", "Hubs: backlogs, sprints, queries, and delivery plans.", "Web-based work tracking to plan, track, and discuss work across the software development life cycle. It supports Scrum and Kanban ways of working. The four processes are Basic, Agile, Scrum, and CMMI."]],
        ["Azure Repos: version control", ["Git: distributed, with a full local copy for offline work.", "Team Foundation Version Control (TFVC): centralized.", "Branch policies and pull requests (code reviews) control how changes are merged."]],
        ["Azure Pipelines: automated CI/CD builds and releases", ["Continuous integration (CI): code merge, build, and test.", "Continuous delivery (CD): deployment to several environments.", "Pipelines are defined in YAML code or in the Classic visual editor.", "Builds run on cross-platform agents."]],
        ["Azure Test Plans: manual and exploratory quality assurance", ["Planned manual test suites.", "Exploratory testing with the Test & Feedback browser extension.", "Diagnostic data capture: screen recordings through the step-based Test Runner.", "Gathering stakeholder feedback.", "Browser-based test management for quality assurance and user acceptance testing."]],
        ["Azure Artifacts: package feeds and dependency management", ["Package types: NuGet, npm, Maven, Python, Cargo, and Universal Packages.", "Feeds host, share, and consume software dependencies securely.", "Feeds connect directly to CI/CD build pipelines.", "Each organization gets 2 GiB of storage free."]],
        ["One connected lifecycle across all five services", ["A business requirement (Azure Boards) links to a code branch and commit (Azure Repos).", "The commit triggers an automated build (Azure Pipelines).", "The build is validated by a linked test run (Azure Test Plans).", "The result is published as a versioned package (Azure Artifacts)."]]
      ],
      "recall": "Start at the top left and explain the picture out loud: structure, settings, the five services, and then the connected lifecycle at the bottom."
    },
    {
      "id": "ref-mindmap",
      "tab": "Orientation mind map",
      "title": "Platform orientation mind map (picture)",
      "file": "reference-6-orientation-mind-map.png",
      "size": [620, 1004],
      "intro": "The complete Stage 1 mind map on one page, with every branch open. It is the same map as the interactive Mind map section, shown as a still picture that is easy to scan or print.",
      "alt": "Mind map picture. The root topic, Platform Orientation and Core Concepts, branches into seven topics: Platform Overview, Web Portal Navigation, Azure Boards, Azure Repos, Azure Pipelines, Azure Test Plans, and Azure Artifacts. Each topic has three subtopics, listed in the text version below the picture.",
      "view": ["mindmap", "Open the interactive mind map"],
      "text": [
        ["Platform Overview", ["Cloud-based platform for development teams", "End-to-end project management", "Client/server model delivery"]],
        ["Web Portal Navigation", ["Services and administrative pages", "Search box for code and work items", "User profile and personal preferences"]],
        ["Azure Boards", ["Work tracking and Agile tools", "Kanban boards and backlogs", "Sprint planning and burndown charts"]],
        ["Azure Repos", ["Source code management", "Git distributed version control", "Team Foundation Version Control (TFVC)"]],
        ["Azure Pipelines", ["CI/CD automation workflows", "Continuous integration and testing", "Continuous delivery deployment"]],
        ["Azure Test Plans", ["Planned manual testing", "Exploratory testing sessions", "Stakeholder feedback collection"]],
        ["Azure Artifacts", ["Package management feeds", "Supported packages: NuGet, npm, Maven, Python", "Free storage limit: 2 GiB"]]
      ],
      "recall": "Cover the right-hand column. For each of the seven branches, name its three topics."
    }
  ],
  "reporting": {
    "label": "Power BI reporting, in order",
    "checked": "2026-10-05",
    "stop": 10,
    "panels": [
      {
        "id": "pbi-views",
        "tab": "Analytics views",
        "title": "Where the report data comes from",
        "blocks": [
          ["p", "Think of Azure DevOps Analytics as the kitchen prep station and Power BI as the plated meal. Work items from Azure Boards (bugs, stories, and tasks) land in Analytics automatically. You then choose how much of that prep Power BI brings to the table."],
          ["solved", "You can chart backlog health and trends without exporting spreadsheets by hand."],
          ["limit", "The Power BI connector named **Azure DevOps (Boards only)** and Analytics views cover work items from Azure Boards as a flat list. They do not cover pipelines, and they do not show parent and child work item hierarchies. For those needs, Microsoft points you to OData queries."],
          ["h", "What you need in Azure DevOps"],
          ["ul", ["On Azure DevOps Services, Analytics is always on. You cannot turn it off or pause it.", "You must be a member of the project with at least **Basic access**, and you need the **View analytics** permission. Members of the Contributors group have what they need by default.", "People with Stakeholder access cannot view or edit Analytics views.", "To use a shared Analytics view in Power BI, you also need permission to view that view. Contributors have it by default."]],
          ["h", "Open Analytics views"],
          ["p", "In the web portal, open **Boards**, and then select **Analytics views**. If Analytics views is missing from the menu, check that you have permission to view Analytics. In some organizations the feature must also be turned on under Preview features."],
          ["fig", {"file": "01-analytics-views-hub.png", "size": [658, 626], "credit": "pbi-01", "alt": "Screenshot of the Azure DevOps web portal for a project named Fabrikam Fiber. In the left menu, Boards and Analytics views are outlined in red. The main pane is titled Analytics views (Boards only) and lists Shared Views such as Bugs - Last 30 days, Stories - Today, and Tasks - All history by month.", "caption": "Boards, then Analytics views. Shared Views lists the views that everyone on the project can use."}],
          ["p", "Each default view pairs one set of work items with one span of history."],
          ["ul", ["**Work items:** Bugs, the requirement-level type (Stories, Backlog items, or Requirements, depending on the project's process), Tasks, or all Work Items.", "**History:** Today (the latest state only), Last 30 days (daily), Last 26 weeks (weekly), or All history by month."]],
          ["fig", {"file": "02-default-analytics-views.png", "size": [760, 332], "credit": "pbi-02", "alt": "Screenshot of the Analytics views page with the All tab selected. Under Shared Views it lists default views with descriptions: Backlog items - All history by month, Backlog items - Last 26 weeks, Backlog items - Last 30 days, Backlog items - Today, and Bugs - All history by month.", "caption": "Default views. The names follow the project's process: this example shows Backlog items, and an Agile project shows Stories instead."}],
          ["p", "A default view returns everything in the project, which suits a small project. For a large project, create a **custom view** that filters by team, area path, work item type, field, and history, so the data stays small enough to load and refresh."]
        ],
        "recall": "Without looking: which Azure DevOps service supplies the data for an Analytics view, and which two things can a view not show? Then name the four history options.",
        "links": [["About Analytics views", "https://learn.microsoft.com/en-us/azure/devops/report/powerbi/what-are-analytics-views?view=azure-devops"], ["Create an Analytics view in Azure DevOps", "https://learn.microsoft.com/en-us/azure/devops/report/powerbi/analytics-views-create?view=azure-devops"], ["Set permissions to access Analytics and Analytics views", "https://learn.microsoft.com/en-us/azure/devops/report/powerbi/analytics-security?view=azure-devops"], ["Permissions and prerequisites to access Analytics", "https://learn.microsoft.com/en-us/azure/devops/report/analytics/analytics-permissions-prerequisites?view=azure-devops"]]
      },
      {
        "id": "pbi-methods",
        "tab": "Connection methods",
        "title": "Choose how Power BI connects",
        "blocks": [
          ["p", "Microsoft describes three ways to bring Analytics data into Power BI. Pick the one that fits what you need to report on."],
          ["table", {"head": ["Method", "Best for", "Caveat"], "rows": [["Azure DevOps connector with an Analytics view", "Simpler reports on Boards work items", "Boards work items only, as a flat list. No hierarchies and no pipelines."], ["OData queries (Microsoft's recommendation for most cases)", "Filtered or aggregated data, pipelines, and richer models", "You write the OData query, which is similar to writing SQL."], ["Power BI OData Feed connector (browse the data)", "Small organizations exploring what data exists", "Filters run inside Power BI after all the data has been pulled. A large organization can see long refresh times and time-outs."]]}],
          ["fig", {"file": "05-odata-feed-connect.png", "size": [700, 220], "credit": "pbi-05", "alt": "Screenshot of the OData feed window in Power BI. The Basic option is selected. The URL box, outlined in red, holds the end of a one-line OData query. The OK button is outlined.", "caption": "The OData queries method. Paste the one-line query into the URL box of the OData feed window, and then select OK."}],
          ["tip", "Keep each query inside one project. Analytics does not trim results to match your access. If a query spans several projects and you lack access to one of them, the whole query is denied."]
        ],
        "recall": "Cover the table above. Name the three Power BI connection methods and one reason to pick OData queries over the Azure DevOps connector. Then uncover the table and check yourself.",
        "links": [["About Power BI integration", "https://learn.microsoft.com/en-us/azure/devops/report/powerbi/overview?view=azure-devops"], ["Connect with data by using Power BI and OData queries", "https://learn.microsoft.com/en-us/azure/devops/report/powerbi/odataquery-connect?view=azure-devops"], ["Set permissions to access Analytics and Analytics views", "https://learn.microsoft.com/en-us/azure/devops/report/powerbi/analytics-security?view=azure-devops"]]
      },
      {
        "id": "pbi-connect",
        "tab": "Connect in five steps",
        "title": "Connect Power BI Desktop in five steps",
        "blocks": [
          ["p", "This is the shortest route to a first report: one Analytics view, loaded into Power BI Desktop with the Azure DevOps connector."],
          ["ol", [{"text": "In Azure DevOps, open **Boards**, and then select **Analytics views**. Pick a shared view, or create a custom view and verify it."}, {"text": "Open **Power BI Desktop**. Select **Get data**, then **Online Services**, then **Azure DevOps (Boards only)**, and then **Connect**.", "fig": {"file": "03-get-data-azure-devops-connector.png", "size": [612, 640], "credit": "pbi-03", "alt": "Screenshot of Power BI Desktop. Get data is outlined on the Home ribbon. In the Get Data window, Online Services is selected on the left, and two entries are outlined in the list: Azure DevOps (Boards only) and Azure DevOps Server (Boards only). The Connect button is outlined at the bottom.", "caption": "Get data, Online Services, Azure DevOps (Boards only), Connect. Choose Azure DevOps Server (Boards only) only for a server that your organization hosts itself."}}, {"text": "Enter your organization and the **project name**, not the team name, and sign in. For the address dev.azure.com/fabrikam/MyProject/MyTeam, the project name is MyProject."}, {"text": "In the Navigator, expand **Shared Views**, select a view (for example, Work Items - Last 30 days), check the preview, and then select **Load**.", "fig": {"file": "04-navigator-select-view.png", "size": [760, 605], "credit": "pbi-04", "alt": "Screenshot of the Power BI Navigator window. The Shared Views folder, showing 16 views, is outlined and expanded. Each view has a checkbox. The list covers Backlog items, Bugs, Tasks, and Work Items, each for All history by month, Last 26 weeks, Last 30 days, and Today. The Load and Transform Data buttons are at the bottom.", "caption": "The Navigator. Expand Shared Views, select one view, check the preview, and then select Load."}}, {"text": "Build your visuals in Desktop. A refresh pulls the data from the view again. To shrink what Analytics returns, edit the filters on the view itself in Azure DevOps. Filters set in Power BI change what the report shows, but they do not reduce the data that is retrieved."}]],
          ["h", "What it costs"],
          ["ul", ["Power BI Desktop is a free download for Windows. Building a report costs nothing.", "With a free license, you can also publish a report to **My workspace** in the Power BI service for your own use.", "Sharing a report with other people in the Power BI service needs a paid license: **Power BI Pro** or **Premium Per User**.", "One exception for viewers: when a report is stored in a workspace on Power BI Premium capacity, or on Fabric capacity of size F64 or larger, colleagues with a free license can view it.", "If you have no paid license, keep the report in Desktop or in My workspace until a paid license or capacity is available."]]
        ],
        "recall": "Say the five steps out loud. Where do you change a filter when the goal is a smaller, faster dataset?",
        "links": [["Connect Analytics with Power BI Data Connector", "https://learn.microsoft.com/en-us/azure/devops/report/powerbi/data-connector-connect?view=azure-devops"], ["Download Power BI Desktop", "https://learn.microsoft.com/en-us/power-bi/fundamentals/desktop-get-the-desktop"], ["Power BI service features by license type", "https://learn.microsoft.com/en-us/power-bi/fundamentals/service-features-license-type"], ["Power BI features available to free users", "https://learn.microsoft.com/en-us/power-bi/fundamentals/end-user-features"]]
      }
    ]
  },
  "pictureCredits": {
    "intro": "Every picture in this hub is listed here with where it came from, which tool made it, and what this hub changed. The same credit appears in short form under each picture.",
    "reviewed": "2026-10-05",
    "footnote": "About embedded tags: the picture files in this hub were resized or delivered with Claude, so the Content Credentials tag inside each file names Claude as the tool that provided the file. That tag does not mean Claude drew the picture. The credits above state where each picture came from.",
    "groups": [
      {
        "title": "Pictures from Microsoft sources",
        "note": "Screenshots and diagrams taken from Microsoft pages and shown for teaching. Unless a line says otherwise, the picture belongs to Microsoft. Microsoft publishes the source of its Azure DevOps documentation under the Creative Commons Attribution 4.0 license.",
        "items": [
          {"id": "pbi-01", "name": "Analytics views in the web portal (screenshot)", "where": "Visual maps, Power BI reporting, Analytics views", "files": "power-bi/01-analytics-views-hub.png", "short": "Screenshot © Microsoft, from Microsoft Learn.", "credit": "Screenshot © Microsoft, from Microsoft Learn. This hub did not resize or change the picture.", "link": ["Create an Analytics view in Azure DevOps", "https://learn.microsoft.com/en-us/azure/devops/report/powerbi/analytics-views-create?view=azure-devops"]},
          {"id": "pbi-02", "name": "Default Analytics views (screenshot)", "where": "Visual maps, Power BI reporting, Analytics views", "files": "power-bi/02-default-analytics-views.png", "short": "Screenshot © Microsoft, from Microsoft Learn.", "credit": "Screenshot © Microsoft, from Microsoft Learn. This hub did not resize or change the picture.", "link": ["About Analytics views", "https://learn.microsoft.com/en-us/azure/devops/report/powerbi/what-are-analytics-views?view=azure-devops"]},
          {"id": "pbi-03", "name": "Get data in Power BI Desktop (screenshot)", "where": "Visual maps, Power BI reporting, Connect in five steps", "files": "power-bi/03-get-data-azure-devops-connector.png", "short": "Screenshot © Microsoft, from Microsoft Learn.", "credit": "Screenshot © Microsoft, from Microsoft Learn. This hub did not resize or change the picture.", "link": ["Connect Analytics with Power BI Data Connector", "https://learn.microsoft.com/en-us/azure/devops/report/powerbi/data-connector-connect?view=azure-devops"]},
          {"id": "pbi-04", "name": "Navigator with Shared Views (screenshot)", "where": "Visual maps, Power BI reporting, Connect in five steps", "files": "power-bi/04-navigator-select-view.png", "short": "Screenshot © Microsoft, from Microsoft Learn.", "credit": "Screenshot © Microsoft, from Microsoft Learn. This hub did not resize or change the picture.", "link": ["Connect Analytics with Power BI Data Connector", "https://learn.microsoft.com/en-us/azure/devops/report/powerbi/data-connector-connect?view=azure-devops"]},
          {"id": "pbi-05", "name": "OData feed window (screenshot)", "where": "Visual maps, Power BI reporting, Connection methods", "files": "power-bi/05-odata-feed-connect.png", "short": "Screenshot © Microsoft, from Microsoft Learn.", "credit": "Screenshot © Microsoft, from Microsoft Learn. This hub did not resize or change the picture.", "link": ["Connect with data by using Power BI and OData queries", "https://learn.microsoft.com/en-us/azure/devops/report/powerbi/odataquery-connect?view=azure-devops"]},
          {"id": "ref-lifecycle", "name": "Microsoft's DevOps application lifecycle (diagram)", "where": "Visual maps, Reference pictures", "files": "reference-pictures/reference-2-devops-lifecycle.png", "short": "Diagram © Microsoft, from Microsoft Learn.", "credit": "Diagram © Microsoft, from Microsoft Learn. This hub placed it on a white background and made no other change.", "link": ["What is DevOps?", "https://learn.microsoft.com/en-us/devops/what-is-devops"]},
          {"id": "ref-loop", "name": "The DevOps loop (diagram)", "where": "Visual maps, Reference pictures", "files": "reference-pictures/reference-1-devops-loop.png", "short": "From Microsoft's Azure DevOps training course, as reported by the hub owner. The exact course page and the original artist are not identified.", "credit": "From Microsoft's Azure DevOps training course, as reported by the hub owner. The exact course page and the original artist are not identified, so this hub does not state who owns the picture. This hub placed it on a white background and made no other change."}
        ]
      },
      {
        "title": "AI-generated pictures",
        "note": "These pictures were generated by an AI tool. A person did not draw them, and Microsoft did not make them. AI-generated pictures can contain mistakes. Where one has wrong or misspelled labels, its page says so and gives the correct wording as text.",
        "items": [
          {"id": "ref-what-is", "name": "What is Azure DevOps? (summary picture)", "where": "Visual maps, Reference pictures", "files": "reference-pictures/reference-3-what-is-azure-devops.jpg", "short": "AI-generated with Google generative AI. Not a Microsoft picture.", "credit": "AI-generated. Made with Google generative AI, as recorded in the Content Credentials embedded in the original file. Supplied by the hub owner. Its own label reads \"Simplified summary based on learn.microsoft.com\". It is not a Microsoft picture. This hub resized it and made no other change."},
          {"id": "ref-core", "name": "Azure DevOps: five core services (summary picture)", "where": "Visual maps, Reference pictures", "files": "reference-pictures/reference-4-core-services.jpg", "short": "AI-generated with Google generative AI. Not a Microsoft picture.", "credit": "AI-generated. Made with Google generative AI, as recorded in the Content Credentials embedded in the original file. Supplied by the hub owner. Its own label reads \"Summarized from learn.microsoft.com\". It is not a Microsoft picture. Some small labels are misspelled as generated; the correct wording is in the text version on its page. This hub resized it and made no other change."},
          {"id": "ref-day0", "name": "Day 0 learner guide to Azure DevOps (summary picture)", "where": "Visual maps, Reference pictures", "files": "reference-pictures/reference-5-day-0-learner-guide.jpg", "short": "AI-generated with Google generative AI in Gemini Notebook. Not a Microsoft picture.", "credit": "AI-generated. Made with Google generative AI in Gemini Notebook (Google NotebookLM), as recorded in the Content Credentials embedded in the original file and shown by the watermark on the picture. Supplied by the hub owner. It is not a Microsoft picture. Many small labels are misspelled as generated; the correct wording is in the text version on its page. This hub resized it and made no other change."},
          {"id": "ref-mindmap", "name": "Platform orientation mind map (picture)", "where": "Visual maps, Reference pictures", "files": "reference-pictures/reference-6-orientation-mind-map.png", "short": "AI-generated mind map, exported from Gemini Notebook by the hub owner.", "credit": "AI-generated mind map, exported as a picture from Gemini Notebook (Google NotebookLM) by the hub owner. The file carries no maker information, so this credit rests on the hub owner's statement. This hub resized it and made no other change. The interactive Mind map section uses the same topic names; its explanations are written by this hub."},
          {"id": "infographic", "name": "Identity, Security & Governance Workflow Map (infographic)", "where": "Infographics", "files": "DevOps_Identity_and_Governance_Map.png", "short": "AI-generated with Google generative AI in Gemini Notebook. Two text blocks corrected by this hub. Not a Microsoft picture.", "credit": "AI-generated. Made with Google generative AI in Gemini Notebook (Google NotebookLM), as recorded in the Content Credentials embedded in the original file. Supplied by the hub owner. It is not a Microsoft picture. This hub redrew two text blocks to correct them (Basic access and Stakeholder access) and resized the picture."}
        ]
      },
      {
        "title": "Pictures drawn for this hub with AI assistance",
        "note": "These pictures were made for this hub. An AI assistant drew them from the hub's own lesson text, so their wording follows the lessons.",
        "items": [
          {"id": "guided", "name": "Twelve guided path step pictures", "where": "Guided path, one per stop", "files": "guided-path/ (12 files)", "short": "Redrawn for this hub with Claude, an AI assistant, from a Gemini-generated graphic.", "credit": "The design comes from an AI-generated graphic, \"12 Guided Path Steps\", made with Gemini and supplied by the hub owner. Each panel was then redrawn and corrected for this hub with Claude, an AI assistant made by Anthropic, so that the wording follows the lesson text."},
          {"id": "workflow", "name": "Three workflow pictures: Restaurant order, Building a house, and Training course", "where": "Visual maps, Everyday pictures", "files": "workflows/ (3 files)", "short": "Drawn for this hub with Claude, an AI assistant. Original design credited to Gemini by the hub owner.", "credit": "Drawn for this hub with Claude, an AI assistant made by Anthropic, from the hub's workflow analogy text. The hub owner credits Gemini for the original design."}
        ]
      }
    ]
  },
  "quiz": [
    { "speaker": "A colleague", "line": "What is Azure DevOps, exactly?", "ask": "What do you say?", "answer": "It is the system that runs the software factory: plan the work, keep the code, build and test it, and store the finished package. Azure itself is the cloud you rent. DevOps is how the work moves." },
    { "speaker": "A sponsor", "line": "Where does the fraud release stand?", "ask": "What do you say?", "scenario": 0 },
    { "speaker": "A colleague", "line": "Boards or Repos: which one is the backlog?", "ask": "What do you say?", "scenario": 5 },
    { "speaker": "An engineer", "line": "The pipeline failed.", "ask": "What do you say?", "answer": "A pipeline builds and tests the change automatically. A failure means the change did not pass the gate, so it should not ship until the cause is fixed and the run is green." },
    { "speaker": "A new project manager", "line": "Which interface should I learn first?", "ask": "What do you say?", "scenario": 9 },

    { "speaker": "A colleague", "line": "What is a pull request, in plain language?", "ask": "What do you say?", "answer": "It is a proposed change to the code. Teammates review it, and if branch policies require it, a build must pass and a work item must be linked before it merges into the main version." },
    { "speaker": "An engineer", "line": "The release pull request is still open.", "ask": "What do you ask?", "scenario": 2 },
    { "speaker": "A colleague", "line": "How is a sprint different from a milestone on the program schedule?", "ask": "What do you say?", "answer": "A sprint is a fixed short work window, usually two weeks, where the team commits to a set of work and finishes it. A milestone is a promised date you owe the customer. Boards tracks the sprint; the program schedule still owns the milestone." },
    { "speaker": "An engineer", "line": "The fraud-data dependency is threatening the sprint goal.", "ask": "What do you say?", "scenario": 1 },
    { "speaker": "A stakeholder", "line": "What has to happen before we see the release?", "ask": "What do you say?", "scenario": 4 },

    { "speaker": "A colleague", "line": "Continuous delivery or continuous deployment: what is the difference?", "ask": "What do you say?", "answer": "Continuous delivery means every change that passes the pipeline is built, tested, and deployed through environments such as test and production, and approvals and checks can gate each stage. Continuous deployment removes the manual approval, so a passing change reaches production automatically. Same pipeline, different last gate." },
    { "speaker": "An engineer", "line": "The pipeline failed.", "ask": "What do you ask?", "scenario": 3 },
    { "speaker": "A manager", "line": "A contractor needs access to one project only. How do we set that up?", "ask": "What do you say?", "answer": "Through the company login, not a separate account. Entra ID carries the identity and the project role carries the permission, so you grant the lowest role that does the job on that one project." },
    { "speaker": "An engineer", "line": "I am a Contributor, but I cannot push.", "ask": "What do you say?", "scenario": 7 },
    { "speaker": "A manager", "line": "An outside fraud specialist needs to review the plan but not change it.", "ask": "What do you say?", "scenario": 6 },

    { "speaker": "A colleague", "line": "What is a build agent?", "ask": "What do you say?", "answer": "The worker that actually runs the job. The pipeline is the set of instructions; the agent is the machine that carries out the steps. Microsoft-hosted agents are rented and start clean for each run. Self-hosted agents are your own machines, which you maintain but fully control." },
    { "speaker": "An engineer", "line": "The pipeline definition is correct, but no job starts.", "ask": "What do you say?", "scenario": 10 },
    { "speaker": "A release lead", "line": "The build succeeded, but we cannot find the package.", "ask": "What do you say?", "scenario": 12 },
    { "speaker": "A tester", "line": "The dashboard is green, but a required test is missing.", "ask": "What do you say?", "scenario": 13 },
    { "speaker": "A program lead", "line": "Why would a defense contractor care about this?", "ask": "What do you say?", "answer": "Every change is tracked, reviewed, and tied to a result. That is configuration management with an audit trail, plus company login and role-based access through Entra ID." },

    { "speaker": "An engineer", "line": "A script needs to read the repo overnight. What do we give it?", "ask": "What do you say?", "answer": "Prefer a Microsoft Entra identity, such as a service principal or managed identity, with read access to that one repo. If the tool can only use a personal access token, scope it to read that repo, set a short expiry, and revoke it when the job ends. Either credential acts as whoever owns it, so keep it in a protected secret store." },
    { "speaker": "An engineer", "line": "The pipeline has to deploy to Azure without anyone signing in.", "ask": "What do you say?", "scenario": 11 },
    { "speaker": "An engineer", "line": "This legacy script can only use a personal access token.", "ask": "What do you say?", "scenario": 14 }
  ],
  "references": [
    ["Core concepts", [
      ["What is Azure Boards?", "https://learn.microsoft.com/en-us/azure/devops/boards/get-started/what-is-azure-boards"],
      ["What is Azure Repos?", "https://learn.microsoft.com/en-us/azure/devops/repos/get-started/what-is-repos"],
      ["What is Azure Pipelines?", "https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/what-is-azure-pipelines"]
    ]],
    ["Sign up and setup", [
      ["Sign up for Azure Boards", "https://learn.microsoft.com/en-us/azure/devops/boards/get-started/sign-up-invite-teammates"],
      ["Sign up for Azure Repos", "https://learn.microsoft.com/en-us/azure/devops/repos/get-started/sign-up-invite-teammates"],
      ["Sign up for Azure Pipelines", "https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/pipelines-sign-up"]
    ]],
    ["Projects, users, and security", [
      ["Manage your project", "https://learn.microsoft.com/en-us/azure/devops/user-guide/project-admin-tutorial"],
      ["Delete or restore a project", "https://learn.microsoft.com/en-us/azure/devops/organizations/projects/delete-project"],
      ["Add a project administrator", "https://learn.microsoft.com/en-us/azure/devops/organizations/security/change-project-level-permissions"],
      ["Add a project collection administrator", "https://learn.microsoft.com/en-us/azure/devops/organizations/security/change-organization-collection-level-permissions"],
      ["Security overview", "https://learn.microsoft.com/en-us/azure/devops/organizations/security/security-overview"],
      ["Permission lookup guide", "https://learn.microsoft.com/en-us/azure/devops/organizations/security/permissions-lookup-guide"],
      ["About settings", "https://learn.microsoft.com/en-us/azure/devops/organizations/settings/about-settings"]
    ]],
    ["Azure Boards", [
      ["Use boards", "https://learn.microsoft.com/en-us/azure/devops/boards/boards/kanban-quickstart"]
    ]],
    ["Azure Repos", [
      ["Authenticate with SSH", "https://learn.microsoft.com/en-us/azure/devops/repos/git/use-ssh-keys-to-authenticate"],
      ["Use the command line", "https://learn.microsoft.com/en-us/azure/devops/repos/git/command-prompt"],
      ["Search code across projects", "https://learn.microsoft.com/en-us/azure/devops/project/search/functional-code-search"]
    ]],
    ["Azure Pipelines", [
      ["YAML schema", "https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema/"]
    ]],
    ["Personalization and navigation", [
      ["Preview new features", "https://learn.microsoft.com/en-us/azure/devops/project/navigation/preview-features"],
      ["Set favorites", "https://learn.microsoft.com/en-us/azure/devops/project/navigation/set-favorites"],
      ["Team Explorer navigation", "https://learn.microsoft.com/en-us/azure/devops/user-guide/work-team-explorer"]
    ]],
    ["Troubleshooting", [
      ["All troubleshooting guides and FAQs", "https://learn.microsoft.com/en-us/azure/devops/troubleshoot/"]
    ]],
    ["Power BI reporting", [
      ["About Power BI integration", "https://learn.microsoft.com/en-us/azure/devops/report/powerbi/overview?view=azure-devops"],
      ["Connect Analytics with Power BI Data Connector", "https://learn.microsoft.com/en-us/azure/devops/report/powerbi/data-connector-connect?view=azure-devops"],
      ["About Analytics views", "https://learn.microsoft.com/en-us/azure/devops/report/powerbi/what-are-analytics-views?view=azure-devops"],
      ["Create an Analytics view in Azure DevOps", "https://learn.microsoft.com/en-us/azure/devops/report/powerbi/analytics-views-create?view=azure-devops"],
      ["Set permissions to access Analytics and Analytics views", "https://learn.microsoft.com/en-us/azure/devops/report/powerbi/analytics-security?view=azure-devops"],
      ["Permissions and prerequisites to access Analytics", "https://learn.microsoft.com/en-us/azure/devops/report/analytics/analytics-permissions-prerequisites?view=azure-devops"],
      ["Connect with data by using Power BI and OData queries", "https://learn.microsoft.com/en-us/azure/devops/report/powerbi/odataquery-connect?view=azure-devops"],
      ["Download Power BI Desktop", "https://learn.microsoft.com/en-us/power-bi/fundamentals/desktop-get-the-desktop"],
      ["Power BI service features by license type", "https://learn.microsoft.com/en-us/power-bi/fundamentals/service-features-license-type"],
      ["Power BI features available to free users", "https://learn.microsoft.com/en-us/power-bi/fundamentals/end-user-features"]
    ]],
    ["Migration (administrator topic, optional)", [
      ["Get started", "https://learn.microsoft.com/en-us/azure/devops/migrate/migration-get-started"],
      ["Prerequisites", "https://learn.microsoft.com/en-us/azure/devops/migrate/migration-prerequisites"],
      ["Validate", "https://learn.microsoft.com/en-us/azure/devops/migrate/migration-validate"],
      ["Prepare test run", "https://learn.microsoft.com/en-us/azure/devops/migrate/migration-prepare-test-run"],
      ["Test run", "https://learn.microsoft.com/en-us/azure/devops/migrate/migration-test-run"],
      ["Migrate", "https://learn.microsoft.com/en-us/azure/devops/migrate/migration-migrate"],
      ["Post-migration", "https://learn.microsoft.com/en-us/azure/devops/migrate/migration-post-migration"],
      ["Troubleshoot migration", "https://learn.microsoft.com/en-us/azure/devops/migrate/migration-troubleshooting"]
    ]]
  ]
};
