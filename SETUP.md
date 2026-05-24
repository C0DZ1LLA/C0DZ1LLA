# C0DZ1LLA GitHub Profile Setup

Use this folder as the content of the special GitHub profile repository:

```txt
C0DZ1LLA/C0DZ1LLA
```

## Upload

1. Open `https://github.com/C0DZ1LLA/C0DZ1LLA`.
2. Replace the old files with this package.
3. Commit to `main`.
4. Refresh your GitHub profile.

The visible README works immediately because it only references files included in this repository or stable public badge services.

## Optional: enable private/public repo pulse

The included workflow can update the `PROFILE-PULSE` block using GitHub API data.

Create this repository secret:

```txt
PROFILE_STATS_TOKEN
```

Recommended token permissions:

```txt
Read access to repositories you want counted
Write access to the C0DZ1LLA/C0DZ1LLA profile repo contents
```

Then go to:

```txt
Actions → Sync profile pulse → Run workflow
```

Private repo names are hidden by default.

## Optional: contribution snake

The package includes a snake workflow, but the README does not display it by default. This prevents broken images before the `output` branch exists.

To show it later, add this block after running the workflow once:

```md
<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/C0DZ1LLA/C0DZ1LLA/output/github-contribution-grid-snake-dark.svg" />
    <img alt="Contribution Snake" src="https://raw.githubusercontent.com/C0DZ1LLA/C0DZ1LLA/output/github-contribution-grid-snake.svg" />
  </picture>
</p>
```

## What was fixed

```txt
removed .git from the package
removed stale hardcoded private/public repo counters
removed visible references to missing output-branch images
added local futuristic SVG panels
cleaned duplicated setup/docs
added safe optional automation
kept the profile public-safe and professional
```


## Visual assets added in V3

```txt
assets/mission-patches.svg
assets/boot-console.svg
assets/active-systems-dashboard.svg
assets/tech-radar.svg
```

These are local SVGs, so they load immediately from the profile repository without needing an external image host.
