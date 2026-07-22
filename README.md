# Composer CI Error Database

Tracks recurring errors from the osbuild-composer nightly CI pipelines. Updated automatically by the [status-dashboard](https://gitlab.cee.redhat.com/osbuild/status-dashboard) CI analysis pipeline via merge requests.

## Database file

`ci-error-db.json` — single JSON file with all known errors.

### Top-level structure

```json
{
  "errors": [ ... ],
  "next_id": 5
}
```

`next_id` is the next sequential number for `COMPOSER-NNNN` ID assignment. Managed by the update script, do not edit manually.

### Error entry format

```json
{
  "id": "COMPOSER-0001",
  "signal": "Cannot download repomd.xml: Connection timed out after 30001 milliseconds",
  "description": "RPM repo metadata download times out during osbuild stage",
  "category": "EXTERNAL",
  "component": "org.osbuild.rpm",
  "first_seen": "2026-06-10",
  "last_seen": "2026-06-17",
  "occurrences": [
    {
      "date": "2026-06-10",
      "pipeline_id": 2589716081,
      "job_ids": [14891232513, 14891232309],
      "group": "RHEL-9 Nightly"
    }
  ],
  "resolution": null
}
```

### Fields

| Field | Description |
|-------|-------------|
| `id` | Unique identifier, `COMPOSER-NNNN` format. Auto-assigned, never reused. |
| `signal` | Verbatim error text from the CI job log. Used for matching against future failures. |
| `description` | Short human-readable summary (one sentence). |
| `category` | One of: `FLAKE`, `EXTERNAL`, `BUG`, `INFRASTRUCTURE`. |
| `component` | osbuild stage name (e.g. `org.osbuild.rpm`) or test script name, or `null`. |
| `first_seen` | Date (YYYY-MM-DD) when this error was first observed. |
| `last_seen` | Date of the most recent occurrence. |
| `occurrences` | Append-only list of each time this error was seen. |
| `resolution` | `null` until resolved. Fill in manually with a short note (e.g. `"Fixed in osbuild-composer#5200"`). |

### Categories

- **FLAKE** -- non-deterministic failure (timing, network, resource contention)
- **EXTERNAL** -- external dependency or service changed behavior or is down
- **BUG** -- genuine issue in osbuild-composer code or test infrastructure
- **INFRASTRUCTURE** -- CI runner or environment failure (Docker, OOM, network)

## How it works

1. The status-dashboard daily CI analysis fetches failed job logs and the current `ci-error-db.json`.
2. Claude analyzes the logs and matches failures against known entries or flags new ones.
3. A script applies the updates, assigns IDs for new entries, and creates an MR in this repo.
4. A human reviews and merges the MR.
