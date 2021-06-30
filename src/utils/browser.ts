export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

// @ts-ignore not worth typing
export const isFirefox = (): boolean => typeof InstallTrigger !== 'undefined'
// @ts-ignore not worth typing
export const isChromiumBased = (): boolean => !!window.chrome

// Seen in https://stackoverflow.com/a/9851769
// it will check for the global chrome object for chromium based browsers and
// it will check Firefox's API to install add-ons which as of now all firefox versions have
// to detect if the users browser it's one where the polkadot extension can be installed on
export const isAllowedBrowser = () => isFirefox() || isChromiumBased()

export const isBrowserOutdated = !('ResizeObserver' in window) || !('IntersectionObserver' in window)

export const openInNewTab = (url: string, local?: boolean) => {
  const origin = window.location.origin
  window.open(`${local ? origin : ''}${url}`, '_blank')?.focus()
}
