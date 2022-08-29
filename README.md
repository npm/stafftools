# @npmcli/stafftools

The npm CLI Team's Internal Tools

## Usage

`npx -p @npmcli/stafftools <command> [...args]`

## Commands

- **Note**: Examples in this readme omit the `npx` portion of the command.

### `gh`

Run commands across all `npm-cli` repos on your local machine using working threads.

`npx -p @npmcli/stafftools gh <subcommand> [...args]`

- **Note:** The [`gh`](https://cli.github.com/manual/) cli needs to be installed and authenticated.

### Queries

All the `.mjs` files in [the `queries` dir](./lib/gh/queries/) return some sort of data from the GitHub api.

Each query is responsible for exporting:

- `default`: a function that will return data of some shape
- `args`: an object that will be passed to `yargs` to set the options
- `type`: the type of data that this query returns. should be value or array of values from [`types.mjs`](./lib/gh/types.mjs)

Any query can be run directly by name, or a custom query file can be passed in by path.

Without any other arguments, a query will print its data. A query `--template` option can be provided to change how the data is displayed. For example:

```sh
# Will return the result of the `repos` query
gh repos

# Add --help to see what subcommands are available
gh repos --help
# Commands:
#   gh repos clone          Clone repos into a directory
#   gh repos publish-repo   Publish repos from their default branch
#   gh repos pull           Checkout and pull default branch of repos
#   gh repos repo-settings  Set common settings on all repos
```

### Workers

All the `.mjs` files in [the `workers` dir](./lib/gh/workers/) operate on data returned from a query.

Each worker is reponsible for exporting:

- `default`: an array of commands to run on the data
- `args`: an object that will be passed to `yargs` to set the options
- `type`: the type of data that this worker operates. should be a value or array of values from [`types.mjs`](./lib/gh/types.mjs) or a string that is the name of a query or path to a query
- `success`: a function that will display the success message for each item from the query. can be useful for displaying the url to a pull request, name of a repo, etc

Note that for `type` if a worker specifies an exact query by name, then the worker can be run as it's own top level command. For example:

```sh
# This worker exports `type = 'template-oss'` so it can
# be run as a single positional command
gh template-oss-fix

# The above is equivalent to
gh template-oss template-oss-fix
```

### Options

#### `cwd`

The base directory in which all commands will be run. Defaults to `$HOME/projects`.

#### `limit`

Number of worker threads to spawn. Defaults to one less than the number of cores avaialble.

#### `filter[]`

An array of [relaxed JSON](http://www.relaxedjson.org) strings to filter the returned data.

For example: `gh merge pull-requests --filter 'title: SOME TITLE'.

### Example commands

These commands will all do something on your local machine.

Run `gh --help` to see a full list of commands.

#### `gh repos clone`

Clone all repos returned from the query.

#### `gh pending-release merge`

Merge all pending release pull requests.

#### `gh publish`

Merge pending release PRs and publish the resulting release.

#### `gh template-oss-fix`

Fix failing template-oss pull requests.
