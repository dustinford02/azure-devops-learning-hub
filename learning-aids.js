/*
  Learning aids for the Azure DevOps Learning Hub.

  Where each part comes from:
  - "framing": the closing sentence of the Workflow analogies section already in the app.
  - "workflows": drawing instructions for the three everyday workflow pictures in Visual maps. Each entry is matched
    by "title" to an analogy in content.js ("workflowAnalogies"), which holds all of the wording. "icon", "service",
    and "sub" only control how each step is drawn; they must stay in the same order as the steps in content.js.
  - "quiz": conversational questions for the weekly quiz. Items with "scenario" reuse the reference response of
    that project-manager scenario in content.js (zero-based). Items with "answer" are plain-language answers.
  - "references": official Microsoft pages from the list "azure_devops_training_urls.md" that the guided path
    does not already link. Migration is an administrator topic and is optional.
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
  "quiz": [
    { "speaker": "A colleague", "line": "What is Azure DevOps, exactly?", "ask": "What do you say?", "answer": "It is the system that runs the software factory: plan the work, keep the code, build and test it, and store the finished package. Azure itself is the cloud you rent. DevOps is how the work moves." },
    { "speaker": "A sponsor", "line": "Where does the fraud release stand?", "ask": "What do you say?", "scenario": 0 },
    { "speaker": "A colleague", "line": "Boards or Repos: which one is the backlog?", "ask": "What do you say?", "scenario": 5 },
    { "speaker": "An engineer", "line": "The pipeline failed.", "ask": "What do you say?", "answer": "A pipeline builds and tests the change automatically. A failure means the change did not pass the gate, so it should not ship until the cause is fixed and the run is green." },
    { "speaker": "A new project manager", "line": "Which interface should I learn first?", "ask": "What do you say?", "scenario": 9 },

    { "speaker": "A colleague", "line": "What is a pull request, in plain language?", "ask": "What do you say?", "answer": "It is a proposed change to the code. Someone reviews it, checks run, and only then does it become part of the main version." },
    { "speaker": "An engineer", "line": "The release pull request is still open.", "ask": "What do you ask?", "scenario": 2 },
    { "speaker": "A colleague", "line": "How is a sprint different from a milestone on the program schedule?", "ask": "What do you say?", "answer": "A sprint is a fixed short work window, usually two weeks, where the team commits to a set of work and finishes it. A milestone is a promised date you owe the customer. Boards tracks the sprint; the program schedule still owns the milestone." },
    { "speaker": "An engineer", "line": "The fraud-data dependency is threatening the sprint goal.", "ask": "What do you say?", "scenario": 1 },
    { "speaker": "A stakeholder", "line": "What has to happen before we see the release?", "ask": "What do you say?", "scenario": 4 },

    { "speaker": "A colleague", "line": "Continuous delivery or continuous deployment: what is the difference?", "ask": "What do you say?", "answer": "Delivery means every change that passes the pipeline is packaged and ready, and a person decides when it is released. Deployment means it is released automatically with no human gate. Same pipeline, different last step." },
    { "speaker": "An engineer", "line": "The pipeline failed.", "ask": "What do you ask?", "scenario": 3 },
    { "speaker": "A manager", "line": "A contractor needs access to one project only. How do we set that up?", "ask": "What do you say?", "answer": "Through the company login, not a separate account. Entra ID carries the identity and the project role carries the permission, so you grant the lowest role that does the job on that one project." },
    { "speaker": "An engineer", "line": "I am a Contributor, but I cannot push.", "ask": "What do you say?", "scenario": 7 },
    { "speaker": "A manager", "line": "An outside fraud specialist needs to review the plan but not change it.", "ask": "What do you say?", "scenario": 6 },

    { "speaker": "A colleague", "line": "What is a build agent?", "ask": "What do you say?", "answer": "The worker that actually runs the job. The pipeline is the set of instructions; the agent is the machine that carries out the steps. Microsoft-hosted agents are rented and start clean for each run. Self-hosted agents are your own machines, which you maintain but fully control." },
    { "speaker": "An engineer", "line": "The pipeline definition is correct, but no job starts.", "ask": "What do you say?", "scenario": 10 },
    { "speaker": "A release lead", "line": "The build succeeded, but we cannot find the package.", "ask": "What do you say?", "scenario": 12 },
    { "speaker": "A tester", "line": "The dashboard is green, but a required test is missing.", "ask": "What do you say?", "scenario": 13 },
    { "speaker": "A program lead", "line": "Why would a defense contractor care about this?", "ask": "What do you say?", "answer": "Every change is tracked, reviewed, and tied to a result. That is configuration management with an audit trail, plus company login and role-based access through Entra ID." },

    { "speaker": "An engineer", "line": "A script needs to read the repo overnight. What do we give it?", "ask": "What do you say?", "answer": "A personal access token scoped to read that one repo, with a short expiry. The risk is that it acts as you, so it does whatever its scope allows if it leaks. Revoke it when the job is done." },
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
