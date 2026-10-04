window.ADO_CONTENT = {
  "generatedAt": "2026-10-03",
  "path": [
    {
      "place": "Program brief",
      "title": "Know the delivery system",
      "lesson": "<p><strong>Azure DevOps</strong> is a suite for planning, coding, building, testing, and packaging software; it is separate from the Azure cloud. In the Fraud Detection project, <strong>Boards</strong> holds the backlog, sprint, and reported dependency; <strong>Repos</strong> holds engineering’s work; <strong>Pipelines</strong> moves the release; <strong>Test Plans</strong> records the checks before stakeholder review; and <strong>Artifacts</strong> stores the package the release produces.</p><p><strong>Stakeholder</strong> access is a free, limited access level suited to people who mainly view and update work items. It is not a universal read-only role: features such as private-project Repos and Test Plans require higher access or licensing.</p>",
      "action": "If you already have access to an Azure DevOps project, open it and note which of the five service icons are enabled. If you do not have access yet, use the Visual maps instead. Either way, state what each service contributes to the Fraud Detection release.",
      "question": "Which service holds a sprint backlog, and which service holds source code?",
      "answer": "Boards holds the sprint backlog. Repos holds source code.",
      "links": [
        [
          "What is Azure DevOps?",
          "https://learn.microsoft.com/en-us/azure/devops/user-guide/what-is-azure-devops?view=azure-devops"
        ],
        [
          "Get started as a Stakeholder",
          "https://learn.microsoft.com/en-us/azure/devops/organizations/security/get-started-stakeholder?view=azure-devops"
        ]
      ]
    },
    {
      "place": "Project access",
      "title": "Sign up or connect to a project",
      "lesson": "<p>An <strong>organization</strong> contains projects; a <strong>project</strong> contains teams, work, repos, and pipelines. A new user might create an organization, accept an invitation, or switch directories and organizations before choosing a project.</p><p>Your PM task is usually to confirm the correct organization, project, and team, not to create duplicate spaces when a link seems missing.</p>",
      "action": "Write down the organization URL, Fraud Detection project name, delivery team name, and the person who can grant access. If you have access, open the project Summary page.",
      "question": "You can sign in but cannot see the expected project. What four things should you verify first?",
      "answer": "The account, Entra directory, organization, and whether you were added to the project or team.",
      "links": [
        [
          "Sign up for Azure DevOps",
          "https://learn.microsoft.com/en-us/azure/devops/user-guide/sign-up-invite-teammates?view=azure-devops"
        ],
        [
          "Connect to a project",
          "https://learn.microsoft.com/en-us/azure/devops/organizations/projects/connect-to-projects?view=azure-devops"
        ]
      ]
    },
    {
      "place": "Project setup",
      "title": "Create the project and team",
      "lesson": "<p>A project is the main boundary for work, code, and delivery settings. This learning path uses one Fraud Detection project and one delivery team so the backlog, board, sprint, repo, and release stay connected.</p><p>A <strong>Project Administrator</strong> runs one project. A <strong>Project Collection Administrator</strong> can govern every project and organization-level settings, so that role should be rare.</p>",
      "action": "In a sandbox or on paper, define the Fraud Detection project’s visibility, process, delivery team, team administrator, and initial members.",
      "question": "Who should add a new team and adjust its project settings: a project admin or a collection admin?",
      "answer": "Normally a project admin. Collection admin is broader than needed.",
      "links": [
        [
          "Manage a project",
          "https://learn.microsoft.com/en-us/azure/devops/organizations/projects/about-projects?view=azure-devops"
        ],
        [
          "Create a project",
          "https://learn.microsoft.com/en-us/azure/devops/organizations/projects/create-project?view=azure-devops"
        ],
        [
          "Add users to a project or team",
          "https://learn.microsoft.com/en-us/azure/devops/organizations/security/add-users-team-project?view=azure-devops"
        ]
      ]
    },
    {
      "place": "Access review",
      "title": "Understand access, permissions, and billing",
      "lesson": "<p><strong>Access levels</strong> decide which product features a person can use; <strong>permissions</strong> decide what that person can do in a specific scope. Readers can view a project, Contributors can change work and code, Project Administrators can configure one project, Build Administrators manage build resources, and Collection Administrators have organization-wide power. When Allow and Deny meet at the same scope, <strong>Deny</strong> wins. An explicit setting on a child object, such as one repo or area path, replaces what that identity inherits from the parent.</p><p>Billing is attached to the organization’s Azure subscription and covers paid user access, parallel pipeline jobs, and services such as Artifacts storage. PMs should know the billing owner and request the least access that gets the work done.</p>",
      "action": "For the PM, engineer, stakeholder reviewer, and outside fraud specialist, write the minimum access level or group each needs. Distinguish who can change the plan from who can only read it.",
      "question": "A user is in Contributors but still cannot push to a repo. What should you inspect?",
      "answer": "Their access level, repo or branch permissions, inherited group membership, and any explicit Deny.",
      "links": [
        [
          "Security and identity overview",
          "https://learn.microsoft.com/en-us/azure/devops/organizations/security/about-security-identity?view=azure-devops"
        ],
        [
          "Default permissions and access",
          "https://learn.microsoft.com/en-us/azure/devops/organizations/security/permissions-access?view=azure-devops"
        ],
        [
          "Set up billing",
          "https://learn.microsoft.com/en-us/azure/devops/organizations/billing/set-up-billing-for-your-organization-vs?view=azure-devops"
        ]
      ]
    },
    {
      "place": "Delivery plan",
      "title": "Plan and track work",
      "lesson": "<p>The <strong>backlog</strong> is the ordered demand for the fraud-detection initiative. A <strong>sprint</strong> is a time-box with selected work and capacity; the <strong>board</strong> visualizes flow through states. As PM, keep the detection outcome and acceptance criteria clear, ordering intentional, ownership visible, and the data-feed dependency linked.</p><p>Use queries, sprint views, and board columns to report status from live work, not a second hand-maintained status list.</p>",
      "action": "Create or draft a fraud-detection feature and three child stories. Add acceptance criteria, owners, effort, the external data-feed dependency, and assign the next-ready stories to a sprint.",
      "question": "Where do you reorder future demand, plan a time-box, and inspect flow?",
      "answer": "Backlog for demand, Sprints for the time-box, and Boards for flow.",
      "links": [
        [
          "Plan and track work",
          "https://learn.microsoft.com/en-us/azure/devops/boards/get-started/plan-track-work?view=azure-devops"
        ],
        [
          "Create a backlog",
          "https://learn.microsoft.com/en-us/azure/devops/boards/backlogs/create-your-backlog?view=azure-devops"
        ],
        [
          "Define sprints",
          "https://learn.microsoft.com/en-us/azure/devops/boards/sprints/define-sprints?view=azure-devops"
        ]
      ]
    },
    {
      "place": "Engineering handoff",
      "title": "Collaborate on code at PM altitude",
      "lesson": "<p>A Git <strong>repo</strong> stores engineering’s code history. Engineers clone it locally, work on branches, push changes, and use pull requests for review. SSH is one authentication option; code search helps locate ownership or impact without downloading everything.</p><p>For the fraud release, know which repo and branch are involved, which pull request carries the detection change, what checks are pending, and which work item it delivers. Git permissions such as Read, Contribute, Create branch, and bypass policies can block or protect those actions.</p>",
      "action": "Open the fraud-detection repo and locate its default branch, release pull request, linked work item, reviewers, and required checks. Do not change code.",
      "question": "What five identifiers help you discuss a code change with an engineer?",
      "answer": "Project, repo, branch, pull request, and linked work item (plus its pipeline/check status).",
      "links": [
        [
          "Create a repo",
          "https://learn.microsoft.com/en-us/azure/devops/repos/git/create-new-repo?view=azure-devops"
        ],
        [
          "Clone a repo",
          "https://learn.microsoft.com/en-us/azure/devops/repos/git/clone?view=azure-devops"
        ],
        [
          "Set Git permissions",
          "https://learn.microsoft.com/en-us/azure/devops/repos/git/set-git-repository-permissions?view=azure-devops"
        ]
      ]
    },
    {
      "place": "Release control",
      "title": "Follow build and deployment",
      "lesson": "<p>A pipeline automates build, test, and deployment steps. Its YAML file is the versioned pipeline definition; <strong>variables</strong> supply reusable values, while secrets need protected storage. Triggers and branch filters decide whether one or multiple branches build.</p><p>For the time-bound fraud release, follow the run, stage, approvals, environment, and linked commit or work item. A red run is evidence to investigate, not automatically a schedule status or a reason to rerun blindly. The successful release can publish a versioned package to Artifacts.</p>",
      "action": "Open the fraud release pipeline and identify its trigger, branch, stages, checks, Test Plans evidence, deployment environment, approver, and produced artifact.",
      "question": "Where are pipeline steps described, and what controls which branches trigger a build?",
      "answer": "Usually in a YAML file; trigger and branch-filter configuration controls the branches.",
      "links": [
        [
          "Create your first pipeline",
          "https://learn.microsoft.com/en-us/azure/devops/pipelines/create-first-pipeline?view=azure-devops"
        ],
        [
          "Build multiple branches",
          "https://learn.microsoft.com/en-us/azure/devops/pipelines/repos/pipeline-options-for-git?view=azure-devops"
        ],
        [
          "Pipeline variables",
          "https://learn.microsoft.com/en-us/azure/devops/pipelines/process/variables?view=azure-devops"
        ]
      ]
    },
    {
      "place": "Personal setup",
      "title": "Tune preferences and notifications",
      "lesson": "<p>Profile preferences cover items such as display, locale, time zone, and theme. Notifications can come from personal or team subscriptions, so tune them around assignments, mentions, changes, pull requests, and build failures instead of muting everything.</p><p>Favorites make frequently used projects, teams, backlogs, queries, repos, and pipelines easier to return to. Preview features exist, but they can change and might apply at user or organization scope.</p>",
      "action": "Confirm your time zone, favorite the team backlog and delivery dashboard, then keep one high-signal notification and remove one noisy subscription.",
      "question": "Why should a PM check both personal and team notification subscriptions?",
      "answer": "Either source can generate messages; changing only one may not stop noise or preserve needed alerts.",
      "links": [
        [
          "Set your preferences",
          "https://learn.microsoft.com/en-us/azure/devops/organizations/settings/set-your-preferences?view=azure-devops"
        ],
        [
          "Manage notifications",
          "https://learn.microsoft.com/en-us/azure/devops/organizations/notifications/manage-your-personal-notifications?view=azure-devops"
        ]
      ]
    },
    {
      "place": "Tool navigation",
      "title": "Navigate without learning three tools",
      "lesson": "<p>The <strong>web portal</strong> is the PM home for Boards, dashboards, project settings, repos, and pipeline status. <strong>Team Explorer</strong> is the older Visual Studio client experience engineers might mention; the <strong>CLI</strong> is useful for repeatable or scripted operations.</p><p>You only need to recognize the other doorways. Ask for a browser URL or recorded command when a status discussion starts in a tool you do not use.</p>",
      "action": "In the web portal, practice the route from organization to project to Boards, Repos, Pipelines, Project settings, and Organization settings.",
      "question": "Which interface should be your default as a delivery PM?",
      "answer": "The web portal. Recognize Team Explorer and CLI, but use them only when the task calls for them.",
      "links": [
        [
          "Web portal navigation",
          "https://learn.microsoft.com/en-us/azure/devops/project/navigation/?view=azure-devops"
        ],
        [
          "Azure DevOps CLI",
          "https://learn.microsoft.com/en-us/azure/devops/cli/?view=azure-devops"
        ]
      ]
    },
    {
      "place": "Incident triage",
      "title": "Triage before escalating",
      "lesson": "<p>Put problems into one of three buckets: <strong>connection/access</strong> (account, directory, organization, project), <strong>permissions</strong> (access level, group, scope, inheritance, Deny), or <strong>pipelines</strong> (run logs, agent, service connection, variable, approval, environment).</p><p>Capture the URL, exact error, user, time, scope, and run or correlation ID before escalating. That gives an administrator or engineer a reproducible starting point.</p>",
      "action": "Make a reusable incident note with fields for expected result, actual result, exact error, URL, identity, project/repo/pipeline, timestamp, run ID, and screenshot.",
      "question": "What is the fastest useful first split for an Azure DevOps problem?",
      "answer": "Connection/access, permissions, or pipelines, then collect the identifiers and exact error.",
      "links": [
        [
          "Troubleshoot connecting to a project",
          "https://learn.microsoft.com/en-us/azure/devops/user-guide/troubleshoot-connection?view=azure-devops"
        ],
        [
          "Troubleshoot permissions",
          "https://learn.microsoft.com/en-us/azure/devops/organizations/security/troubleshoot-permissions?view=azure-devops"
        ],
        [
          "Troubleshoot pipelines",
          "https://learn.microsoft.com/en-us/azure/devops/pipelines/troubleshooting/troubleshooting?view=azure-devops"
        ]
      ],
      "note": "TFS/Azure DevOps Server migration exists, but it is out of scope for this fast path. <a href=\"https://learn.microsoft.com/en-us/azure/devops/migrate/migration-overview?view=azure-devops\" target=\"_blank\" rel=\"noopener\">See the official migration overview</a> if it becomes relevant."
    },
    {
      "place": "Quality and evidence",
      "title": "Connect tests, packages, and reporting",
      "lesson": "<p><strong>Azure Test Plans</strong> organizes manual and exploratory testing, test suites, cases, runs, and results. Automated tests usually run through pipelines, while Test Plans adds planned evidence and traceability. <strong>Azure Artifacts</strong> manages versioned packages in feeds. <strong>Dashboards and Analytics</strong> turn live work, build, test, and deployment data into status views.</p><p>The useful chain is requirement to code change to build to test result to deployable package. A dashboard summarizes that evidence; it does not replace it.</p>",
      "action": "Trace one fraud-detection requirement to its linked pull request, pipeline run, test result, release artifact, and dashboard indicator. Record any missing link.",
      "question": "What is the difference between a test result, an artifact, and a dashboard?",
      "answer": "A test result records verification evidence. An artifact is a versioned package or dependency. A dashboard summarizes current data and trends.",
      "links": [
        [
          "Azure Test Plans overview",
          "https://learn.microsoft.com/en-us/azure/devops/test/overview?view=azure-devops"
        ],
        [
          "Azure Artifacts overview",
          "https://learn.microsoft.com/en-us/azure/devops/artifacts/start-using-azure-artifacts?view=azure-devops"
        ],
        [
          "Dashboards overview",
          "https://learn.microsoft.com/en-us/azure/devops/report/dashboards/overview?view=azure-devops"
        ]
      ]
    },
    {
      "place": "Platform edges",
      "title": "Recognize integrations, APIs, and hosting choices",
      "lesson": "<p><strong>Service hooks</strong> react to events such as work-item updates or build completion. <strong>Extensions</strong> add capabilities through the Visual Studio Marketplace. The Azure DevOps CLI and REST APIs support repeatable automation. Azure DevOps Services is Microsoft-hosted; Azure DevOps Server is installed and maintained by an organization.</p><p>A beginner should recognize these boundaries and know when to involve an administrator. Custom automation should use a Microsoft Entra application identity when possible. If a personal access token is unavoidable, restrict its organization, scope, and lifetime.</p>",
      "action": "Classify one desired integration as a service hook, extension, CLI command, REST API call, or built-in feature. Identify the owner and the minimum access it needs.",
      "question": "When should you use a service hook instead of repeatedly checking for a change?",
      "answer": "Use a service hook when an external action should respond to a specific Azure DevOps event.",
      "links": [
        [
          "Service hooks overview",
          "https://learn.microsoft.com/en-us/azure/devops/service-hooks/overview?view=azure-devops"
        ],
        [
          "Extensions overview",
          "https://learn.microsoft.com/en-us/azure/devops/extend/overview?view=azure-devops"
        ],
        [
          "Azure DevOps REST API",
          "https://learn.microsoft.com/en-us/rest/api/azure/devops/"
        ]
      ]
    }
  ],
  "terms": [
    [
      "ADO",
      "Azure DevOps",
      "Microsoft's suite for planning, storing, building, testing, and shipping software."
    ],
    [
      "Azure",
      "Azure cloud",
      "Microsoft’s cloud computing platform. Azure DevOps can deploy onto Azure, but they are different products."
    ],
    [
      "Boards",
      "Azure Boards",
      "Backlogs, sprints, boards, bugs, dependencies, and delivery status."
    ],
    [
      "Repos",
      "Azure Repos",
      "Git source history, branches, pull requests, and reviewed changes."
    ],
    [
      "Pipelines",
      "Azure Pipelines",
      "Automated build, test, approval, and deployment steps for a release."
    ],
    [
      "Test Plans",
      "Azure Test Plans",
      "Formal test cases, execution, and results connected to requirements."
    ],
    [
      "Artifacts",
      "Azure Artifacts",
      "Versioned packages such as NuGet or npm outputs, stored for reuse or release."
    ],
    [
      "Stakeholder",
      "Stakeholder access",
      "A free, limited access level for people who mainly view and update work items."
    ],
    [
      "CI",
      "Continuous Integration",
      "Every change is built and tested quickly so integration problems surface early."
    ],
    [
      "CD",
      "Continuous Delivery or Deployment",
      "Continuous delivery builds, tests, and deploys every passing change through environments such as test and production; approvals and checks can gate each stage. Continuous deployment removes the manual approval, so a passing change reaches production automatically."
    ],
    [
      "PR",
      "Pull request",
      "A proposed code change that teammates review before it merges into the main branch. Branch policies can require reviewers, a linked work item, and a passing build."
    ],
    [
      "YAML",
      "Pipeline definition format",
      "The plain-text format used to describe pipeline steps and settings in a file such as azure-pipelines.yml. The name is a recursive acronym (YAML is not a markup language)."
    ],
    [
      "Entra ID",
      "Microsoft Entra ID",
      "The company identity system, formerly Azure Active Directory."
    ],
    [
      "RBAC",
      "Role-based access control",
      "Access follows a role and scope, not a one-off exception for one person."
    ],
    [
      "PAT",
      "Personal access token",
      "A revocable credential for tools or scripts. Scope it tightly and expire it."
    ],
    [
      "TFS",
      "Team Foundation Server",
      "The older on-premises product lineage, now Azure DevOps Server."
    ],
    [
      "Organization",
      "Azure DevOps organization",
      "The top-level cloud container for projects, users, billing, policies, and organization settings."
    ],
    [
      "Project",
      "Azure DevOps project",
      "A boundary that groups teams, Boards work, repositories, pipelines, tests, packages, and permissions."
    ],
    [
      "Team",
      "Azure DevOps team",
      "A working group with its own backlogs, boards, iterations, areas, dashboards, and administrators inside a project."
    ],
    [
      "Work item",
      "Azure Boards work item",
      "A tracked record for value, work, defects, issues, risks, or tasks. Its fields and workflow depend on the selected process."
    ],
    [
      "Backlog",
      "Ordered backlog",
      "A prioritized list of work. Portfolio backlogs organize larger outcomes; product and sprint backlogs organize delivery work."
    ],
    [
      "Sprint",
      "Iteration",
      "A fixed planning period with selected work, dates, and team capacity."
    ],
    [
      "Branch policy",
      "Pull-request protection",
      "Rules that can require reviewers, linked work, successful builds, comments resolved, or other checks before merging."
    ],
    [
      "Agent",
      "Pipeline agent",
      "The compute worker that executes a pipeline job. It can be Microsoft-hosted or self-hosted."
    ],
    [
      "Service connection",
      "External-service identity",
      "A managed connection that lets a pipeline authenticate to Azure, containers, Kubernetes, or another external service."
    ],
    [
      "Environment",
      "Deployment environment",
      "A named deployment target such as development, test, staging, or production, with history, resources, permissions, and checks."
    ],
    [
      "Feed",
      "Azure Artifacts feed",
      "A controlled package collection with versions, upstream sources, permissions, and retention settings."
    ],
    [
      "Dashboard",
      "Azure DevOps dashboard",
      "A configurable collection of widgets that summarizes work, build, test, and project information."
    ],
    [
      "Analytics",
      "Azure DevOps Analytics",
      "The reporting data model and service used for trends, widgets, OData queries, and Power BI reporting."
    ],
    [
      "Service hook",
      "Event-driven integration",
      "A subscription that sends an Azure DevOps event to another service when a selected condition occurs."
    ],
    [
      "Extension",
      "Azure DevOps extension",
      "An installed package that adds user-interface, build, work-tracking, or integration capabilities."
    ],
    [
      "Azure DevOps Services",
      "Microsoft-hosted Azure DevOps",
      "The cloud service operated and updated by Microsoft."
    ],
    [
      "Azure DevOps Server",
      "Self-hosted Azure DevOps",
      "The on-premises product that an organization installs, secures, updates, and operates."
    ]
  ],
  "scenarios": [
    [
      "A sponsor asks where the fraud release stands.",
      "Use the current sprint and board: completed versus committed work, the data-feed dependency, blocked items, pipeline status, test evidence, and forecast release date."
    ],
    [
      "The fraud-data dependency threatens the sprint goal.",
      "Link the items, name the owner, record the needed-by date and release impact, agree the next action, and surface it in sprint status."
    ],
    [
      "The release pull request is still open. What do you ask?",
      "Which work item does it deliver, who must review it, which policy or check is pending, and does it threaten the release pipeline start?"
    ],
    [
      "Someone says the pipeline failed. What do you ask?",
      "Which fraud-release pipeline, run, branch, stage, and error? Was it build, test, approval, service connection, agent, or deployment?"
    ],
    [
      "What happens before stakeholders see the release?",
      "Required engineering checks pass, Test Plans evidence is recorded, the pipeline reaches the correct environment, and the designated approval is complete."
    ],
    [
      "Boards or Repos: where is the backlog?",
      "Boards holds the backlog and sprint. Repos holds engineering’s source code and pull requests."
    ],
    [
      "An outside fraud specialist needs to review but not change the plan.",
      "Give the minimum access level and project-scoped read permissions needed, avoid collection-wide roles, and set a review date."
    ],
    [
      "A user is a Contributor but cannot push.",
      "Check access level, repository and branch scope, inherited groups, branch policies, and any explicit Deny."
    ],
    [
      "How is a sprint different from the fraud-release milestone?",
      "A sprint is a short planning and delivery time-box. The release milestone is the broader promised event; several sprints may contribute to it."
    ],
    [
      "Which interface should a PM learn first?",
      "The web portal. Recognize Team Explorer and CLI so you can follow engineers, but do not turn either into a separate course."
    ],
    [
      "The pipeline definition is correct, but no job starts.",
      "Check whether an eligible agent is online, has the required capabilities, can access the pool, and is allowed to run the job."
    ],
    [
      "A pipeline must deploy to Azure without a person signing in.",
      "Prefer a Microsoft Entra workload identity through a service connection, managed identity, or service principal. Avoid a personal credential for unattended automation."
    ],
    [
      "A build succeeded, but the release team cannot find the package.",
      "Confirm that the pipeline published the expected artifact or package, verify its name and version, and check feed or pipeline-artifact permissions and retention."
    ],
    [
      "A dashboard shows green while a required test is missing.",
      "Treat the dashboard as a summary. Follow the linked requirement, build, and test evidence, then correct the query or widget so the status reflects the release criterion."
    ],
    [
      "A legacy script can use only a personal access token.",
      "Use an organization-specific token with the minimum scope and shortest practical lifetime, store it in a protected secret system, monitor its use, and revoke it when the script is replaced."
    ]
  ],
  "deliveryDesk": [
    [
      "Plan",
      "Boards",
      "Fraud-release backlog, sprint commitment, blockers, dependency, and status."
    ],
    [
      "Engineering change",
      "Repos",
      "Branch, pull request, reviewers, checks, and linked work item."
    ],
    [
      "Release",
      "Pipelines",
      "Build, test, approvals, environments, and deployment status."
    ],
    [
      "Readiness",
      "Test Plans",
      "Requirements connected to formal tests and stakeholder-ready results."
    ],
    [
      "Output",
      "Artifacts",
      "The versioned package produced for the release."
    ],
    [
      "Control",
      "Permissions",
      "Who can change the plan, code, or release, and who can only read it."
    ]
  ],
  "workflowAnalogies": [
    {
      "title": "Restaurant Order",
      "introduction": "The fastest introductory explanation: a customer orders a meal; the restaurant records, prepares, checks, and delivers it.",
      "steps": [
        ["Record the order: Azure Boards", "The server records what the customer wants. Boards records requested work, tasks, defects, and progress.", "One place shows what must be done and who is responsible."],
        ["Control the recipe: Azure Repos", "The kitchen uses an approved recipe and retains previous versions. Repos manages files and code with their revision history.", "Team members can identify the current version."],
        ["Prepare the meal: Azure Pipelines", "An established preparation sequence represents Pipelines automating repeatable build, test, and deployment processes.", "Important steps are less likely to be skipped or performed differently each time."],
        ["Check before service: Azure Test Plans", "The kitchen checks completeness and preparation. Test Plans supports manual and exploratory testing before delivery.", "Problems can be identified before the product reaches the customer."],
        ["Deliver the meal: connected Azure DevOps services", "The delivered order is traceable to the original request. Azure DevOps connects planning, development, testing, and delivery within an integrated toolset."]
      ],
      "lesson": "Azure DevOps helps a team track a request from the initial idea through creation, checking, and delivery.",
      "limitation": "Software development is rarely as linear as preparing one meal. Requirements may change, teams may work on several versions simultaneously, and a product may undergo repeated testing and revision."
    },
    {
      "title": "Building and Inspecting a House",
      "introduction": "The stronger coordination and quality-gate comparison: a construction company divides house plans into tasks, manages revisions, inspects the work, and turns over the finished house.",
      "steps": [
        ["Define the work: Azure Boards", "Divide construction into foundation, framing, plumbing, and electrical tasks. Boards supports planning and work tracking through backlogs and configurable boards.", "An undefined objective becomes visible, manageable assignments."],
        ["Control the plans: Azure Repos", "Architects and engineers update drawings while keeping approved-change history. Repos provides managed repositories, file history, collaboration, and review processes.", "The team can identify and review changes and avoid conflicting plans."],
        ["Coordinate construction: Azure Pipelines", "Foundation precedes framing; inspection may gate later work. Pipelines organizes automated stages and tasks for building, testing, and deploying a product.", "Work follows a controlled sequence with less dependence on manual coordination."],
        ["Inspect the work: Azure Test Plans", "Inspectors check completed work against requirements. Test Plans supports planned manual and exploratory testing.", "The team can document tests, results, and defects before final delivery."],
        ["Manage standard materials: Azure Artifacts", "Approved components, templates, and prefabricated materials represent reusable packages. Artifacts lets teams create, host, share, and integrate packages into delivery pipelines.", "Teams reuse controlled components instead of recreating them for every project."],
        ["Turn over the house: connected Azure DevOps services", "Release follows the defined work and inspections. Together, Azure DevOps services support planning, building, testing, and deploying products."]
      ],
      "lesson": "Azure DevOps functions like a coordinated construction-management system that connects plans, tasks, controlled changes, inspections, reusable components, and final delivery.",
      "limitation": "Physical construction usually cannot be copied or redeployed as easily as software. Azure DevOps can automate software delivery in ways that have no direct construction equivalent."
    },
    {
      "title": "Developing and Publishing a Training Course",
      "introduction": "The recommended comprehensive analogy: an instructional-design team develops a training requirement into content, reviews and tests it, publishes it, and improves later versions. It connects the delivery system to an instructional designer’s existing experience.",
      "steps": [
        ["Translate the requirement: Azure Boards", "Divide the requirement into lessons, objectives, media tasks, assessments, reviews, and publishing activities. Boards represents this work as trackable items and shows progress.", "Requirements connect to specific work instead of being buried in emails or meeting notes."],
        ["Control source content: Azure Repos", "Designers, developers, and reviewers work on scripts, course files, configurations, and supporting materials. Repos stores controlled files and supports review before incorporating changes.", "Revision history helps establish which material is authoritative."],
        ["Review proposed revisions: pull requests in Azure Repos", "A developer proposes a revision for another team member to review. A pull request is a formal request to review and approve proposed changes before incorporating them into the main version.", "Unreviewed changes do not need to enter the authoritative product automatically."],
        ["Prepare delivery automatically: Azure Pipelines", "When approved material changes, automation checks files, runs required validation, and prepares the deliverable. Pipelines supports continuous integration and continuous delivery (CI/CD) across languages, platforms, and environments. CI/CD means automatically integrating changes, checking them, and preparing or delivering the updated product through a repeatable process.", "Teams reduce repetitive manual work and apply the same quality steps consistently."],
        ["Test the learning product: Azure Test Plans", "Reviewers test navigation, content, assessments, and expected learner behavior. Test Plans supports manual and exploratory testing before release.", "Testing becomes documented work instead of an informal final check."],
        ["Store reusable assets: Azure Artifacts", "Retain approved templates, components, or shared dependencies for reuse. Artifacts hosts and shares packages that Pipelines can also use.", "Teams can reuse approved components consistently."],
        ["Publish and monitor: connected Azure DevOps services", "Deliver the approved course with traceability from the original requirement through development and testing. Azure DevOps integrates planning, building, testing, and deployment tools.", "The organization can see what was requested, what changed, how it was tested, and what was delivered."],
        ["Improve again: return to Azure Boards", "Learner feedback and identified defects become new work items in Boards and move through the development process again.", "Improvements are captured and managed rather than lost after release."]
      ],
      "lesson": "Azure DevOps provides a connected management system for moving a product from requirement through controlled development, quality review, delivery, and continued improvement.",
      "limitation": "Azure DevOps does not determine whether instruction is educationally sound. It can manage the workflow, files, reviews, tests, and delivery process, but qualified people must still make instructional and technical decisions."
    }
  ],
  "visuals": {
    "lifecycle": [
      [
        "Plan",
        "Boards",
        "Epics, features, stories, bugs, tasks, sprints, dependencies"
      ],
      [
        "Code",
        "Repos",
        "Git or TFVC, branches, commits, pull requests, policies"
      ],
      [
        "Build",
        "Pipelines",
        "Triggers, agents, stages, jobs, steps, tests"
      ],
      [
        "Verify",
        "Test Plans",
        "Plans, suites, cases, runs, results, traceability"
      ],
      [
        "Package",
        "Artifacts",
        "Feeds, versions, upstream sources, retention"
      ],
      [
        "Deploy",
        "Pipelines",
        "Environments, approvals, checks, strategies"
      ],
      [
        "Measure",
        "Dashboards",
        "Queries, widgets, Analytics, Power BI, feedback"
      ]
    ],
    "structure": [
      [
        "Identity",
        "Microsoft Entra tenant",
        "Who the person or workload is"
      ],
      [
        "Tenant",
        "Azure DevOps organization",
        "Users, billing, policies, projects"
      ],
      [
        "Boundary",
        "Project",
        "Work, code, pipelines, tests, packages"
      ],
      [
        "Delivery unit",
        "Team",
        "Backlogs, boards, sprints, areas, dashboards"
      ],
      [
        "Resources",
        "Service objects",
        "Repos, pipelines, environments, feeds"
      ]
    ],
    "hierarchy": [
      [
        "Epic",
        "Large business outcome"
      ],
      [
        "Feature",
        "Deliverable capability"
      ],
      [
        "User Story / Product Backlog Item / Requirement",
        "Customer value; the name depends on the process (Agile, Scrum, or CMMI). The Basic process uses Epic, Issue, and Task with no Feature level."
      ],
      [
        "Task",
        "Implementation work"
      ]
    ],
    "access": [
      [
        "1",
        "Identity",
        "Microsoft Entra account, group, managed identity, or service principal"
      ],
      [
        "2",
        "Access level",
        "Stakeholder, Basic, Basic + Test Plans, or Visual Studio subscription benefit"
      ],
      [
        "3",
        "Group membership",
        "Readers, Contributors, Project Administrators, or specialized groups"
      ],
      [
        "4",
        "Scoped permission",
        "Organization, project, repo, branch, pipeline, environment, feed, or area"
      ],
      [
        "5",
        "Policies and checks",
        "Rules that still govern merge or deployment after permission is granted"
      ]
    ],
    "pipeline": [
      [
        "Trigger",
        "A commit, pull request, schedule, or manual request starts a run"
      ],
      [
        "Agent",
        "A Microsoft-hosted or self-hosted worker receives a job"
      ],
      [
        "Stages",
        "Jobs and steps build, test, scan, and package the change"
      ],
      [
        "Artifact",
        "A versioned output is published for later use"
      ],
      [
        "Environment",
        "Approvals and checks control deployment to a target"
      ],
      [
        "Evidence",
        "Run history, logs, tests, approvals, and deployments remain traceable"
      ]
    ]
  }
};
