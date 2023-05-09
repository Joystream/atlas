import { FC, KeyboardEvent, useEffect, useRef } from 'react'

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
  focused?: boolean
  onKeyPress?: (event: KeyboardEvent<HTMLButtonElement>) => void
}
export const OutputPill: FC<OutputPillProps> = ({
  avatarUri,
  handle,
  onDeleteClick,
  className,
  isLoadingAvatar,
  withAvatar,
  readonly,
  focused,
  onKeyPress,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (focused) {
      buttonRef.current?.focus()
    }
  }, [focused])

  return (
    <OutputPillWrapper className={className} withoutButton={!onDeleteClick || readonly}>
      {withAvatar && <StyledAvatar size={24} assetUrl={avatarUri} loading={isLoadingAvatar} />}
      <Text variant="t200" as="p">
        {handle}
      </Text>
      {!readonly && onDeleteClick && (
        <RemoveButton
          ref={buttonRef}
          size="small"
          variant="tertiary"
          icon={<StyledSVGCloseIcon />}
          onClick={onDeleteClick}
          onKeyPress={onKeyPress}
        />
      )}
    </OutputPillWrapper>
  )
}
