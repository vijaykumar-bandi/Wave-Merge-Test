# Requirements: Wave Merge Test

## Requirement 1: Home page with the counter

**User Story:** As a developer/tester, I want a home page that shows the heading "Wave Merge Test" and a counter starting at 0, so that I can see the app running and count my clicks.

_Source: W1, BR1, BR2, E1, F2, F3_

### Acceptance Criteria

1. WHEN the developer/tester opens `/` THE SYSTEM SHALL show the heading "Wave Merge Test".
2. WHEN the developer/tester opens `/` THE SYSTEM SHALL show a counter with the value 0.
3. WHEN the developer/tester clicks the increment button THE SYSTEM SHALL increase the counter by 1.
4. WHEN the developer/tester clicks the increment button three times THE SYSTEM SHALL show the counter value 3.
5. WHEN the developer/tester refreshes the page THE SYSTEM SHALL show the counter with the value 0.
6. WHILE the counter is shown THE SYSTEM SHALL keep its value only in the open page, without sending it to the server or storing it.
7. THE SYSTEM SHALL label the increment button with the text "Increment".
8. THE SYSTEM SHALL let the developer/tester increase the counter with the keyboard alone.

## Requirement 2: Health endpoint

**User Story:** As a developer/tester, I want a health endpoint, so that I can check the server is running and answering requests.

_Source: F4, A1_

### Acceptance Criteria

1. WHEN the developer/tester sends `GET /api/health` THE SYSTEM SHALL answer with the HTTP status 200.
2. WHEN the developer/tester sends `GET /api/health` THE SYSTEM SHALL answer with the `Content-Type` header `application/json`.
3. WHEN the developer/tester sends `GET /api/health` THE SYSTEM SHALL answer with the body `{"status":"ok"}` and nothing else.

## Requirement 3: Start the app locally

**User Story:** As a developer/tester, I want to start the app with `npm run dev` on 127.0.0.1, so that I can open it in my browser on my own machine.

_Source: F5, F6, F15, F23, F36, N2_

### Acceptance Criteria

1. WHEN the developer/tester runs `npm run dev` in the project folder THE SYSTEM SHALL start the server on the address 127.0.0.1.
2. WHEN the environment variable `PORT` is set THE SYSTEM SHALL listen on the port it names.
3. IF the environment variable `PORT` is not set THEN THE SYSTEM SHALL listen on port 3000.
4. WHILE the server is running THE SYSTEM SHALL answer requests only on 127.0.0.1.
5. IF the port is already in use THEN THE SYSTEM SHALL print an error message in the terminal and exit.

## Requirement 4: Response time

**User Story:** As a developer/tester, I want the page and the health endpoint to answer quickly, so that the app is quick to try on my machine.

_Source: N1_

### Acceptance Criteria

1. WHEN the developer/tester opens `/` on the local machine THE SYSTEM SHALL answer within 1 second.
2. WHEN the developer/tester sends `GET /api/health` on the local machine THE SYSTEM SHALL answer within 1 second.

## Requirement 5: Errors

**User Story:** As a developer/tester, I want a plain error answer, so that I can tell a wrong address from a broken server.

_Source: A2_

### Acceptance Criteria

1. WHEN the developer/tester requests a path the app does not serve THE SYSTEM SHALL answer with the HTTP status 404 and a plain text message.
2. IF a request fails inside the app THEN THE SYSTEM SHALL answer with the HTTP status 500 and a plain text message.

## Requirement 6: Tests

**User Story:** As a developer/tester, I want to run `npm test` and see a pass or fail for each test, so that I can check the app without clicking through it.

_Source: W2_

### Acceptance Criteria

1. WHEN the developer/tester runs `npm test` in the project folder THE SYSTEM SHALL start the app on a test port and run every test once, then exit.
2. WHEN the tests run THE SYSTEM SHALL check that the home page shows the heading "Wave Merge Test".
3. WHEN the tests run THE SYSTEM SHALL check that the counter starts at 0 and increases by 1 on click.
4. WHEN the tests run THE SYSTEM SHALL check that `GET /api/health` answers with the status 200 and the body `{"status":"ok"}`.
5. WHEN the tests finish THE SYSTEM SHALL print pass or fail for each test.

## Later releases

- None: every workflow and rule of the brief is in release 1.

## Assumptions

- The increment button's label is "Increment", since the brief names the button but not its text.
- "Plain text message" for a 404 or 500 answer means a short English sentence in the response body, with no HTML page.
- The counter is held in the page's JavaScript memory only, so a refresh starts it again at 0 and no request carries its value.
- The tests use a port the test setup picks, so a running `npm run dev` does not block them.
