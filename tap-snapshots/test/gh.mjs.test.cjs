/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/gh.mjs TAP help messages > clone 1`] = `
npx -p @npmcli/stafftools gh clone

Clone all matching repos into a directory

Commands:
  npx -p @npmcli/stafftools gh clone repos  Fetch repos

Command Options:
      --remote  name of the remote  [required] [default: "origin"]
      --table   shorthand for --template=table  [boolean] [default: false]

Global Options:
  -c, --cwd       base directory to run all commands  [string] [required] [default: "$HOME/projects"]
  -l, --limit     number of worker threads to spawn  [number] [default: $NUM_CORES]
  -f, --filter    filters to be parsed as relaxed json and applied to the data  [array]
      --clean     whether to rimraf the cwd first  [boolean] [default: false]
      --template  how to format the final output  [string] [required] [choices: "json", "silent", "table"] [default: "json"]
      --json      shorthand for --template=json  [boolean] [default: false]
      --silent    shorthand for --template=silent  [boolean] [default: false]

Other Options:
      --help     Show help  [boolean]
      --version  Show version number  [boolean]
      --config   Path to JSON config file

`

exports[`test/gh.mjs TAP help messages > dependabot 1`] = `
npx -p @npmcli/stafftools gh dependabot

Fetch dependabot pull requests

Command Options:
      --cache  how long for gh to cache the query  [string] [default: "1m"]
      --repos  query to filter repos  [string] [required] [default: "org:npm topic:npm-cli"]
      --table  shorthand for --template=table  [boolean] [default: false]

Global Options:
  -c, --cwd       base directory to run all commands  [string] [required] [default: "$HOME/projects"]
  -l, --limit     number of worker threads to spawn  [number] [default: $NUM_CORES]
  -f, --filter    filters to be parsed as relaxed json and applied to the data  [array]
      --clean     whether to rimraf the cwd first  [boolean] [default: false]
      --template  how to format the final output  [string] [required] [choices: "json", "silent", "table"] [default: "table"]
      --json      shorthand for --template=json  [boolean] [default: false]
      --silent    shorthand for --template=silent  [boolean] [default: false]

Other Options:
      --help     Show help  [boolean]
      --version  Show version number  [boolean]
      --config   Path to JSON config file

`

exports[`test/gh.mjs TAP help messages > graphql 1`] = `
npx -p @npmcli/stafftools gh graphql

Fetch a graphql query

Command Options:
      --query  path to a query file passed directly to gh api graphql  [string] [required]
      --cache  how long for gh to cache the query  [string] [default: "1m"]

Global Options:
  -c, --cwd       base directory to run all commands  [string] [required] [default: "$HOME/projects"]
  -l, --limit     number of worker threads to spawn  [number] [default: $NUM_CORES]
  -f, --filter    filters to be parsed as relaxed json and applied to the data  [array]
      --clean     whether to rimraf the cwd first  [boolean] [default: false]
      --template  how to format the final output  [string] [required] [choices: "json", "silent"] [default: "json"]
      --json      shorthand for --template=json  [boolean] [default: false]
      --silent    shorthand for --template=silent  [boolean] [default: false]

Other Options:
      --help     Show help  [boolean]
      --version  Show version number  [boolean]
      --config   Path to JSON config file

`

exports[`test/gh.mjs TAP help messages > merge 1`] = `
npx -p @npmcli/stafftools gh merge

Merge pull requests

Commands:
  npx -p @npmcli/stafftools gh merge dependabot       Fetch dependabot pull requests
  npx -p @npmcli/stafftools gh merge pending-release  Fetch pending release pull requests
  npx -p @npmcli/stafftools gh merge pull-requests    Fetch pull requests

Command Options:
      --merge-strategy  strategy to use when merging the pull request  [required] [choices: "squash", "rebase"]
      --remote          name of the remote  [required] [default: "origin"]
      --default-filter  whether to apply the default filter to the data  [boolean] [default: true]
      --table           shorthand for --template=table  [boolean] [default: false]

