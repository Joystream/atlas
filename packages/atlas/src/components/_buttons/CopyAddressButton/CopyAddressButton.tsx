import { FC, useState } from 'react'

import { Tooltip } from '@/components/Tooltip'
import { useClipboard } from '@/hooks/useClipboard'
import { shortenString } from '@/utils/misc'

import { Container, StyledSvgActionCheck, StyledSvgActionCopy, StyledText } from './CopyAddressButton.styles'

export type CopyAddressButtonProps = {
  address: string
  className?: string
  size?: 'small' | 'big'
  truncate?: boolean
}

export const CopyAddressButton: FC<CopyAddressButtonProps> = ({ address, className, size = 'big', truncate }) => {
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
    <Container onClick={handleCopyAddress}>
      <StyledText as="button" variant={size === 'big' ? 't300' : 't100'} color="colorText" className={className}>
        {truncate ? address : shortenString(address, 6, 4)}
      </StyledText>
      <Tooltip text="Copy account address" placement="top">
        {copyButtonClicked ? <StyledSvgActionCheck /> : <StyledSvgActionCopy />}
      </Tooltip>
    </Container>
  )
}
