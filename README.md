# Logics

Logics is an educational web platform prototype covering programming, cybersecurity, AI, databases, web development, cryptography, and related computer science topics.

It was built as an experimental project to explore web pages, navigation, user flows, styling, and topic-based educational content.

---

## What this project shows

This repository is useful as portfolio material because it demonstrates:

- a broad computer science learning platform idea
- multi-page web structure
- HTML/CSS/JavaScript interface work
- login/register style user flows
- topic organization across technical domains
- early product thinking around education and technology

---

## Topics covered

The project includes sections or concepts related to:

- programming
- web development
- hosting
- cybersecurity and pentesting
- database management
- AI
- cryptography
- applications and games

---

## Run locally

1. Create the MySQL tables with `sql.sql`.
2. Copy `.env.example` and set every value in your server environment
   (`DB_*`, `SMTP_*`, `APP_ENCRYPTION_KEY`, `ADMIN_NOTIFY_EMAIL`). No credential lives in the code.
3. Install PHP dependencies with `composer install` and serve the folder with PHP 8 (for example `php -S localhost:8000`).
4. Open `HomePage.html`.

## Current status

**Status:** older prototype / portfolio cleanup in progress.

The current value of this repository is that it shows initiative and breadth. The next step is to make it more professional by simplifying the structure, documenting the architecture, and separating the strongest parts from experimental code.

---

## Roadmap

- [ ] Add screenshots of the main pages
- [ ] Document the site structure
- [ ] Identify the strongest features
- [ ] Remove or isolate experimental code
- [ ] Add setup instructions
- [ ] Improve naming consistency
- [ ] Consider rebuilding the best ideas with a modern stack

---

## Recruiter note

This is not presented as a production-ready product. It is an early large-scope prototype that I am using to show learning history, initiative, and the ability to explore broad technical areas. My newer portfolio work is moving toward cleaner backend/API/AI/security projects.

## Local configuration and security

This is an **archival prototype**, not a production-ready service. The PHP files
`connection.php` and `SendEmail.php` now read database and SMTP configuration
from environment variables. See [`.env.example`](.env.example) for the required
names. **PHP does not load `.env` files automatically**: configure variables in
the PHP/server process or use an appropriate environment loader.

After removing previously embedded credentials from source, **rotate/revoke all
the previously committed SMTP/database credentials**. Git history may still
contain them. Cleaning history requires a separate, coordinated history rewrite;
simply updating the file is insufficient. Review the code and authentication
flows before deploying it to the internet.

The repository still contains legacy, already-tracked generated/editor/dependency
files. The updated `.gitignore` prevents new files from being added accidentally
but does not remove tracked files; a dedicated cleanup is pending.