Global Options:
  -c, --cwd       base directory to run all commands  [string] [required] [default: "$HOME/projects"]
  -l, --limit     number of worker threads to spawn  [number] [default: $NUM_CORES]
  -f, --filter    filters to be parsed as relaxed json and applied to the data  [array]
      --clean     whether to rimraf the cwd first  [boolean] [default: false]
      --template  how to format the final output  [string] [required] [choices: "json", "silent", "table"] [default: "json"]
      --json      shorthand for --template=json  [boolean] [default: false]
      --silent    shorthand for --template=silent  [boolean] [default: false]

Other Options:
      --help     Show help  [boolean]
      --version  Show version number  [boolean]
      --config   Path to JSON config file

`

exports[`test/gh.mjs TAP help messages > merge dependabot 1`] = `
npx -p @npmcli/stafftools gh merge dependabot

Fetch dependabot pull requests

Command Options:
      --merge-strategy  strategy to use when merging the pull request  [required] [choices: "squash", "rebase"]
      --remote          name of the remote  [required] [default: "origin"]
      --default-filter  whether to apply the default filter to the data  [boolean] [default: true]
      --table           shorthand for --template=table  [boolean] [default: false]
      --cache           how long for gh to cache the query  [string] [default: "1m"]
      --repos           query to filter repos  [string] [required] [default: "org:npm topic:npm-cli"]

Global Options:
  -c, --cwd       base directory to run all commands  [string] [required] [default: "$HOME/projects"]
  -l, --limit     number of worker threads to spawn  [number] [default: $NUM_CORES]
  -f, --filter    filters to be parsed as relaxed json and applied to the data  [array]
      --clean     whether to rimraf the cwd first  [boolean] [default: false]
      --template  how to format the final output  [string] [required] [choices: "json", "silent", "table"] [default: "json"]
      --json      shorthand for --template=json  [boolean] [default: false]
      --silent    shorthand for --template=silent  [boolean] [default: false]

Other Options:
      --help     Show help  [boolean]
      --version  Show version number  [boolean]
      --config   Path to JSON config file

`

exports[`test/gh.mjs TAP help messages > merge pending-release 1`] = `
npx -p @npmcli/stafftools gh merge pending-release

Fetch pending release pull requests

Command Options:
      --merge-strategy  strategy to use when merging the pull request  [required] [choices: "squash", "rebase"]
      --remote          name of the remote  [required] [default: "origin"]
      --default-filter  whether to apply the default filter to the data  [boolean] [default: true]
      --table           shorthand for --template=table  [boolean] [default: false]
      --cache           how long for gh to cache the query  [string] [default: "1m"]
      --repos           query to filter repos  [string] [required] [default: "org:npm topic:npm-cli"]

Global Options:
  -c, --cwd       base directory to run all commands  [string] [required] [default: "$HOME/projects"]
  -l, --limit     number of worker threads to spawn  [number] [default: $NUM_CORES]
  -f, --filter    filters to be parsed as relaxed json and applied to the data  [array]
      --clean     whether to rimraf the cwd first  [boolean] [default: false]
      --template  how to format the final output  [string] [required] [choices: "json", "silent", "table"] [default: "json"]
      --json      shorthand for --template=json  [boolean] [default: false]
      --silent    shorthand for --template=silent  [boolean] [default: false]

Other Options:
      --help     Show help  [boolean]
      --version  Show version number  [boolean]
      --config   Path to JSON config file

`

exports[`test/gh.mjs TAP help messages > merge pull-requests 1`] = `
npx -p @npmcli/stafftools gh merge pull-requests

Fetch pull requests

Command Options:
      --merge-strategy  strategy to use when merging the pull request  [required] [choices: "squash", "rebase"]
      --remote          name of the remote  [required] [default: "origin"]
      --default-filter  whether to apply the default filter to the data  [boolean] [default: true]
      --table           shorthand for --template=table  [boolean] [default: false]
      --cache           how long for gh to cache the query  [string] [default: "1m"]
      --repos           query to filter repos  [string] [required] [default: "org:npm topic:npm-cli"]
      --label           label to filter pull requests  [string]
      --state           state to filter pull requests  [string] [choices: "CLOSED", "MERGED", "OPEN"] [default: "OPEN"]

