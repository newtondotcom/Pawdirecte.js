# Contributing

## Development

To start developing, clone the repository and install the dependencies.

```bash
# Clone the repository.
git clone https://github.com/newtondotcom/Pawdirecte.js/tree/main && cd Pawdirecte.js
# Install dependencies.
bun install
```

> In case you don't have `bun` installed, you can install it by running `curl -fsSL https://bun.com/install | bash`.

## Release

Currently using `release-it` to create a tag and GitHub release.

```bash
# Create a new release.
pnpm release
```

An action will automatically publish the package to NPM when a tag is pushed to the repository.
