import React from 'react'

import { Text } from '@/components/Text'

import { OutputPillWrapper, RemoveButton, StyledAvatar, StyledSVGCloseIcon } from './OutputPill.styles'

export type OutputPillProps = {
  avatarUri?: string | null
  handle?: string | null
  onDeleteClick?: () => void
  className?: string
  isLoadingAvatar?: boolean
  withAvatar?: boolean
  readonly?: boolean
}
export const OutputPill: React.FC<OutputPillProps> = ({
  avatarUri,
  handle,
  onDeleteClick,
  className,
  isLoadingAvatar,
  withAvatar,
  readonly,
}) => {
  return (
    <OutputPillWrapper className={className} withoutButton={!onDeleteClick}>
      {withAvatar && <StyledAvatar size="bid" assetUrl={avatarUri} loading={isLoadingAvatar} />}
      <Text variant="t200" as="p">
        {handle}
      </Text>
      {!readonly && onDeleteClick && (
        <RemoveButton size="small" variant="tertiary" icon={<StyledSVGCloseIcon />} onClick={onDeleteClick} />
      )}
    </OutputPillWrapper>
  )
}
