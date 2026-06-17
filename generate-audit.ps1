param(
  [string]$TaskSummary = "Mention what the AI was asked to do",
  [string]$TestsRun = "Not recorded"
)

$ErrorActionPreference = "Stop"
$stamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

New-Item -ItemType Directory -Force audits | Out-Null

git add -N . | Out-Null

$branch = git branch --show-current
$commit = git rev-parse --short HEAD
$status = git status --short
$changedFiles = git diff --name-status HEAD -- . ":(exclude)audits/CHANGE_AUDIT.md"
$summary = git diff --stat HEAD -- . ":(exclude)audits/CHANGE_AUDIT.md"
$diff = git diff --no-ext-diff HEAD -- . ":(exclude)audits/CHANGE_AUDIT.md"

$report = @(
"# AI Change Audit Report"
""
"## Generated On"
$stamp
""
"## Branch"
$branch
""
"## Baseline Commit"
$commit
""
"## Task Summary"
$TaskSummary
""
"## Git Status"
'```text'
$status
'```'
""
"## Files Changed"
'```text'
$changedFiles
'```'
""
"## Change Summary"
'```text'
$summary
'```'
""
"## Full Diff"
'```diff'
$diff
'```'
""
"## Tests Run"
'```text'
$TestsRun
'```'
""
"## Risks / Pending Checks"
"- Review whether all changed files match the requested task."
"- Confirm role access rules are not broken."
"- Confirm AI/RAG/integrations/call recording were not added in this phase."
""
"## Rollback Command"
'```bash'
"git restore --staged ."
"git restore ."
"git clean -fd"
'```'
)

$report | Set-Content -Path "audits/CHANGE_AUDIT.md" -Encoding UTF8
Write-Host "Audit generated: audits/CHANGE_AUDIT.md"
