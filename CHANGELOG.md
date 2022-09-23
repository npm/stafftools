# Changelog

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
