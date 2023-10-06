import styled from '@emotion/styled'
import { useRef, useState } from 'react'

import { Text } from '@/components/Text'
import { Button, ButtonProps } from '@/components/_buttons/Button'
import { Popover, PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { useClipboard } from '@/hooks/useClipboard'
import { cVar, sizes } from '@/styles'

export type CopyButtonProps = {
  textToCopy: string
  copySuccessText?: string
  className?: string
  onClick?: () => void
} & Omit<ButtonProps, 'to' | 'onClick'>
export const CopyButton = ({
  textToCopy,
  copySuccessText = 'Copied',
  className,
  onClick,
  ...buttonProps
}: CopyButtonProps) => {
  const { copyToClipboard } = useClipboard()
  const popoverRef = useRef<PopoverImperativeHandle>(null)
  const [copyButtonClicked, setCopyButtonClicked] = useState(false)
  const handleCopy = () => {
    if (!textToCopy || copyButtonClicked) {
      return
    }
    copyToClipboard(textToCopy)
    setCopyButtonClicked(true)
    onClick?.()
    popoverRef.current?.show()
    setTimeout(() => {
      setCopyButtonClicked(false)
      popoverRef.current?.hide()
    }, 3_000)
  }

  return (
    <span className={className}>
      <Popover placement="top" ref={popoverRef} trigger={<div />}>
        <PopoverContent>
          <Text variant="t100" as="p">
            {copySuccessText}
          </Text>
        </PopoverContent>
      </Popover>

      <Button {...buttonProps} onClick={handleCopy} />
    </span>
  )
}

const PopoverContent = styled.div`
  background-color: ${cVar('colorBackgroundElevated')};
  border-radius: ${cVar('radiusSmall')};
  padding: ${sizes(2)};
`
