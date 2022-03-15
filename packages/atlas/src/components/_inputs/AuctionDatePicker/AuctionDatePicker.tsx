import styled from '@emotion/styled'
import { addMonths, format } from 'date-fns'
import { isValid } from 'date-fns/esm'
import React, { useMemo, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { SvgControlsCalendar } from '@/components/_icons'
import { Popover, PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { cVar } from '@/styles'

import { Select, SelectItem, SelectProps } from '../Select'

export type AuctionDatePickerValue =
  | {
      type: 'date'
      date: Date
    }
  | {
      type: 'duration'
      durationDays: number | null
    }
  | null

export type SelectValue = Date | 'pick-date' | 'default' | number | null | undefined

export type AuctionDatePickerProps = {
  minDate?: Date | null
  maxDate?: Date | null
  value: SelectValue
  onChange: (value: AuctionDatePickerValue) => void
} & Omit<SelectProps<SelectValue>, 'onChange'>

export const AuctionDatePicker: React.FC<AuctionDatePickerProps> = ({
  items,
  value,
  onChange,
  label,
  minDate = new Date(),
  maxDate,
  ...rest
}) => {
  const selectRef = useRef(null)
  const popOverRef = useRef<PopoverImperativeHandle>(null)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const pickDateItem: SelectItem<SelectValue> = React.useMemo(
    () => ({
      value: 'pick-date',
      name: 'Pick specific date',
      menuName: 'Pick specific date',
      onClick: () => popOverRef.current?.show(),
    }),
    []
  )
  const isPickDate = (!!value && !items.find((item) => item.value === value)) || value === 'pick-date'
  const mappedItems: SelectItem<SelectValue>[] = useMemo(() => {
    return isPickDate && isValid(new Date(value))
      ? [
          ...items,
          // selected date
          {
            value,
            name: format(new Date(value), 'd MMM yyyy, HH:mm'),
            hideInMenu: true,
          },
          pickDateItem,
        ]
      : [...items, pickDateItem]
  }, [isPickDate, items, pickDateItem, value])
  const [pickedValue, setPickedValue] = useState<SelectValue>(value)

  const handleSelect = (value: SelectValue) => {
    setPickedValue(value)
    if (value instanceof Date) {
      onChange({ type: 'date', date: value })
    }
    if (typeof value === 'number') {
      onChange({ type: 'duration', durationDays: value })
    }
    if (value === 'default') {
      onChange({ type: 'duration', durationDays: null })
    }
  }

  const handlePickDate = (date: Date | null) => {
    if (!date) {
      return
    }
    setPickedValue(date)
    setStartDate(date)
    onChange?.({
      type: 'date',
      date,
    })
  }

  return (
    <Container>
      <Select<SelectValue>
        size="small"
        label={label}
        labelTextProps={{ variant: 'h100', color: cVar('colorTextMuted'), secondary: true }}
        iconLeft={isPickDate ? <SvgControlsCalendar /> : undefined}
        value={pickedValue}
        items={mappedItems}
        onChange={handleSelect}
        ref={selectRef}
        {...rest}
      />
      <Popover
        offset={[0, 8]}
        ref={popOverRef}
        triggerMode="manual"
        triggerTarget={selectRef.current}
        trigger={null}
        onHide={() => {
          if (value === 'pick-date') {
            onChange(null)
          }
        }}
      >
        <DatePicker
          open
          inline
          selected={startDate}
          timeFormat="HH:mm"
          onChange={handlePickDate}
          openToDate={minDate ?? undefined}
          minDate={minDate} // TODO: value to be discussed
          maxDate={maxDate || addMonths(new Date(), 5)} // TODO: value to be discussed
          showDisabledMonthNavigation
          showTimeSelect
        />
      </Popover>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
`
