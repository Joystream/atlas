export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

// @ts-ignore not worth typing
export const isFirefox = (): boolean => typeof InstallTrigger !== 'undefined'
// @ts-ignore not worth typing
export const isChromiumBased = (): boolean => !!window.chrome

export const isAllowedBrowser = () => isFirefox() || isChromiumBased()
