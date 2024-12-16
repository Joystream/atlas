# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.6.0] - 2024-12-16

**IMPORTANT:** Depends on Orion release `4.2.0`.

### Added

- Video tipping functionality (https://github.com/Joystream/atlas/issues/6291)

### Fixed

- Improved error handling for optimistic transactions (handle `ExtrinsicFailed` errors)

## [5.5.0] - 2024-11-07

**IMPORTANT:** Depends on Orion release `4.1.0`.

### Changed

- Removed _Hot tokens_ section from `CrtMarketplaceView`
- Updated Orion schema following `4.1.0` release
- Added minimum volume requirement for `TopCrtMovers`
- Changed default sorting of _All creator tokens_ from _Price % 30D_ to _Liquidity_

## [5.4.0] - 2024-07-19

### Added

- Token comments
- CRT Marketplace
- Categorized home view
- Language filtering

### Fixed

- Marketplace segment tracking
- Synchronize AMM restrictions with runtime state
- Notifications with dispatch block in the future

## [5.3.0] - 2024-06-04

### Added

- Optimistic video updates

### Fixed

- Portfolio table actions
- Show correct potential revenue share on portfolio
- Small UI fixes

### Changed

- Make rewards drawers initially collapsed
- Seperate marketplace into 2 pages

## [5.2.3] - 2024-05-24

### Added

- Earnings to the rewards landing page

### Fixed

- Hidden shorts from channel videos
- Rewards dashboard copy change and links update

## [5.2.2] - 2024-05-21

### Added

- Segment metrics
- New landing page

### Fixed

- Meta server fix
- CRT UI/UX fixes

## [5.2.1] - 2024-05-06

### Added

- VWO feature
- WalletConnect integration
- YPP Dashboard remake

### Fixed

- HTML tags fixed
- YPP variation page
- Small CRT fixes

## [5.2.0] - 2024-04-22

### Added

- CRT features
- ChangeNOW integration
- Powered by Joystream label

### Fixed

- Embedded player ending screen

## [5.1.0] - 2024-04-18

- New types for Luxor network release

## [5.0.0] - 2024-03-13

### Added

- New types for Nara network release

### Fixed

- Logs during upload failure

### Changed

- Rolled back to previous version of Swiper due to loop issues

## [4.15.2] - 2024-03-07

### Added

- Short video filtering
- New search UI

### Fixed

- Overall performance improvements
- Asset download improvements

### Changed

- Error message on login
- Homepage feed is now semi curated

## [4.15.1] - 2024-02-22

### Added

- Page for curators
- Video preloading for homepage and video view

### Fixed

- Failing guest auth request in certain scenarios
- Asset URL is now properly cached

### Changed

- Storage operator blacklisting logic on asset upload

## [4.15.0] - 2024-02-09

### Added

- Request response time logging

### Fixed

- Atlas and Orion email validation difference
- Lack of channel collaborator for subsequent Atlas channels of a single member that joined YPP

### Changed

- Changed feature arrival dates on pills
- Channel collaborator permissions
- Homepage language and category filtering

## [4.14.6] - 2024-01-12

### Fixed

- Fixed user geolocation on viewer side
- Fixed embedded view on mobile devices

### Changed

- Changed YPP opt out error message to include API message, for better UX.

## [4.14.5] - 2023-12-29

### Fixed

- Fixed wallet problems when injecting ethereum addresses
- Removed notification polling for anonymous users

## [4.14.4] - 2023-12-08

### Fixed

- Fixed atlas meta server query
- Fixed basic channel query performance

## [4.14.3] - 2023-12-08

### Changed

- Changed Atlas TnC

### Fixed

- Fixed mismatch for notification types [2]

## [4.14.2] - 2023-12-06

### Fixed

- Fixed mismatch for notification types
- Fixed performance issues on studio page

## [4.14.1] - 2023-11-27

### Fixed

- Fixed asset encoding check error

## [4.14.0] - 2023-11-27

### Added

- Introduced client notifications in Atlas

### Fixed

- Optimised the queries performance
- Fixed the missing event for funds withdrawal

## [4.13.4] - 2023-11-21

### Fixed

- Fixed incorrect width of warning banner

## [4.13.3] - 2023-11-21

### Changed

- split logs for asset uploads

### Fixed

- Restored featured filter for marketplace carousel
- Fixed issue with funds withdrawals
- Fixed tables markup for mobile devices
- Fixed embedded videos previews
- Optimised performance of the homepage query

## [4.13.2] - 2023-11-14

### Changed

- YPP payout date is moved to Tuesday
- Account seed is now downloaded by default
- Changed referrals list on referrals page

### Fixed

- Fixed performance issues on mobile devices
- Fixed player styling on mobile devices
- Fixed incorrect rewards on YPP dashboard tab

## [4.13.1] - 2023-11-09

### Fixed

- Minor markup fixes on referrals page
- Fixed issue with YPP landing page carousel
- Fixed user logs

## [4.13.0] - 2023-11-08

### Added

- new Referrals page

### Changed

- YPP channel carousel is now showing most paid channels
- Removed YPP signup quota check

### Fixed

- Fixed password suggestion being shown in the wrong places
- Fixed issue with channel asset upload
- Fixed NFT button being available for unauthorized users
- Fixed incorrect block number in payments table
- Fixed avatars on NFT carousel

## [4.12.0] - 2023-11-01

### Changed

- YPP requirements are now fetched from yt-synch
- Changed rewards for higher tiers
- Moved YPP daily quota to config

## [4.11.0] - 2023-10-20

### Added

- Added banner for second channel opt-in
- Added signup tutorial video on YPP landing page
- Added permanent referral link btn on YPP referrals tab

### Changed

- Password fields autocomplete was removed
- Adjusted YPP referral link
- Changed sort algorithm for YPP channels carousel

### Fixed

- Fixed redirect to YPP dashboard after sign in
- Fixed asset provider incorrect behaviour
- Fixed issue with GAuth code persistence

## [4.10.2] - 2023-10-12

### Fixed

- Fixed issues with channel funds withdrawal

## [4.10.1] - 2023-10-11

### Changed

- Removed YPP channel requirements

### Fixed

- Fixed issue with failing funds withdrawal
- Fixed crashes on ypp dashboard and referrals page
- Fixed channel assets modification
- Fixed referral link generation

## [4.10.0] - 2023-10-06

### Added

- Introduced new categories
- YPP was updated to v2.0: updated landing page, new tiers system; rewards, referrals and dashboard changes

### Changed

- Changed channel tokens withdrawal from membership account to any Joystream account

### Fixed

- Fixed bug with slow loading of a homepage
- Fixed bug with bid withdrawal from an auction
- Minor markup fixes

## [4.9.2] - 2023-09-22

### Changed

- Captcha was moved to the last signup step

### Fixed

- Fixed bug with checking the encoding for non-video assets
- Fixed bug with missing upload button for mobile devices
- Fixed bug with infinite modal on signup

## [4.9.1] - 2023-09-14

### Changed

- Removed YPP email pre-population
- Minor text changes in signup modal

### Fixed

- Fixed bug with missing anonymousId on signup

## [4.9.0] - 2023-09-08

### Added

- Added new tiers to YPP referrals table

### Changed

- Increased heap size for Atlas docker build
- Changed YPP email pre-population (from previous change)
- Removed auth protection from report feature

## [4.8.1] - 2023-09-06

## Changed

- Improved homepage graphQL queries speed
- Changed YPP email pre-population

## Fixed

- Fixed bug with uploading a video
- Fixed displaying rewards in YPP cards

## [4.8.0] - 2023-09-01

### Added

- New Tiers for YPP

### Changed

- Removed app focus messages
- Membership and Orion account are now created simultaneously
- Increased interval of asset testing

### Fixed

- Fixed handling of Apollo errors

## [4.7.0] - 2023-08-24

### Added

- Added minting NFT to video context menu
- Added auth cookie for `atlas-meta-server` requests

### Changed

- Limited rendered channels amount for channel carousel
- Sensitive fields are obfuscated for analytics
- Changed error handling for sentry

### Fixed

- Fixed errors in signup flow
- Minor bugfixes

## [4.6.1] - 2023-08-21

### Changed

- Changed retries amount for asset upload
- Changed copy for Google button

### Fixed

- Fixed double segment call for YPP dashboard
- Fixed more error with crashes when Google Translate is used

## [4.6.0] - 2023-08-17

### Added

- Added New Segment events

### Changed

- Simplified YPP landing page
- Changed YPP reward multipliers

### Fixed

- Fixed error with crashes when Google Translate is used
- Fixed wrong channel balance
- Minor bugfixes and improvements

## [4.5.1] - 2023-08-14

### Changed

- Changed Creator tokens info
- Changed YPP video upload rewards
- Minor YPP dashboard changes

### Fixed

- Various bugfixes

## [4.5.0] - 2023-08-10

### Added

- Added livesession integration for segment

### Fixed

- Fixed bug with infinite loop in studio
- Fixed error with WASM

## [4.4.2] - 2023-08-09

### Fixed

- Fixed sentry ignoring some errors

## [4.4.1] - 2023-08-09

### Fixed

- Fixed sentry sourcemaps and removed useless events

## [4.4.0] - 2023-08-08

### Added

- Added upload retry after distributor blacklisting

### Changed

- Adjusted chunks and lazy loading to reduce bundle size

#### Fixed

- Fixed extended delays for YPP sign up

## [4.3.1] - 2023-08-02

### Fixed

- Fixed build for NodeJS v18

## [4.3.0] - 2023-08-02

### Added

- Added sentry stacktrace

### Changed

- Bumped NodeJS version to 18 for Github actions and project package.json
- Changed YPP to sync only verified channels
- Email is now prepopulated for YPP sign up
- YPP carousel now shows recently paid channels

### Fixed

- Fixed referrer autocomplete
- Fixed errors with wrong user system time
- Fixed bugs in segment analytics events

## [4.2.0] - 2023-07-28

### Added

- Added autofilling of the referrer field on YPP sign up

### Fixed

- Fixed QN subscriptions connection
- Fixed issues with sign up flow

## [4.1.0] - 2023-07-26

### Added

- Added snackbar for time mismatch
- Added YPP referrals table

### Fixed

- Fixed bugs with YPP and regular sign up flows
- Markup fixes

## [4.0.3] - 2023-07-24

### Fixed

- Fixed missing "wrong credentials" toast on sign in
- Fixed YPP signup flow

## [4.0.2] - 2023-07-21

### Fixed

- Fixed YPP authorization flow
- Fixed sign in button loading state

## [4.0.1] - 2023-07-20

### Fixed

- Fixed bug with missing captcha token
- Fixed 404 errors when Segment key is not provided

## [4.0.0] - 2023-07-20

### Added

- Atlas now supports custodial user accounts
- Added Segment analytics
- Button for admin panel

### Changed

- Distributor connection timeout is now adjusted automatically

### Fixed

- Fixed wrong assets being displayed for NFT tiles
- Fixed NFTs section re-render on filters change
- Fixed Twitter card preview

## [3.4.0] - 2023-07-03

### Added

- Added collapsed view to NFT widget
- Added fiat representation to prices
- Added environment variables description to operators guide

### Changed

- Changed assets resolution algorithm
- Required NodeJS version bumped to 18

### Fixed

- Fixed bug with wallet connection
- Fixed bug with minimized player showing error screen
- Minor markup fixes

## [3.4.0] - 2023-07-03

### Added

- Added collapsed view to NFT widget
- Added fiat representation to prices
- Added environment variables description to operators guide

### Changed

- Changed assets resolution algorithm
- Required NodeJS version bumped to 18

### Fixed

- Fixed bug with wallet connection
- Fixed bug with minimized player showing error screen
- Minor markup fixes

## [3.3.6] - 2023-06-23

### Changed

- Changed YPP rewards
- Improved request size on video page
- Analytics plugins removed from bundle if not initialised

### Fixed

- Fixed storage bucket blacklisting

## [3.3.5] - 2023-06-09

### Added

- Added FORCED_MAINTENANCE env variable
- Added Ukrainian language
- Added Segment, Google Analytics, Google Optimize tracking tools

### Changed

- Changed Terms and Conditions, Privacy Policy
- Changed content category message copy

### Fixed

- Fixed QN sync issue

## [3.3.4] - 2023-06-07

### Fixed

- Fixed YPP modal crash on TnC step

## [3.3.3] - 2023-06-06

### Fixed

- Fixed missing notifications

## [3.3.2] - 2023-06-02

### Added

- Added Telugu language

### Changed

- Sentry replays are enabled on YPP page only
- Atlas TnC were updated

### Fixed

- Fixed issue when Atlas was sending incorrect storage buckets number
- Fixed bug with multiple context menus for carousel NFT items
- Fixed recurring updates on user activity page

## [3.3.1] - 2023-05-25

### Changed

- Changed featured NFTs allowance criteria

### Fixed

- Fixed wrong environment selection
- Fixed share modal incorrect behaviour

## [3.3.0] - 2023-05-23

### Added

- New NFT marketplace page
- New homepage with videos feed

### Changed

- Improved notifications fetch query

### Fixed

- Fixed incorrect comments display
- Fixed tiles status in studio
- Fixed bug with modal windows blocking the scroll
- Minor bugfixes

## [3.2.0] - 2023-04-21

### Changed

- NFT section rework
- YPP sign-up buttons changed according to Google guidelines
- Channels section removed from navigation
- New & noteworthy pages were removed
- Metadata update for supported wallets only

### Fixed

- Fixed bug with channel payouts
- Fixed parsing of asset URL
- Fixed YPP opt-in for memberships with multiple channels

## [3.1.0] - 2023-04-14

### Added

- New content focus modal
- Channel's balance is now displayed publicly

### Changed

- YPP TnCs were updated

### Fixed

- Fixed carousel styling for mobile screens
- Various markup fixes

## [3.0.0] - 2023-04-12

### Added

- Channel payouts were introduced

### Changed

- Atlas now supports Ephesus runtime upgrade

## [2.1.0] - 2023-04-07

### Changed

- Bumped Sentry version to include replays functionality

## [2.0.4] - 2023-04-06

### Fixed

- Fixed video upload extrinsic bug
- Fixed channel creation bug

## [2.0.3] - 2023-04-05

### Fixed

- Fixed bug with channel view
- Fixed YPP extra requests

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
