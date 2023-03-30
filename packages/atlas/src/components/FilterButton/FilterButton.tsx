import { FC, ReactNode, useRef, useState } from 'react'

import { Counter, StyledButton } from '@/components/FilterButton/FilterButton.styles'
import { CheckboxProps } from '@/components/_inputs/Checkbox'
import { CheckboxGroup } from '@/components/_inputs/CheckboxGroup'
import { DialogPopover } from '@/components/_overlays/DialogPopover'

export type FilterButtonProps = {
  options: CheckboxProps[]
  selectedOptions?: CheckboxProps[]
  onApply: (selectedIndexes: CheckboxProps[]) => void
  label?: string
  icon?: ReactNode
  className?: string
}

export const FilterButton: FC<FilterButtonProps> = ({
  label,
  icon,
  options,
  onApply,
  selectedOptions = [],
  className,
}) => {
  const [locallySelectedIndexes, setLocallySelectedIndexes] = useState<number[]>([])
  const triggerRef = useRef<HTMLButtonElement>(null)

  const handleApply = () => {
    onApply(options.filter((_, idx) => locallySelectedIndexes.includes(idx)))
    triggerRef.current?.click()
  }

  const handleSelection = (num: number) => {
    setLocallySelectedIndexes((prev) => {
      if (prev.includes(num)) {
        return prev.filter((prevNum) => prevNum !== num)
      } else {
        return [...prev, num]
      }
    })
  }

  const handleClear = () => {
    onApply([])
    triggerRef.current?.click()
  }

  return (
    <DialogPopover
      className={className}
      flipEnabled
      appendTo={document.body}
      trigger={
        <StyledButton
          ref={triggerRef}
          icon={selectedOptions?.length ? <Counter>{selectedOptions.length}</Counter> : icon}
          iconPlacement="right"
          variant="secondary"
        >
          {label}
        </StyledButton>
      }
      primaryButton={{ text: 'Apply', onClick: handleApply }}
      secondaryButton={{
        text: 'Clear',
        onClick: handleClear,
      }}
      onShow={() => {
        const selectedIndexes = selectedOptions.map((_, idx) => idx)
        setLocallySelectedIndexes(selectedIndexes)
      }}
    >
      <CheckboxGroup options={options} checkedIds={locallySelectedIndexes} onChange={handleSelection} />
    </DialogPopover>
  )
}
