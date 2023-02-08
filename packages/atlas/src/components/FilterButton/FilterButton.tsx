import { FC, ReactNode, useRef, useState } from 'react'

import { Counter } from '@/components/FilterButton/FilterButton.styles'
import { Button } from '@/components/_buttons/Button'
import { CheckboxProps } from '@/components/_inputs/Checkbox'
import { CheckboxGroup } from '@/components/_inputs/CheckboxGroup'
import { DialogPopover } from '@/components/_overlays/DialogPopover'

export type FilterButtonProps = {
  options: CheckboxProps[]
  selected?: number[]
  onApply: (ids: number[]) => void
  label?: string
  icon?: ReactNode
}

export const FilterButton: FC<FilterButtonProps> = ({ label, icon, options, onApply, selected = [] }) => {
  const [localSelection, setLocalSelection] = useState<number[]>([])
  const triggerRef = useRef<HTMLButtonElement>(null)

  const handleApply = () => {
    onApply(localSelection)
    triggerRef.current?.click()
  }

  const handleSelection = (num: number) => {
    setLocalSelection((prev) => {
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
      trigger={
        <Button
          ref={triggerRef}
          icon={selected?.length ? <Counter>{selected.length}</Counter> : icon}
          iconPlacement="right"
          variant="secondary"
        >
          {label}
        </Button>
      }
      primaryButton={{ text: 'Apply', onClick: handleApply }}
      secondaryButton={{
        text: 'Clear',
        onClick: handleClear,
      }}
      onShow={() => setLocalSelection(selected)}
    >
      <CheckboxGroup options={options} checkedIds={localSelection} onChange={handleSelection} />
    </DialogPopover>
  )
}
