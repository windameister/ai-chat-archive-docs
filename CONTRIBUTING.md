# Contributing to AI Chat Archive docs

Thanks for improving the docs. This repo is the public source of truth for how
AI Chat Archive behaves, so clear and accurate contributions help every user.

## What we accept

**Happy path — please send a PR:**

- Typos, grammar, or unclear wording in any markdown file.
- Missing or outdated details in the [format spec](spec/).
- New FAQ entries for questions users actually ask.
- New integration templates under [`integrations/`](integrations/).
- Additional real-world export samples in [`examples/`](examples/) (see privacy note
  below).
- Translations of existing documents (open an issue first so we can coordinate naming).

**Please do not send PRs for:**

- Speculation about the extension's internal implementation. The docs describe
  observable behavior, not code.
- Marketing copy ("this is the best tool for…"). We keep docs factual.
- Changes that make docs specific to one user's workflow without generalizing.

## How to send a PR

1. Fork this repository.
2. Create a branch named after your change — `fix/typo-in-privacy-md`,
   `faq/projects-support`, etc.
3. Keep each PR focused on one topic. Smaller PRs merge faster.
4. Run a spellchecker before submitting.
5. Open the PR against `main` with a one-paragraph description of the change.

## Style

- Write in plain, direct English. Short sentences. No hype.
- Prefer present tense ("The extension writes a Markdown file…" not "will write").
- Code fences should specify a language (` ```markdown `, ` ```json `).
- Filenames and paths go in backticks.
- Use sentence case for headings (`## Export to Markdown`, not `## Export To Markdown`).
- Don't claim affiliation with Anthropic. Refer to Claude as "Claude.ai" or "Claude".

## Sample files (privacy note)

If you're contributing an exported conversation to `examples/`, strip anything
identifying before committing:

- Replace real email addresses, names, and API keys with realistic-looking but fake
  values.
- Redact URLs that point to private resources.
- Assume anything in this repo will be indexed by search engines and read by LLMs
  forever.

Pick short, synthetic demo conversations whenever possible.

## Issues

If you're not comfortable with markdown or git, just open an issue with the correction
in plain text. A maintainer will make the change.

## License

By submitting a contribution, you agree that your contribution is licensed under
[CC BY 4.0](LICENSE) — the same license as the rest of this repository.
