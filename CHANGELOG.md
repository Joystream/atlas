# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Welcome dialog when content focus is present
- Fallback state for video hero and video category hero

### Changed

- Styles on SignIn dialog and Studio welcome view

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