Global Options:
  -c, --cwd       base directory to run all commands  [string] [required] [default: "$HOME/projects"]
  -l, --limit     number of worker threads to spawn  [number] [default: $NUM_CORES]
  -f, --filter    filters to be parsed as relaxed json and applied to the data  [array]
      --clean     whether to rimraf the cwd first  [boolean] [default: false]
      --template  how to format the final output  [string] [required] [choices: "json", "silent", "table"] [default: "json"]
      --json      shorthand for --template=json  [boolean] [default: false]
      --silent    shorthand for --template=silent  [boolean] [default: false]

Other Options:
      --help     Show help  [boolean]
      --version  Show version number  [boolean]
      --config   Path to JSON config file

`

exports[`test/gh.mjs TAP help messages > must match snapshot 1`] = `
npx -p @npmcli/stafftools gh <command>

Commands:
  npx -p @npmcli/stafftools gh clone             Clone all matching repos into a directory
  npx -p @npmcli/stafftools gh merge             Merge pull requests
  npx -p @npmcli/stafftools gh publish           Merge pending release PRs and publish the resulting release
  npx -p @npmcli/stafftools gh template-oss-fix  Fix failing template-oss pull requests
  npx -p @npmcli/stafftools gh dependabot        Fetch dependabot pull requests
  npx -p @npmcli/stafftools gh graphql           Fetch a graphql query
  npx -p @npmcli/stafftools gh pending-release   Fetch pending release pull requests
  npx -p @npmcli/stafftools gh pull-requests     Fetch pull requests
  npx -p @npmcli/stafftools gh repos             Fetch repos

Global Options:
  -c, --cwd       base directory to run all commands  [string] [required] [default: "$HOME/projects"]
  -l, --limit     number of worker threads to spawn  [number] [default: $NUM_CORES]
  -f, --filter    filters to be parsed as relaxed json and applied to the data  [array]
      --clean     whether to rimraf the cwd first  [boolean] [default: false]
      --template  how to format the final output  [string] [required] [choices: "json", "silent"] [default: "json"]
      --json      shorthand for --template=json  [boolean] [default: false]
      --silent    shorthand for --template=silent  [boolean] [default: false]

Other Options:
      --help     Show help  [boolean]
      --version  Show version number  [boolean]
      --config   Path to JSON config file

`

exports[`test/gh.mjs TAP help messages > pending-release 1`] = `
npx -p @npmcli/stafftools gh pending-release

Fetch pending release pull requests

Command Options:
      --cache  how long for gh to cache the query  [string] [default: "1m"]
      --repos  query to filter repos  [string] [required] [default: "org:npm topic:npm-cli"]
      --table  shorthand for --template=table  [boolean] [default: false]

Global Options:
  -c, --cwd       base directory to run all commands  [string] [required] [default: "$HOME/projects"]
  -l, --limit     number of worker threads to spawn  [number] [default: $NUM_CORES]
  -f, --filter    filters to be parsed as relaxed json and applied to the data  [array]
      --clean     whether to rimraf the cwd first  [boolean] [default: false]
      --template  how to format the final output  [string] [required] [choices: "json", "silent", "table"] [default: "table"]
      --json      shorthand for --template=json  [boolean] [default: false]
      --silent    shorthand for --template=silent  [boolean] [default: false]

Other Options:
      --help     Show help  [boolean]
      --version  Show version number  [boolean]
      --config   Path to JSON config file

`

exports[`test/gh.mjs TAP help messages > publish 1`] = `
npx -p @npmcli/stafftools gh publish

Merge pending release PRs and publish the resulting release

Command Options:
      --otp             otp to be used for publish  [string] [required]
      --remote          name of the remote  [required] [default: "origin"]
      --default-filter  whether to apply the default filter to the data  [boolean] [default: true]
      --cache           how long for gh to cache the query  [string] [default: "1m"]
      --repos           query to filter repos  [string] [required] [default: "org:npm topic:npm-cli"]

