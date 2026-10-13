<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


- Never create branches, worktrees, or commits automatically. Only do so when the user explicitly asks for that specific action in teh current request.
- Leave changes uncommitted in the working tree on the current branch and let the user decide when and how to commit.
- For database schema changes, use `npm run db:push` (`drizzle-kit push`) only. Never generate or run migrations.
- This is a development project. Existing data has no value, and backward compatibility is not required. Treat every schema change as a clean slate: discard existing rows; never backfill or preserve them, and spend no effort keeping old data working.

## Forms

Reference: `db/schema.ts` (`createBotSchema`), `action/bots.ts` (`createBot`), and `components/bots-dialog.tsx`.

- Derive database-backed validation with `createInsertSchema` from `drizzle-zod`. Define a client-editable subset with field constraints, excluding generated and server-owned columns. Export its inferred type and use the same schema with `zodResolver` in the form and `.parse()` in the server action.
- Use React Hook Form with explicit defaults for every field. Compose installed shadcn controls with `FieldGroup`, `Controller`, and `Field`; put `data-invalid` on `Field`, `aria-invalid` on the control, and show `FieldError` for invalid fields.
- Use `ToggleGroup` for a small set of suggestions. Each suggestion should fill all related fields it promises (a bot job fills `job` and `instructions`), while leaving `name` blank and allowing edits to prefilled fields.
- In server actions, derive `userId` from Clerk's authenticated session, validate input again, and revalidate affected routes after a successful mutation. Treat client input as untrusted.
- In creation dialogs, reset form state when closing. Keep submit and cancel controls inside the form, disable actions while submitting, and report success or failure with the installed toast component. Keep native button semantics when composing Base UI triggers with `render`.

## DiceBear

Use DiceBear 10. Documentation: https://www.dicebear.com/llms.txt

There are seven native cores with identical output, not one library with
wrappers. Use the one matching this project's language. Do not reach for the
JavaScript core when the project is written in something else:

    JavaScript  @dicebear/core + @dicebear/styles
    PHP         dicebear/core + dicebear/styles
    Python      dicebear-core + dicebear-styles
    Rust        dicebear-core + dicebear-styles
    Go          github.com/dicebear/dicebear-go/v10 + github.com/dicebear/styles/v10
    Dart        dicebear_core + dicebear_styles
    C#          DiceBear.Core + DiceBear.Styles

Every style page carries a loading snippet for all seven, for example
https://www.dicebear.com/styles/lorelei/index.md

HTTP API: https://api.dicebear.com/10.x/<style>/svg?seed=<seed> The seed is a
query parameter, not a path segment. Options are query parameters too; array
values are separated by commas.

Options named after a component end in Variant: eyesVariant, not eyes. This
holds in all seven cores and in the HTTP API. Look up the options of a style at
https://api.dicebear.com/10.x/<style>/options.json

Write these forms, not the ones on the left. The left column is pre-10 and the
API does not reject it, so an outdated call runs and silently does the wrong
thing:

    avatars.dicebear.com/api/<style>/<seed>.svg  ->  api.dicebear.com/10.x/<style>/svg?seed=<seed>
    api.dicebear.com/9.x/<style>/svg             ->  api.dicebear.com/10.x/<style>/svg
    npm install @dicebear/collection             ->  npm install @dicebear/styles
    npm install @dicebear/lorelei                ->  npm install @dicebear/styles
    createAvatar(lorelei, { seed })              ->  new Avatar(new Style(definition), { seed })
    { eyes: ['variant01'] }                      ->  { eyesVariant: ['variant01'] }
    ?radius=50                                   ->  ?borderRadius=50

Only JavaScript and the HTTP API have a pre-10 form. The other six cores were
released in 2026 and never had one, so any older-looking PHP, Python, Rust, Go,
Dart or C# API attributed to DiceBear is invented rather than outdated.

<!-- TRIGGER.DEV SKILLS START -->
## Trigger.dev agent skills

This project has Trigger.dev agent skills installed in `.agents/skills/`. Before writing or changing Trigger.dev code (background tasks, scheduled tasks, realtime, or chat.agent AI agents), load the most relevant skill: `trigger-chat-agent-advanced`, `trigger-cost-savings`, `trigger-getting-started`, `trigger-realtime-and-frontend`, `trigger-authoring-tasks`.
<!-- TRIGGER.DEV SKILLS END -->
