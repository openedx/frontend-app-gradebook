# CI Configuration

Your project might have different build requirements - however, this project's `.github/ci.yml` configuration is supposed to represent a good starting point.

## Node JS Version

The minimum `Node` and `npm` versions that edX supports is `8.9.3` and `5.5.1`, respectively.

## Scripts

Most of the `script`s are self-explanatory - you probably want to fail a build if there are linting violations, or if any tests don't pass, or if it cannot compile your files.

However, there are a couple additional `script`s that might seem less self-explanatory.

### What the heck is `make validate-no-uncommitted-package-lock-changes`?

There are only two requirements for a good `make target` name

1. Definitely make it really verbose so people can't remember what it's called
2. Definitely don't not use a double-negative

What `make validate-no-uncommitted-package-lock-changes` does is `git diff`s for any `package-lock.json` file changes in your project. It's important to remember that all build `script`s are executed in CI *after* the `install` step (aka post-`npm install`).

This is important because `npm` uses the pinned dependencies in your `package-lock.json` file to build the `node_modules` directory. However, the dependencies defined within the `package.json` file can be modified manually, for example, to become misaligned with the dependencies defined within the `package-lock.json`. So when `npm install` executes, the `package-lock.json` file will be updated to mirror the modified `package.json` changes.

However, when these changes surface within a CI build, this indicates differing dependency expectations between the committed `package.json` file and the `package-lock.json` file, which is a good reason to fail a build.

### `deploy` step

How your project deploys will probably differ between the cookie cutter and your own application.

For demonstrational purposes, the cookie cutter deploys to GitHub pages using [ GitHUb CI ].

Your application might deploy to an `S3` bucket or to `npm`.