Global Options:
  -c, --cwd       base directory to run all commands  [string] [required] [default: "$HOME/projects"]
  -l, --limit     number of worker threads to spawn  [number] [default: $NUM_CORES]
  -f, --filter    filters to be parsed as relaxed json and applied to the data  [array]
      --clean     whether to rimraf the cwd first  [boolean] [default: false]
      --template  how to format the final output  [string] [required] [choices: "json", "silent"] [default: "json"]
      --json      shorthand for --template=json  [boolean] [default: false]
      --silent    shorthand for --template=silent  [boolean] [default: false]

Other Options:
      --help     Show help  [boolean]
      --version  Show version number  [boolean]
      --config   Path to JSON config file

`

exports[`test/gh.mjs TAP help messages > pull-requests 1`] = `
npx -p @npmcli/stafftools gh pull-requests

Fetch pull requests

Command Options:
      --cache  how long for gh to cache the query  [string] [default: "1m"]
      --repos  query to filter repos  [string] [required] [default: "org:npm topic:npm-cli"]
      --label  label to filter pull requests  [string]
      --state  state to filter pull requests  [string] [choices: "CLOSED", "MERGED", "OPEN"] [default: "OPEN"]
      --table  shorthand for --template=table  [boolean] [default: false]

Global Options:
  -c, --cwd       base directory to run all commands  [string] [required] [default: "$HOME/projects"]
  -l, --limit     number of worker threads to spawn  [number] [default: $NUM_CORES]
  -f, --filter    filters to be parsed as relaxed json and applied to the data  [array]
      --clean     whether to rimraf the cwd first  [boolean] [default: false]
      --template  how to format the final output  [string] [required] [choices: "json", "silent", "table"] [default: "table"]
      --json      shorthand for --template=json  [boolean] [default: false]
      --silent    shorthand for --template=silent  [boolean] [default: false]

Other Options:
      --help     Show help  [boolean]
      --version  Show version number  [boolean]
      --config   Path to JSON config file

`

exports[`test/gh.mjs TAP help messages > repos 1`] = `
npx -p @npmcli/stafftools gh repos

Fetch repos

Command Options:
      --cache  how long for gh to cache the query  [string] [default: "1h"]
      --repos  query to filter repos  [string] [required] [default: "org:npm topic:npm-cli"]
      --table  shorthand for --template=table  [boolean] [default: false]

Global Options:
  -c, --cwd       base directory to run all commands  [string] [required] [default: "$HOME/projects"]
  -l, --limit     number of worker threads to spawn  [number] [default: $NUM_CORES]
  -f, --filter    filters to be parsed as relaxed json and applied to the data  [array]
      --clean     whether to rimraf the cwd first  [boolean] [default: false]
      --template  how to format the final output  [string] [required] [choices: "json", "silent", "table"] [default: "table"]
      --json      shorthand for --template=json  [boolean] [default: false]
      --silent    shorthand for --template=silent  [boolean] [default: false]

Other Options:
      --help     Show help  [boolean]
      --version  Show version number  [boolean]
      --config   Path to JSON config file

`

exports[`test/gh.mjs TAP help messages > template-oss-fix 1`] = `
npx -p @npmcli/stafftools gh template-oss-fix

Fix failing template-oss pull requests

Command Options:
      --message         Commit message to be used for template oss changes  [required] [default: "chore: postinstall for dependabot template-oss PR"]
      --default-filter  whether to apply the default filter to the data  [boolean] [default: true]
      --cache           how long for gh to cache the query  [string] [default: "1m"]
      --repos           query to filter repos  [string] [required] [default: "org:npm topic:npm-cli"]

Global Options:
  -c, --cwd       base directory to run all commands  [string] [required] [default: "$HOME/projects"]
  -l, --limit     number of worker threads to spawn  [number] [default: $NUM_CORES]
  -f, --filter    filters to be parsed as relaxed json and applied to the data  [array]
      --clean     whether to rimraf the cwd first  [boolean] [default: false]
      --template  how to format the final output  [string] [required] [choices: "json", "silent"] [default: "json"]
      --json      shorthand for --template=json  [boolean] [default: false]
      --silent    shorthand for --template=silent  [boolean] [default: false]

Other Options:
      --help     Show help  [boolean]
      --version  Show version number  [boolean]
      --config   Path to JSON config file

`
