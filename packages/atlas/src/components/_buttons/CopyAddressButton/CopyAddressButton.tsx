import { FC, useState } from 'react'

import { Tooltip } from '@/components/Tooltip'
import { useClipboard } from '@/hooks/useClipboard'
import { shortenAddress } from '@/utils/address'

import { StyledSvgActionCheck, StyledSvgActionCopy, StyledText } from './CopyAddressButton.styles'

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
    copyToClipboard(address, 'Account address copied to clipboard')
    setCopyButtonClicked(true)
    setTimeout(() => {
      setCopyButtonClicked(false)
    }, 3000)
  }

  return (
    <StyledText
      as="button"
      variant={size === 'big' ? 't300' : 't100'}
      color="colorText"
      className={className}
      onClick={handleCopyAddress}
    >
      {shortenAddress(address, 6, 4)}
      <Tooltip text="Copy account address" placement="top">
        {copyButtonClicked ? <StyledSvgActionCheck /> : <StyledSvgActionCopy />}
      </Tooltip>
    </StyledText>
  )
}
