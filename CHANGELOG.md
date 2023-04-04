# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.2] - 2023-04-04

### Fixed

- Fixed bug with invalid file format when creating a video
- Fixed loading times on "My videos" page
- Fixed issues with appId metadata

### Changed

- Changed the validated channels carousel behaviour on YPP landing page

## [2.0.1] - 2023-03-31

### Fixed

 - Fixed app metadata for uploaded videos
 - Fixed followed channels uploads on homepage

## [2.0.0] - 2023-03-31

### Changed
- Channel requirements for YPP are now shown before channel creation
- Atlas is now using OrionV2
  - New distributors change logic
  - Major performance improvements
  - Query node is now the part of the Orion
  - Subsquid framework is used for GraphQL schema generation
  - Variety of minor changes and improvement, full changelog is available [here](https://github.com/Lezek123/orion/blob/orion-v2/CHANGELOG.md)

### Fixed

- Fixed paginations issues for videos and NFTs
- Fixed bug with erased comment text when reaction is being processed
- Markup minor fixes

## [1.4.2] - 2023-03-24

### Changed

- Minor YPP copies changes

## [1.4.1] - 2023-03-23

### Fixed

- Fixed app metadata for account creation and video uploads

## [1.4.0] - 2023-03-22

### Added

- Introduced Apps as first-class citizens
- Introduced YouTube Partner Program

### Fixed

- Fixed loading issue when viewing the last NFTs page
- Fixed player controls size in fullscreen mode
- Various markup fixes

## [1.3.1] - 2023-03-07

### Fixed

- Fixed the distribution buckets fetch

## [1.3.0] - 2023-02-08

### Added

- Welcome dialog when content focus is present
- Fallback state for video hero and video category hero
- Platform royalty in NFT selling details
- Toast indication for insufficient funds transaction
- Toast default timeout
- Negative transferable balance tooltip
- Included Joystream standard licence

### Changed

- Styles on SignIn dialog and Studio welcome view
- Storage operator is now picked by distance

### Fixed

- Fixed issue with displaying incorrect locked funds
- Fixed link on incorrectly uploaded asset
- Fixed locked funds display on user's info popover
- Fixed polkadot wallet connection in firefox
- Various markup fixes

## [1.2.3] - 2023-01-13

### Fixed

- Fixed issue with not loading twemoji
- Fixed issue with not applying filters for NFTs
- Fixed issue with date validation in video form

## [1.2.2] - 2023-01-11

### Added

- Welcome dialog when content focus is present
- Fallback state for video hero and video category hero

### Changed

- Styles on SignIn dialog and Studio welcome view
- Added `appContentFocus` field in the `atlas.config.yml` that describes content focus of given app

### Fixed

- Fixed issue with displaying incorrect locked funds

## [1.2.1] - 2022-12-27

### Fixed

- Fix `atlas-meta-server` Dockerfile

## [1.2.0] - 2022-12-27

### Added

- Stop video autoplay if user starts commenting
- Expose Privacy Policy in config and introduce basic Markdown support

### Changed

- Greatly improved OpenGraph metadata support
- Upgraded all the dependencies, including Vite v4 and Storybook v7
- Adapted the app for Mainnet:
  - updated categories IDs
  - updated the default environment name
  - updated the token ticker

### Fixed

- Fixed mobile touch scroll on bottom drawers
- Fixed issue with rendering inputs components differently on ios
- Fixed issue with membership dropdown component's contents disappearing randomly on mobile

## [1.1.0] - 2022-11-30

### Added

- Added validation for enough funds to pay tx fee
- Atlas logo component for easy customization

### Fixed

- Greatly improved handling of failed uploads
- Fixed issue with unhandled transaction promise rejection
- Fixed issue with channel withdraw dialog validation
- Fixed transaction callbacks sometimes being called before QN had processed the data
- Fixed wrong bucket config for new channels

## [1.0.0] - 2022-11-28

### Added

- Joystream Carthage testnet support, including support for transaction fees
- Versioning support and changelog
- Captcha support for member creation
- Support for video subtitles
- A config file allowing operators to customize the app to their needs
- Support for re-branding the app easily
- Ability to upload images during member creation

### Changed

- Improved member dropdown to support changing members/channels even when in Studio/viewer
- Changed the address format used in the app from Substrate generic to Joystream specific
- Improved member balances display including locks
- Changed how the video categories are handled, introduced local display categories
