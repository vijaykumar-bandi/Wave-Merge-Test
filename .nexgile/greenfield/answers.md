# Requirements brief — Wave Merge Test
## Profile
A small local Node.js/Express test app that shows a home page with a counter and a health endpoint, used to verify wave-based merging. · internal tool · software development testing · size: small · depth: quick
- **Has a user interface?** Yes (It serves a home page with a button and a counter.)
- **Runs locally?** Yes (It is a Node.js/Express app started with npm run dev on 127.0.0.1.)
## The app
A small local Node.js/Express test app that shows a “Wave Merge Test” home page with a click counter and a GET /api/health endpoint returning {"status":"ok"}, started with npm run dev on 127.0.0.1 and PORT defaulting to 3000. It exists so one developer/tester can check that Greenfield builds it in three waves, merges each wave automatically, and recovers cleanly from a wave conflict with a manual commit on local main without touching unrelated commits.
## Goals and success
- G1 Provide a minimal local app to test wave-based merging and merge recovery. (description)
- M1 A successful run shows that Greenfield can build the app in at least two waves, merge each wave automatically, and recover cleanly when a wave conflicts with a manual commit on local main, without touching unrelated commits. (At least two waves merged automatically; a wave conflict with a manual commit on local main recovered cleanly; no unrelated commits touched) (Q3)
## Roles
- R1 developer/tester (1) (Q1)
## Workflows
### W1 Increment the counter (release 1) — actors: R1 developer/tester; trigger: The developer/tester opens the local app and clicks the increment button; outcome: The counter shows the number of clicks since the page was loaded.; how often: Each time the developer/tester runs the app to test wave merging (Q2)
1. Start the app with npm run dev and open its local address.
2. See the heading “Wave Merge Test” and a counter starting at 0.
3. Click the increment button; the counter increases by 1 each time.
4. Refresh the page; the counter resets to 0.
### W2 Run the tests (release 1) — actors: R1 developer/tester; trigger: The developer/tester runs npm test in the project folder; outcome: The run prints pass or fail for each test.; how often: Each time the developer/tester runs the tests (Q11)
1. Run npm test in the project folder.
2. The tests start the app on a test port.
3. A test checks the home page shows the heading “Wave Merge Test”.
4. A test checks the counter starts at 0 and increases by 1 on click.
5. A test checks GET /api/health returns 200 with {"status":"ok"}.
6. The run prints pass or fail for each test.
## Records
- E1 Counter. fields: value (number, starts at 0, held in the browser only); states: at zero → incremented; owner: R1; how many: One counter per page load; kept for: Until the page is refreshed; nothing is stored (Q2, Q5)
## Rules
- BR1 The counter starts at 0 on each page load and increases by 1 per click.. Applies: The developer/tester opens the page and clicks the increment button three times; the counter shows 3.. Does not apply: The developer/tester refreshes the page; the counter shows 0 again, not 3. (Q2)
- BR2 The app itself implements no rebasing, merging, conflict recovery, branches or commits; GitHub mode, automatic merging and the at least two build waves are Greenfield build configuration, not app features.. Applies: The GitHub wave-merge scenario is a manual test of Greenfield itself, not a feature to implement in this application.. Does not apply: Keep GitHub mode, automatic merging, and dependent tasks requiring at least two build waves as Greenfield build configuration. (Q12)
## Quality targets
- N1 [performance] The home page and the health endpoint respond within 1 second on the local machine.: 1 second (assumption, Q7)
- N2 [availability] The app is available whenever the developer/tester starts it; an hour of outage costs nothing because it is a local test tool.: No availability target; started on demand (assumption, Q7)
## Decisions
- **Stack:** Node.js with Express and plain HTML/JavaScript (the user's choice; suggested: The description already names Node.js and Express, and plain HTML/JavaScript keeps the test app minimal.) (Q4)
- **Deploy target:** Only on this machine (the user's choice; suggested: The description says it is a local test app with no deployment.) (Q7)
- **Mock-ups of the key screens first:** Yes, show mock-ups first (the user's choice) (Q8)
## Assumptions
- A1 200 with Content-Type application/json and body {"status":"ok"}; it checks nothing else. — The HTTP status code and content type of GET /api/health, and whether it checks anything beyond returning the fixed JSON. [assumed] (gap)
- A2 A plain error message in the terminal and a plain 404/500 page in the browser; no retry. — What the app should show or print when it cannot start (port in use, missing dependency) or when a request fails. [assumed] (gap)
## Other facts
- F1 The app is built with Node.js and Express. [scope] (description)
- F2 The home page displays “Wave Merge Test”. [scope] (description)
- F3 A button increases a counter on the page. [scope] (description)
- F4 GET /api/health returns {"status":"ok"}. [scope] (description)
- F5 npm run dev starts the app on 127.0.0.1. [scope] (description)
- F6 The app uses process.env.PORT, defaulting to 3000. [scope] (description)
- F7 There is no database, authentication, deployment, or external integrations. [scope] (description)
- F8 The app is built in GitHub mode with an empty GitHub repository provided by the person and automatic wave merging. [scope] (description)
- F9 Implementation is organized into exactly three build waves: project setup and minimal server; then home page, counter and health endpoint; then tests. [scope] (description, Q13)
- F10 This is a controlled merge-recovery test; the app must not automatically push or modify unrelated commits the person creates manually on local main. [scope] (description)
- F11 One developer/tester uses the app locally to test Greenfield's GitHub wave-merge recovery; no accounts, roles or other users are needed. (Q1)
- F12 The app is built with Node.js with Express and plain HTML/JavaScript. (Q4)
- F13 GitHub branches, commits and build waves are managed by Greenfield, not by this app; the app stores no database, files, user records or history. (Q5)
- F14 When a wave conflicts with a manual commit on local main, automatic wave merging rebases the wave onto local main and retries; this is Greenfield build configuration, not a feature of the app. [scope] (Q6, Q12)
- F15 The app runs only on this machine. [hosting] (Q7)
- F16 Mock-ups of the key screens are shown before building them. [look] (Q8)
- F17 The home page style is plain and minimal. [look] (Q9)
- F18 The look is not modelled on any existing app or website; it stays plain. [look] (Q10)
- F19 The build uses exactly the three waves listed: project setup and minimal server; then home page, counter and health endpoint; then tests. (Q13)
- F20 The app is used only by one developer/tester on their own machine; there are no other users, accounts or roles. [scale] (assumption, Q1, Q7)
- F21 At most one person uses the app at a time, on one machine, with one page open; there is no peak beyond that. [scale] (assumption, Q1, Q7)
- F22 The app holds no records across runs: the counter lives only in the open page and resets on refresh, so there are zero stored records in year 1 and year 3. [scale] (assumption, Q5)
- F23 There is no sign-in: the app listens on 127.0.0.1 and only the local machine can reach it. [security] [assumed] (assumption)
- F24 The app holds no personal data, sets no cookies and keeps no logs of people, so no privacy law applies and there is nothing to delete or consent to. [privacy] (assumption, Q5)
- F25 The app needs no audit trail: nothing is stored and there is one user on one machine. [audit] (assumption, Q5, Q1)
- F26 The app is in English only, left-to-right, with basic accessibility (readable text, a labelled button, keyboard-operable counter); no WCAG level is required. [access_i18n] [assumed] (assumption)
- F27 The app is used on a desktop browser on the local machine; it needs no phone layout and no offline mode. [devices] (assumption, Q7)
- F28 There is no support rota: the developer/tester reads the terminal and the browser when something fails. [operations] (assumption, Q1)
- F29 There is no existing data to move: the app starts empty and stores nothing. [migration] (assumption, Q5)
- F30 There are no integrations: no database, no external services, no authentication providers. [integrations] [assumed] (assumption)
- F31 There is no money in the app: no pricing, payments, refunds, tax or invoices. [money] [assumed] (assumption)
- F32 The app handles no files or uploaded content. [files] [assumed] (assumption)
- F33 There are no notifications: no email, SMS or in-app messages are sent. [notifications] [assumed] (assumption)
- F34 There are no reports: the only output is the counter on the page and the health JSON. [reports] [assumed] (assumption)
- F35 There are no business events beyond a page load and a button click; nothing is timed or scheduled. [events] [assumed] (assumption)
- F36 There is no administration screen: the only settings are the port (process.env.PORT, default 3000) and the local address 127.0.0.1, changed by editing the environment or code. [admin] [assumed] (assumption)
- F37 Today the wave-merge behaviour is tested by hand against a real GitHub repository; the app replaces nothing and runs alongside that manual check. [current] [assumed] (assumption)
- F38 No similar product is named; the closest reference is a standard Express starter with a static page and a health route, from which only the minimal structure is copied. [similar] [assumed] (assumption)
## The interview
- Q1 [stakeholders · owner] Who will use the app, and about how many people of each kind? → One developer/tester will use this app locally to test Greenfield’s GitHub wave-merge recovery. No accounts, roles, or other users are needed.
- Q2 [workflows · owner] Walk me through the most important task in the app, step by step. → 1. Start the app with npm run dev and open its local address. 2. See the heading “Wave Merge Test” and a counter starting at 0. 3. Click the increment button; the counter increases by 1 each time. 4. Refresh the page; the counter resets to 0.
- Q3 [scope · owner] What should the wave merging and merge-recovery test prove, and what would count as a successful run? → A successful run shows that Greenfield can build the app in at least two waves, merge each wave automatically, and recover cleanly when a wave conflicts with a manual commit on local main, without touching unrelated commits. (Greenfield's draft, sent unchanged)
- Q4 [stack · owner] Which stack should the app be built with? → Node.js with Express and plain HTML/JavaScript
- Q5 [entities · admin] What things does the app need to keep track of? → Only the current counter value, held temporarily in the browser. It starts at 0, increases by 1 per click, and resets on refresh. No database, files, user records, or history are stored. GitHub branches, commits, and build waves are managed by Greenfield, not by this app.
- Q6 [scope · owner] When a wave conflicts with a manual commit on local main, what should automatic wave merging do? → Rebase the wave onto local main and retry
- Q7 [hosting · owner] Where should this app run? → Only on this machine
- Q8 [look · role:R1] Should we show you mock-ups of the key screens before building them? → Yes, show mock-ups first
- Q9 [look · role:R1] What style should the home page have? → Plain and minimal
- Q10 [look · role:R1] Which app or website should the look be modelled on, if any? → None — keep it plain (Greenfield's draft, sent unchanged)
- Q11 [workflows · owner] Walk me through how the tests should be run and what a passing run should check. → 1. Run npm test in the project folder. 2. The tests start the app on a test port. 3. A test checks the home page shows the heading “Wave Merge Test”. 4. A test checks the counter starts at 0 and increases by 1 on click. 5. A test checks GET /api/health returns 200 with {"status":"ok"}. 6. The run prints pass or fail for each test.
- Q12 [exceptions · owner] When the rebase of a wave onto local main itself conflicts, what should automatic wave merging do? → Clarification: This application is only a simple Express page with a counter and /api/health endpoint.; applies: The GitHub wave-merge scenario is a manual test of Greenfield itself, not a feature to implement in this application. Remove application requirements about rebasing, merging, conflict recovery, branches, or commits. Do not implement a merge workaround.; does not apply: Keep GitHub mode, automatic merging, and dependent tasks requiring at least two build waves as Greenfield build configuration.
- Q13 [scope · owner] Should the build use exactly the three waves listed, or may there be more? → Exactly the three listed
