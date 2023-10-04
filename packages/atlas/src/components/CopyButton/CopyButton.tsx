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
} & Omit<ButtonProps, 'onClick' | 'to'>
export const CopyButton = ({ textToCopy, copySuccessText = 'Copied', ...buttonProps }: CopyButtonProps) => {
  const { copyToClipboard } = useClipboard()
  const popoverRef = useRef<PopoverImperativeHandle>(null)
  const [copyButtonClicked, setCopyButtonClicked] = useState(false)
  const handleCopy = () => {
    if (!textToCopy || copyButtonClicked) {
      return
    }
    copyToClipboard(textToCopy)
    setCopyButtonClicked(true)
    popoverRef.current?.show()
    setTimeout(() => {
      setCopyButtonClicked(false)
      popoverRef.current?.hide()
    }, 3_000)
  }

  return (
    <div>
      <Popover placement="top" ref={popoverRef} trigger={<div />}>
        <PopoverContent>
          <Text variant="t100" as="p">
            {copySuccessText}
          </Text>
        </PopoverContent>
      </Popover>

      <Button {...buttonProps} onClick={handleCopy} />
    </div>
  )
}

const PopoverContent = styled.div`
  background-color: ${cVar('colorBackgroundElevated')};
  border-radius: ${cVar('radiusSmall')};
  padding: ${sizes(2)};
`
