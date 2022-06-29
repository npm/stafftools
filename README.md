# @npmcli/stafftools

The npm CLI Team's Internal Tools

## Usage

`npx -p @npmcli/stafftools -- <command> [...args]`

## Commands

### `gh`

Run commands across all `npm-cli` repos on your local machine using working threads.

`npx -p @npmcli/stafftools -- gh <subcommand> [...args]`

- **Note:** The [`gh`](https://cli.github.com/manual/) cli needs to be installed and authenticated.

### Options

#### `cwd`

The base directory in which all commands will be run. Defaults to `$HOME/projects`.

#### `limit`

Number of worker threads to spawn. Defaults to one less than the number of cores avaialble.

#### `filter[]`

An array of [relaxed JSON](http://www.relaxedjson.org) strings to filter the returned data.

For example: `gh merge pull-requests --filter 'title: SOME TITLE'.

### Commands

These commands will all do something on your local machine.

#### `gh clone <query>`

Clone all repos returned from the query.

#### `gh merge <query>`

Merge all PRs returned from the query.

#### `gh publish`

Merge pending release PRs and publish the resulting release.

#### `gh template-oss-fix`

Fix failing template-oss pull requests

### Queries

Running these queries will only output the data returned from them. They can be combined with the commands above where the types match, such as `gh repos clone` and `gh merge pull-requests`.

#### `gh dependabot`

Fetch dependabot pull requests

#### `gh graphql`

Fetch a graphql query

#### `gh pending-release`

Fetch pending release pull requests

#### `gh pull-requests`

Fetch pull requests

#### `gh repos`

Fetch repos
