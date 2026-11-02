# 島上 — TOCFL Band A study room

A static Traditional Chinese study app for a complete beginner preparing for TOCFL Band A (A1 and A2). It uses Taiwan Mandarin and Traditional characters, runs without an app server, and is published with GitHub Pages.

## Study features

- 25 sequenced lessons: 12 A1 foundations and 13 A2 lessons, with original examples, pinyin, translations and core vocabulary
- A dedicated grammar guide with 22 core A1–A2 patterns and ten interactive checks
- A searchable word-card deck with topic filters, browser audio, quick recall and local known-word tracking
- Official word-list import for Novice 1, Novice 2, Level 1 (A1) and Level 2 (A2); the workbook is processed and saved in the visitor's browser
- Pinyin lesson with five tones, all 21 initials, a 36-final sound chart, spelling guidance and initial/final/tone listening drills
- 25 sentence models with Taiwan Mandarin speech playback and optional microphone recording for shadowing
- Ten-question A1 and A2 mixed listening/reading drills with immediate explanations
- A timed 35-listening + 35-reading original practice set, with 50 minutes for Listening, 60 minutes for Reading and answer review at the end
- Lesson, vocabulary, study-day and practice progress saved locally, with optional Supabase account sync across devices
- Downloadable JSON backup and restore as an extra recovery copy

## Important scope

The course deck is a curated set. To study the full published list, download the official workbook below, extract its Excel file and import it on the Word Cards page. The app reads the file in the browser and saves the imported list and recall marks in local storage; it does not upload the workbook. Imported entries include pinyin, topic and part of speech where listed. Their English meaning link opens a Google Translate lookup.

The practice questions are original study material, not official TOCFL questions. They cover the broad listening and reading task families, but most prompts and answers include English beginner support and picture questions use simplified icon cues. The timed set matches the approximate current CAT question count and section times, but it is fixed and does not adapt question difficulty or reproduce the official item bank. The CAT also gives about 10 seconds after each listening item; this practice set uses section timers and leaves playback and answering under learner control. Use the linked official sample tests for authentic Chinese-only questions, picture items and audio. This app does not calculate official scaled scores or guarantee a passing result. Check the current test format, registration information and score rules with TOCFL.

The Band A Listening/Reading certificate is the app's exam focus. TOCFL Speaking and Writing are separate tests; the app has sentence shadowing but no full speaking or writing exam practice. Check whether your university or program requires either separately using the official [Speaking test page](https://tocfl.edu.tw/tocfl/index.php/test/speaking) and [Writing test page](https://tocfl.edu.tw/tocfl/index.php/test/writing/list/1).

Audio uses a Chinese (Taiwan) voice supplied by the visitor's browser or operating system when available. Voice availability and quality vary by device. The app does not grade pronunciation. Microphone recording is requested only after pressing Record; recordings stay in the browser tab. Until a Supabase project is connected, progress stays in local storage on that device. JSON backups include progress and imported official vocabulary; they are not uploaded to GitHub.

## Accounts and cross-device progress

The account interface uses Supabase Auth for email-and-password sign-in. The optional display name is a profile label; sign-in uses the email address. Passwords are sent to Supabase Auth and are never stored by this app, in this repository, or in the study-progress table. The database keeps one progress record per account. Row-level security restricts records to their owner. The app also keeps its local copy and merges lesson/word progress when devices sync.

Cloud sync is not active until an owner connects a Supabase project:

1. Create a Supabase project.
2. Run [`supabase-schema.sql`](supabase-schema.sql) once in its SQL Editor.
3. In Supabase Authentication URL Configuration, allow `https://prasad29113004.github.io/tocfl-beginner/` as the site and redirect URL.
4. Put the project's URL and **publishable** key in [`auth-config.js`](auth-config.js). The publishable key is intended for a public browser app; never use a secret or `service_role` key here.

The project URL and publishable key are still needed to activate accounts on the live site. Use a custom SMTP provider before opening account registration to many users; Supabase's default email sender is intended for trials and has a low sending limit.

## Official TOCFL resources

- [Sample tests and listening audio](https://tocfl.edu.tw/tocfl/index.php/teach/test/page/1)
- [Official vocabulary downloads](https://tocfl.edu.tw/tocfl/index.php/teach/download)
- [Official 8,000-word vocabulary workbook ZIP](https://tocfl.edu.tw/tocfl/assets/files/vocabulary/8000zhuyin_202409.zip)
- [Test format and level descriptions](https://tocfl.edu.tw/tocfl/index.php/test/screening/list/4)
- [Current CAT format and question types](https://tocfl.edu.tw/tocfl/index.php/test/cat/list/2)
- [Current scoring and certificate rules](https://tocfl.edu.tw/tocfl/index.php/sign_up/rule/list/1)

## GitHub Pages

This repository includes a GitHub Actions workflow to publish the static site on each push to the main branch. In **Settings → Pages**, select **GitHub Actions** as the deployment source.

Live site: https://prasad29113004.github.io/tocfl-beginner/

The Excel import uses SheetJS Community Edition from its official CDN only after the visitor chooses Import. The workbook itself stays in the browser. See [SheetJS documentation](https://docs.sheetjs.com/docs/solutions/input/) for the import method.
