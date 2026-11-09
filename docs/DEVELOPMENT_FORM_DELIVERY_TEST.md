# Development waitlist delivery test

Status: prepared, not sent. The owner selected preparation with actual sending
deferred until a controlled email address and receiving-inbox confirmation are
available. Automated tests must continue mocking Formspree; do not send real
messages from CI or include personal health information.

## Controlled submission draft

- Page: `https://dev.cozyhealth.org/waitlist`.
- Name: `[Development test] Waitlist delivery YYYYMMDD-UNIQUE_ID`.
- Email: an address explicitly supplied by the owner and controlled by the tester.
- Healthcare provider: unchecked (`No`).
- Endpoint: the existing configured Formspree form, unchanged.

Replace the date/identifier and email only when the owner provides the address.
Submit once through the normal visible development form. Record UTC time, the
identifier and HTTP/UI outcome without publishing the email address. Do not
change Formspree recipients or enable an autoresponder as an inferred fix.

Ask the owner or authorized mailbox operator to find the same identifier in the
destination inbox configured for that Formspree form, including spam/quarantine.
The email entered into the form is the submitter's address; it is not necessarily
the configured destination inbox. No mailbox password is needed in this document.

Record these separately:

| Check | Current result |
| --- | --- |
| Form validation, provider Yes/No and failure/retry handling | Automated suite; see delivery evidence |
| Formspree accepts the real request | Pending controlled submission |
| Matching notification reaches the destination inbox | Pending mailbox confirmation |

If submission is accepted but no notification arrives, inspect the authorized
Formspree delivery/activity view and mailbox filtering before another submission.
Do not claim delivery from an HTTP 200 response alone. If provider access is
missing, retain the exact timestamp/identifier and report that specific blocker.

Check support mail links, privacy/legal navigation and retained versioned
documents against the development site. A valid mailto link verifies its target;
it does not prove that a mailbox exists or that delivery succeeded.
