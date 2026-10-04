/*
  Mind map data for the Azure DevOps Learning Hub.

  Status of each field:
  - "label": topic name captured from the notebook mind map named in "source". Kept as written there.
  - "note": explanation added by this hub, checked against Microsoft Learn on the "checked" date.
  - "stop": zero-based index of the related guided-path stop in content.js.
  - "link": official Microsoft page for the topic.

  To add another map, append one more object to the array. The app shows a tab per map.
*/
window.ADO_MINDMAPS = [
  {
    "id": "stage-1",
    "title": "Stage 1: Platform Orientation & Core Concepts",
    "source": "Gemini Notebook mind map",
    "captured": "2026-10-04",
    "checked": "2026-10-04",
    "root": {
      "label": "Platform Orientation & Core Concepts",
      "note": "The starting picture: what Azure DevOps is, how to move around its web portal, and what each of the five core services does.",
      "stop": 0,
      "link": ["What is Azure DevOps?", "https://learn.microsoft.com/en-us/azure/devops/user-guide/what-is-azure-devops?view=azure-devops"],
      "children": [
        {
          "label": "Platform Overview",
          "note": "Azure DevOps is one suite of connected services for planning, coding, building, testing, and releasing software. It is a separate product from the Azure cloud.",
          "stop": 0,
          "link": ["What is Azure DevOps?", "https://learn.microsoft.com/en-us/azure/devops/user-guide/what-is-azure-devops?view=azure-devops"],
          "children": [
            { "label": "Cloud-based platform for development teams", "note": "Azure DevOps Services is the cloud edition that Microsoft hosts and updates. Azure DevOps Server is the edition an organization hosts itself." },
            { "label": "End-to-end project management", "note": "The same platform holds the plan, the code, the builds, the tests, and the packages, so one piece of work can be traced from idea to release." },
            { "label": "Client/server model delivery", "note": "Most features are used in the web portal. Some, such as source control, pipelines, and work tracking, can also be reached from client tools like Visual Studio or the command line.", "link": ["Tools and clients that connect to Azure DevOps", "https://learn.microsoft.com/en-us/azure/devops/user-guide/tools?view=azure-devops"] }
          ]
        },
        {
          "label": "Web Portal Navigation",
          "note": "The web portal is the browser interface. Learn where the service pages, the settings pages, the search box, and your own user settings sit, and most tasks become easy to find.",
          "stop": 8,
          "link": ["Web portal navigation", "https://learn.microsoft.com/en-us/azure/devops/project/navigation/?view=azure-devops"],
          "children": [
            { "label": "Services and administrative pages", "note": "Each service (Boards, Repos, Pipelines, Test Plans, Artifacts) has its own section in the left sidebar. Organization settings and Project settings hold the administrative pages." },
            { "label": "Search box for code and work items", "note": "The search box finds work items, code, commits, wiki pages, and packages you have access to. Code search needs the Code Search extension and is not available to Stakeholder users.", "link": ["Get started with search", "https://learn.microsoft.com/en-us/azure/devops/project/search/get-started-search?view=azure-devops"] },
            { "label": "User profile and personal preferences", "note": "User settings control your profile, theme, time zone, notifications, and preview features. These choices affect only your own view.", "stop": 7, "link": ["Set your preferences", "https://learn.microsoft.com/en-us/azure/devops/organizations/settings/set-your-preferences?view=azure-devops"] }
          ]
        },
        {
          "label": "Azure Boards",
          "note": "Boards is where work is planned and tracked: backlogs, boards, sprints, bugs, and delivery status.",
          "stop": 4,
          "link": ["Plan and track work", "https://learn.microsoft.com/en-us/azure/devops/boards/get-started/plan-track-work?view=azure-devops"],
          "children": [
            { "label": "Work tracking and Agile tools", "note": "Work items record epics, features, stories, bugs, and tasks. The exact names of the work item types depend on the process the project uses." },
            { "label": "Kanban boards and backlogs", "note": "The backlog is the ordered list of work. The board shows the same items as cards that move through columns as work progresses.", "link": ["Create a backlog", "https://learn.microsoft.com/en-us/azure/devops/boards/backlogs/create-your-backlog?view=azure-devops"] },
            { "label": "Sprint planning and burndown charts", "note": "A sprint is a fixed time box for a set of work. The burndown chart shows how much work remains against the days left in the sprint.", "link": ["Define sprints", "https://learn.microsoft.com/en-us/azure/devops/boards/sprints/define-sprints?view=azure-devops"] }
          ]
        },
        {
          "label": "Azure Repos",
          "note": "Repos stores the source code and its full history, and controls how changes are reviewed before they are merged.",
          "stop": 5,
          "link": ["Create a repo", "https://learn.microsoft.com/en-us/azure/devops/repos/git/create-new-repo?view=azure-devops"],
          "children": [
            { "label": "Source code management", "note": "Repositories hold the code. Branches isolate changes, pull requests put changes up for review, and branch policies set the rules a change must meet." },
            { "label": "Git distributed version control", "note": "Git is distributed: every developer has a full copy of the repository and its history on their own machine. It is the default choice for new projects.", "link": ["Clone a repo", "https://learn.microsoft.com/en-us/azure/devops/repos/git/clone?view=azure-devops"] },
            { "label": "Team Foundation Version Control (TFVC)", "note": "TFVC is centralized: the history lives on the server and developers usually keep only one version of each file locally." }
          ]
        },
        {
          "label": "Azure Pipelines",
          "note": "Pipelines automates the path from a code change to a tested, deployed release.",
          "stop": 6,
          "link": ["Create your first pipeline", "https://learn.microsoft.com/en-us/azure/devops/pipelines/create-first-pipeline?view=azure-devops"],
          "children": [
            { "label": "CI/CD automation workflows", "note": "A pipeline is an automated sequence, usually defined in a YAML file kept with the code, that runs when a trigger such as a code change fires." },
            { "label": "Continuous integration and testing", "note": "Each change merged into a shared branch is built and tested automatically, so defects surface soon after they are introduced." },
            { "label": "Continuous delivery deployment", "note": "Builds that pass are promoted through environments such as test and production. Approvals and checks control each step." }
          ]
        },
        {
          "label": "Azure Test Plans",
          "note": "Test Plans records manual and exploratory testing so the team has evidence of what was checked before release.",
          "stop": 10,
          "link": ["Azure Test Plans overview", "https://learn.microsoft.com/en-us/azure/devops/test/overview?view=azure-devops"],
          "children": [
            { "label": "Planned manual testing", "note": "Test plans group test suites and test cases. Testers run each case step by step and record pass or fail." },
            { "label": "Exploratory testing sessions", "note": "Testers explore the product without a script, using the Test & Feedback browser extension to capture screenshots and notes and to file bugs." },
            { "label": "Stakeholder feedback collection", "note": "Stakeholders can use the Test & Feedback extension to capture findings and create bugs or tasks. The formal Request feedback workflow exists in Azure DevOps Server; in the cloud service the request is coordinated by email or chat.", "link": ["Collect and provide stakeholder feedback", "https://learn.microsoft.com/en-us/azure/devops/test/request-stakeholder-feedback?view=azure-devops"] }
          ]
        },
        {
          "label": "Azure Artifacts",
          "note": "Artifacts stores and shares the packages a team produces or depends on.",
          "stop": 10,
          "link": ["Azure Artifacts overview", "https://learn.microsoft.com/en-us/azure/devops/artifacts/start-using-azure-artifacts?view=azure-devops"],
          "children": [
            { "label": "Package management feeds", "note": "A feed is a container that stores packages and controls who can use them. A feed can also pull packages from public registries through upstream sources." },
            { "label": "Supported packages: NuGet, npm, Maven, Python", "note": "Feeds hold NuGet, npm, Maven, and Python packages. Microsoft also lists Cargo and Universal Packages as supported types." },
            { "label": "Free storage limit: 2 GiB", "note": "Each organization gets 2 GiB of Artifacts storage free. Past that limit, new packages cannot be published until packages are deleted or billing is set up.", "link": ["Monitor Artifacts storage consumption", "https://learn.microsoft.com/en-us/azure/devops/artifacts/artifact-storage?view=azure-devops"] }
          ]
        }
      ]
    }
  }
];
