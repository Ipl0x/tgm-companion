# Approved community source records

Files in this directory are created only after a supported community submission receives the maintainer-controlled `status:approved` label.

Approval does **not** write directly to `main`. The review workflow creates or refreshes a dedicated `community/issue-<number>-approved` branch and opens a pull request. The normalized source record is stored here so the exact approved submission remains reviewable in Git history.

Before merging the publication pull request, any required integration into the Investment planner, Building Star-Up data, or Wiki can be added to the same branch. When the publication pull request is merged, the source issue is marked `status:published`.

Community submissions that have not reached `status:published` remain review material and must not be treated as maintained game data.
