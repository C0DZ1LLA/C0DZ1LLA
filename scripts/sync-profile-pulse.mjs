import fs from "node:fs/promises";

const LOGIN = process.env.GITHUB_LOGIN || "C0DZ1LLA";
const TOKEN = process.env.PROFILE_STATS_TOKEN || "";
const README_PATH = "README.md";
const SHOW_PRIVATE_REPO_NAMES = process.env.SHOW_PRIVATE_REPO_NAMES === "true";

function shield(label, message, color = "d4af37", labelColor = "050505") {
  const safeLabel = encodeURIComponent(String(label)).replace(/-/g, "--");
  const safeMessage = encodeURIComponent(String(message)).replace(/-/g, "--");
  return `<img src="https://img.shields.io/badge/${safeLabel}-${safeMessage}-${color}?style=for-the-badge&labelColor=${labelColor}" alt="${label}: ${message}" />`;
}

async function gh(pathname) {
  if (!TOKEN) throw new Error("PROFILE_STATS_TOKEN is not configured.");
  const response = await fetch(`https://api.github.com${pathname}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": `${LOGIN}-profile-pulse`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API ${response.status} for ${pathname}: ${text}`);
  }

  return response.json();
}

async function listRepos() {
  const repos = [];
  for (let page = 1; page <= 20; page += 1) {
    const batch = await gh(`/user/repos?visibility=all&affiliation=owner&type=owner&sort=pushed&direction=desc&per_page=100&page=${page}`);
    if (!Array.isArray(batch) || batch.length === 0) break;
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos.filter((repo) => repo.owner?.login?.toLowerCase() === LOGIN.toLowerCase());
}

function repoLabel(repo) {
  if (repo.private && !SHOW_PRIVATE_REPO_NAMES) return "Private workspace";
  return `\`${repo.full_name}\``;
}

function buildBlock(repos) {
  const publicRepos = repos.filter((repo) => !repo.private);
  const privateRepos = repos.filter((repo) => repo.private);
  const activeRepos = repos.filter((repo) => !repo.archived);
  const latest = [...repos]
    .sort((a, b) => new Date(b.pushed_at || 0) - new Date(a.pushed_at || 0))
    .slice(0, 5);

  const latestLines = latest.map((repo) => {
    const visibility = repo.private ? "private" : "public";
    const pushed = repo.pushed_at ? repo.pushed_at.slice(0, 10) : "unknown";
    return `- **${repoLabel(repo)}** — ${visibility}, pushed ${pushed}`;
  }).join("\n");

  return `<!-- PROFILE-PULSE:START -->
<p align="center">
  ${shield("Owned Repos", repos.length)}
  ${shield("Public", publicRepos.length, "111111")}
  ${shield("Private", privateRepos.length)}
  ${shield("Active", activeRepos.length, "f4f1e5", "050505")}
  ${shield("Last Sync", new Date().toISOString().slice(0, 10))}
</p>

```txt
public repositories show the signal
private repositories hold the production systems
profile stays clean, visual, and safe
```

### Recent Workspace Signal

${latestLines || "- No recent repository signal found."}

> This block is updated by GitHub Actions. Private repository names stay hidden unless `SHOW_PRIVATE_REPO_NAMES` is enabled.
<!-- PROFILE-PULSE:END -->`;
}

async function main() {
  if (!TOKEN) {
    console.log("PROFILE_STATS_TOKEN is not configured. Leaving README unchanged.");
    return;
  }

  const repos = await listRepos();
  const readme = await fs.readFile(README_PATH, "utf8");
  const next = readme.replace(
    /<!-- PROFILE-PULSE:START -->[\s\S]*?<!-- PROFILE-PULSE:END -->/,
    buildBlock(repos)
  );

  if (next === readme) {
    throw new Error("PROFILE-PULSE markers were not found in README.md.");
  }

  await fs.writeFile(README_PATH, next);
  await fs.mkdir("data", { recursive: true });
  await fs.writeFile("data/profile-summary.json", JSON.stringify({
    generatedAt: new Date().toISOString(),
    login: LOGIN,
    totals: {
      owned: repos.length,
      public: repos.filter((repo) => !repo.private).length,
      private: repos.filter((repo) => repo.private).length,
      active: repos.filter((repo) => !repo.archived).length,
    },
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
