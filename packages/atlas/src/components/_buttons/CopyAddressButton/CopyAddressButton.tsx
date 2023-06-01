import { FC, useState } from 'react'

import { useClipboard } from '@/hooks/useClipboard'
import { shortenString } from '@/utils/misc'

import { StyledSvgActionCheck, StyledSvgActionCopy, StyledText, StyledTooltip } from './CopyAddressButton.styles'

export type CopyAddressButtonProps = {
  address: string
  className?: string
  size?: 'small' | 'big'
}

export const CopyAddressButton: FC<CopyAddressButtonProps> = ({ address, className, size = 'big' }) => {
  const { copyToClipboard } = useClipboard()
  const [copyButtonClicked, setCopyButtonClicked] = useState(false)

  const handleCopyAddress = () => {
    if (!address) {
      return
    }
    copyToClipboard(address)
    setCopyButtonClicked(true)
    setTimeout(() => {
      setCopyButtonClicked(false)
    }, 3000)
  }

  return (
    <StyledTooltip hideOnClick={false} text={copyButtonClicked ? 'Copied!' : 'Copy account address'} placement="top">
      <StyledText
        as="button"
        variant={size === 'big' ? 't300' : 't100'}
        color="colorText"
        className={className}
        onClick={handleCopyAddress}
      >
        {shortenString(address, 6, 4)}
        {copyButtonClicked ? <StyledSvgActionCheck /> : <StyledSvgActionCopy />}
      </StyledText>
    </StyledTooltip>
  )
}
