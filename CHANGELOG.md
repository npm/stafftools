# Changelog

## [3.1.3](https://github.com/npm/stafftools/compare/v3.1.2...v3.1.3) (2025-09-22)
### Dependencies
* [`7863b9a`](https://github.com/npm/stafftools/commit/7863b9a8cc0b9e0ad4f6f697435609230a71550d) [#158](https://github.com/npm/stafftools/pull/158) bump string-width from 7.2.0 to 8.0.0 (#158) (@dependabot[bot])
### Chores
* [`ced2905`](https://github.com/npm/stafftools/commit/ced2905af58ddc8f337d06f1026f28093d6344ab) [#160](https://github.com/npm/stafftools/pull/160) bump @npmcli/template-oss from 4.25.0 to 4.25.1 (#160) (@dependabot[bot], @npm-cli-bot)

## [3.1.2](https://github.com/npm/stafftools/compare/v3.1.1...v3.1.2) (2025-04-28)
### Dependencies
* [`37083dd`](https://github.com/npm/stafftools/commit/37083dd48da7857a41017890b06438e59d9a41ab) [#152](https://github.com/npm/stafftools/pull/152) bump serialize-error from 11.0.3 to 12.0.0 (#152) (@dependabot[bot])
### Chores
* [`97a22d7`](https://github.com/npm/stafftools/commit/97a22d7a7ded07d8672b466cbaddd8d725ced6a1) [#154](https://github.com/npm/stafftools/pull/154) postinstall workflow updates (#154) (@owlstronaut)
* [`ff654da`](https://github.com/npm/stafftools/commit/ff654da6a8f1a0d13710d8f547736c0f358e7e07) [#151](https://github.com/npm/stafftools/pull/151) bump @npmcli/template-oss from 4.23.3 to 4.24.3 (#151) (@dependabot[bot], @npm-cli-bot)

## [3.1.1](https://github.com/npm/stafftools/compare/v3.1.0...v3.1.1) (2024-10-02)
### Dependencies
* [`10c1155`](https://github.com/npm/stafftools/commit/10c1155c49beec7911a6f0a7a711100ab5d19895) [#148](https://github.com/npm/stafftools/pull/148) bump `which@5.0.0`
### Chores
* [`4528d49`](https://github.com/npm/stafftools/commit/4528d49e38952fa870efc26b04b0a497d92ee479) [#145](https://github.com/npm/stafftools/pull/145) postinstall for dependabot template-oss PR (@hashtagchris)
* [`2768739`](https://github.com/npm/stafftools/commit/27687393ec49a0ee86f173f258964855afaa0f3d) [#145](https://github.com/npm/stafftools/pull/145) bump @npmcli/template-oss from 4.23.1 to 4.23.3 (@dependabot[bot])

## [3.1.0](https://github.com/npm/stafftools/compare/v3.0.0...v3.1.0) (2024-08-27)

### Features

* [`df7a431`](https://github.com/npm/stafftools/commit/df7a431c2318a3d62df65197d4bf229d3eb34dcf) [#146](https://github.com/npm/stafftools/pull/146) Avoid refixing successful template-oss PRs (#146) (@hashtagchris, @wraithgar)

## [3.0.0](https://github.com/npm/stafftools/compare/v2.5.0...v3.0.0) (2024-08-27)

### ⚠️ BREAKING CHANGES

* `stafftools` now supports node `>=22.0.0`

### Features

* [`eb6d5ef`](https://github.com/npm/stafftools/commit/eb6d5ef8fdc6fe777a4e1d48e7b39d0e26a01f50) [#139](https://github.com/npm/stafftools/pull/139) better support for cloning forked repos (#139) (@hashtagchris)

### Bug Fixes

* [`ebc67cf`](https://github.com/npm/stafftools/commit/ebc67cf16b55df8e77db959ce58f299bfe1d7a2c) [#144](https://github.com/npm/stafftools/pull/144) move node engines to 22 (@hashtagchris)

### Dependencies

* [`08d9927`](https://github.com/npm/stafftools/commit/08d99277817a67b150fffe03da3e1783b3596e84) [#135](https://github.com/npm/stafftools/pull/135) bump minimatch from 9.0.5 to 10.0.1 (@dependabot[bot])

### Chores

* [`2612ea9`](https://github.com/npm/stafftools/commit/2612ea9b5820703ca332c389fd18a063617fc2be) [#144](https://github.com/npm/stafftools/pull/144) run template-oss-apply (@hashtagchris)
* [`d5fcc51`](https://github.com/npm/stafftools/commit/d5fcc5170ddbac00dec437d03bdd74b757092fc2) [#143](https://github.com/npm/stafftools/pull/143) bump @npmcli/eslint-config from 4.0.5 to 5.0.0 (@dependabot[bot])
* [`21fe981`](https://github.com/npm/stafftools/commit/21fe98195f2750b2a8a1bcde3699ee10ca08c262) [#137](https://github.com/npm/stafftools/pull/137) postinstall for dependabot template-oss PR (@hashtagchris)
* [`0d227d9`](https://github.com/npm/stafftools/commit/0d227d97c876bbc7c489654c1aaeb315d66345fb) [#137](https://github.com/npm/stafftools/pull/137) bump @npmcli/template-oss from 4.22.0 to 4.23.1 (@dependabot[bot])

## [2.5.0](https://github.com/npm/stafftools/compare/v2.4.1...v2.5.0) (2024-05-07)

### Features

* [`5c172d9`](https://github.com/npm/stafftools/commit/5c172d9fd3f61b4e8a5a2ab6b2c012cd17c5d74c) [#123](https://github.com/npm/stafftools/pull/123) add worker to comment on a PR (#123) (@lukekarrys)
* [`d9317f6`](https://github.com/npm/stafftools/commit/d9317f6064448ee4c3a84eadd49ca5ce9c524288) [#128](https://github.com/npm/stafftools/pull/128) add weekly-metrics (#128) (@lukekarrys, @wraithgar)

### Bug Fixes

* [`ffbae09`](https://github.com/npm/stafftools/commit/ffbae09e505c7fbad75f324dc363507d9a160506) [#125](https://github.com/npm/stafftools/pull/125) template-oss-fix: allow no engines (#125) (@lukekarrys)

### Dependencies

* [`c7510bd`](https://github.com/npm/stafftools/commit/c7510bdfd05d02752b2bb556a78aa663edaea505) [#118](https://github.com/npm/stafftools/pull/118) bump string-width from 6.1.0 to 7.1.0 (#118) (@dependabot[bot])

### Chores

* [`74206a5`](https://github.com/npm/stafftools/commit/74206a5f517f94aeb083e4abff3e7bbc6df6ca0b) [#126](https://github.com/npm/stafftools/pull/126) postinstall for dependabot template-oss PR (@lukekarrys)
* [`151f7e0`](https://github.com/npm/stafftools/commit/151f7e03f4ccef97950772f3dee5200c0a638914) [#126](https://github.com/npm/stafftools/pull/126) bump @npmcli/template-oss from 4.21.4 to 4.22.0 (@dependabot[bot])

## [2.4.1](https://github.com/npm/stafftools/compare/v2.4.0...v2.4.1) (2023-09-12)

### Bug Fixes

* [`143d3e3`](https://github.com/npm/stafftools/commit/143d3e36bb805c5eb0611642a60cc0425465c7b1) [#91](https://github.com/npm/stafftools/pull/91) add dependabot for valid commit author on template oss (@lukekarrys)

### Dependencies

* [`3be1d85`](https://github.com/npm/stafftools/commit/3be1d85e4591b7e51feb5cfea49f795998c4db1a) [#89](https://github.com/npm/stafftools/pull/89) bump which from 3.0.1 to 4.0.0

## [2.4.0](https://github.com/npm/stafftools/compare/v2.3.1...v2.4.0) (2023-07-19)

### Features

* [`ef10693`](https://github.com/npm/stafftools/commit/ef1069396eb65b4bf054037fae6b9536b74826f7) set repo secret command (@lukekarrys)

### Bug Fixes

* [`90dfc1b`](https://github.com/npm/stafftools/commit/90dfc1b99944c8eeb869acfccfae10b8a3710f67) clean gh tokens (@lukekarrys)
* [`834b8a9`](https://github.com/npm/stafftools/commit/834b8a949c8229e767cc39282915b2ce1afe6f5f) correct failure in set-secret (@lukekarrys)
* [`354ca01`](https://github.com/npm/stafftools/commit/354ca010bd389a9f15265b5688be2404e6ffc0e1) better filters for template-oss, review, and merge queries (@lukekarrys)
* [`3a21cbc`](https://github.com/npm/stafftools/commit/3a21cbc039c155bb793d32272d991585900ae3c3) better null cwd support (@lukekarrys)

## [2.3.1](https://github.com/npm/stafftools/compare/v2.3.0...v2.3.1) (2023-07-13)

### Bug Fixes

* [`b886aca`](https://github.com/npm/stafftools/commit/b886acaa3efa42a2b878d87473cd143a40912e06) make cwd optional for api related commands (@lukekarrys)
* [`872cc43`](https://github.com/npm/stafftools/commit/872cc4382a9740b00958f997839b6964bc36d289) use --repo for review command (@lukekarrys)

### Dependencies

* [`1afd259`](https://github.com/npm/stafftools/commit/1afd259198d26810f70c4b85c14cbb7ce55a6540) [#82](https://github.com/npm/stafftools/pull/82) bump minimatch from 7.4.6 to 9.0.3 (#82)
* [`c94358d`](https://github.com/npm/stafftools/commit/c94358d77d592df0d5f437015b33ab0fffb2830f) [#84](https://github.com/npm/stafftools/pull/84) bump @supercharge/promise-pool from 2.4.0 to 3.0.0
* [`40d1140`](https://github.com/npm/stafftools/commit/40d11408bdc6d58bff53a77079c9632a3225296e) [#78](https://github.com/npm/stafftools/pull/78) bump string-width from 5.1.2 to 6.1.0

## [2.3.0](https://github.com/npm/stafftools/compare/v2.2.5...v2.3.0) (2023-07-12)

### Features

* [`d816f12`](https://github.com/npm/stafftools/commit/d816f12b8885fb03a7329c569e0bdeabb4a04357) add review command (@lukekarrys)

## [2.2.5](https://github.com/npm/stafftools/compare/v2.2.4...v2.2.5) (2023-03-21)

### Dependencies

* [`2fefd16`](https://github.com/npm/stafftools/commit/2fefd16319baa426d5c9ef9bf49574cad40082c1) [#72](https://github.com/npm/stafftools/pull/72) bump minimatch from 6.2.0 to 7.4.2 (#72)

## [2.2.4](https://github.com/npm/stafftools/compare/v2.2.3...v2.2.4) (2023-02-06)

### Bug Fixes

* [`048eafd`](https://github.com/npm/stafftools/commit/048eafd5526cd4863f561f5a2afb37bdb661a92c) [#62](https://github.com/npm/stafftools/pull/62) paginate repos to stop getting graphql timeout errors (#62) (@lukekarrys)

### Dependencies

* [`ca9d60c`](https://github.com/npm/stafftools/commit/ca9d60c77ce2f54853fd5fa21042e8f5f1d33713) [#60](https://github.com/npm/stafftools/pull/60) bump minimatch from 5.1.6 to 6.1.6 (#60)

## [2.2.3](https://github.com/npm/stafftools/compare/v2.2.2...v2.2.3) (2022-12-13)

### Bug Fixes

* [`674c563`](https://github.com/npm/stafftools/commit/674c563968c374ea91c299d060f8ed088530802e) allow 1p or op for 1password (@lukekarrys)

### Documentation

* [`57399b5`](https://github.com/npm/stafftools/commit/57399b58c6f0aa07dc7522780d152e374c0e7387) add examples (@lukekarrys)

## [2.2.2](https://github.com/npm/stafftools/compare/v2.2.1...v2.2.2) (2022-11-02)

### Dependencies

* [`b1aa341`](https://github.com/npm/stafftools/commit/b1aa3417fee8c5e081a3714b3ac9424af01dca22) [#51](https://github.com/npm/stafftools/pull/51) bump which from 2.0.2 to 3.0.0

## [2.2.1](https://github.com/npm/stafftools/compare/v2.2.0...v2.2.1) (2022-10-27)

### Bug Fixes

* [`e6ff0e7`](https://github.com/npm/stafftools/commit/e6ff0e7e51e09c153b4884ad3a654fbb16a1b9c7) [#49](https://github.com/npm/stafftools/pull/49) dont use bin to find npx cache (@lukekarrys)

## [2.2.0](https://github.com/npm/stafftools/compare/v2.1.1...v2.2.0) (2022-10-19)

### Features

* [`e7ec526`](https://github.com/npm/stafftools/commit/e7ec526c76f3eee062cd5fdc156ce4864f4acdea) [#44](https://github.com/npm/stafftools/pull/44) add pr option to filter on other open prs (@lukekarrys)
* [`f96e425`](https://github.com/npm/stafftools/commit/f96e425b22ec043de937b3bf8cc4dd1a856373d8) add sorting (@lukekarrys)
* [`0be91c7`](https://github.com/npm/stafftools/commit/0be91c718d837dbd2cefbbb77fc58350851a0b6a) add reject option and add-template-oss worker (@lukekarrys)
* [`00a7702`](https://github.com/npm/stafftools/commit/00a7702299da5e93e79e56ccd18acb201fdc31c1) add better workflows for publishing multiple dependent packages (@lukekarrys)

## [2.1.1](https://github.com/npm/stafftools/compare/v2.1.0...v2.1.1) (2022-10-13)

### Bug Fixes

* [`fd4c418`](https://github.com/npm/stafftools/commit/fd4c41888b2fefec335417159b6c8f0dff58755c) use config to globally exclude some repos (@lukekarrys)

## [2.1.0](https://github.com/npm/stafftools/compare/v2.0.3...v2.1.0) (2022-10-04)

### Features

* [`022fd89`](https://github.com/npm/stafftools/commit/022fd89fa7528bde9f08c5ad49d589bf41352e81) add delete branches command (@lukekarrys)

### Bug Fixes

* [`0ef5930`](https://github.com/npm/stafftools/commit/0ef5930be12cda8e25dde3e77b8f3a612a323431) ignore some repos (@lukekarrys)

### Dependencies

* [`b35a062`](https://github.com/npm/stafftools/commit/b35a0622c2ac4c8606f2ade1a6e604c5d35f8fc7) update yargs

## [2.0.3](https://github.com/npm/stafftools/compare/v2.0.2...v2.0.3) (2022-09-30)

### Bug Fixes

* [`c95c446`](https://github.com/npm/stafftools/commit/c95c4469cf2f31cf580ae6a5cb6010cbd3ccca72) template-oss-fix: add flags for installing to workspaces (@lukekarrys)

## [2.0.2](https://github.com/npm/stafftools/compare/v2.0.1...v2.0.2) (2022-09-23)

### Bug Fixes

* [`33a233c`](https://github.com/npm/stafftools/commit/33a233c85b5b9b1dfeaef31f32e56eecd48d6f65) correctly commit when amend and no message is provided (@lukekarrys)

## [2.0.1](https://github.com/npm/stafftools/compare/v2.0.0...v2.0.1) (2022-09-21)

### Bug Fixes

* [`2f898c3`](https://github.com/npm/stafftools/commit/2f898c3cb108208ad3a8213ffa410e8eb90d25da) make template-oss-fix worker more robust (@lukekarrys)
* [`b6e9e80`](https://github.com/npm/stafftools/commit/b6e9e80dddca4a7df7f4be4458c0ffaccc6250ed) add templateoss keys to repos table output (@lukekarrys)

## [2.0.0](https://github.com/npm/stafftools/compare/v1.0.1...v2.0.0) (2022-08-29)


### ⚠ BREAKING CHANGES

* Query is now the first positional argument. Most commands can be run with the signature `<query> [worker]`. If the worker positional is not included, then the command will print the results of the query.

### Features

* add new commands and queries ([#23](https://github.com/npm/stafftools/issues/23)) ([2f2f405](https://github.com/npm/stafftools/commit/2f2f405331627e70c35c29423e4c3ee3c1d24609))


### Bug Fixes

* fetch forks by default ([#21](https://github.com/npm/stafftools/issues/21)) ([4da204e](https://github.com/npm/stafftools/commit/4da204e12419f002db45fdfbad71125c671bc619))


### Documentation

* update readme ([df5e8a6](https://github.com/npm/stafftools/commit/df5e8a6dee85ff5af75936e110643726af745e64))

## [1.0.1](https://github.com/npm/stafftools/compare/v1.0.0...v1.0.1) (2022-08-23)


### Bug Fixes

* make nested commands run regardless of shape ([#18](https://github.com/npm/stafftools/issues/18)) ([89cceac](https://github.com/npm/stafftools/commit/89cceac892b027dff70263b0f37d9241b849d2df))

## 1.0.0 (2022-07-21)


### Bug Fixes

* allow stdout to be empty when getting bin dir ([#16](https://github.com/npm/stafftools/issues/16)) ([e8223aa](https://github.com/npm/stafftools/commit/e8223aaba3874c42fed7056d8d78a69cda8ed14f))
* make it work inside npx ([851544c](https://github.com/npm/stafftools/commit/851544c93cbb516919b9fdc37fada2fdb84f3d2a))
* make template-oss-fix apply to PRs with null status ([7e9f333](https://github.com/npm/stafftools/commit/7e9f333f756190c9b8c42d53824cc36d84c5b797))
* use which for cmd paths ([cc503dd](https://github.com/npm/stafftools/commit/cc503dd8c4c11c0167a8370f7d044259ca848239))


### Dependencies

* bump @supercharge/promise-pool from 2.1.0 to 2.2.0 ([#9](https://github.com/npm/stafftools/issues/9)) ([d261588](https://github.com/npm/stafftools/commit/d261588c2efa081f6c4303c081239d8565101ead))
* bump @supercharge/promise-pool from 2.2.0 to 2.3.0 ([#12](https://github.com/npm/stafftools/issues/12)) ([a2a25e6](https://github.com/npm/stafftools/commit/a2a25e6fa89a8baffcfcd37ff173454176cd9a4e))
* bump serialize-error from 10.0.0 to 11.0.0 ([#8](https://github.com/npm/stafftools/issues/8)) ([ce33166](https://github.com/npm/stafftools/commit/ce33166a4e05c8e44b45fc7ef0877722f1bb6be3))
* bump yargs from 17.4.1 to 17.5.1 ([#7](https://github.com/npm/stafftools/issues/7)) ([594ff40](https://github.com/npm/stafftools/commit/594ff4006fd3312015fda645ecef1e2128e0a617))


### Documentation

* add readme ([97f8667](https://github.com/npm/stafftools/commit/97f86676ed245caf1f5667cbfe57af3888576356))
* more readme ([5fe4568](https://github.com/npm/stafftools/commit/5fe45687ae379020c91bb8b2b7f90db54c646cc3))
