import styled from '@emotion/styled'
import { format } from 'date-fns'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { SvgControlsCalendar } from '@/components/_icons'
import { Popover, PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { useMsTimestamp } from '@/hooks/useMsTimestamp'
import { cVar } from '@/styles'

import { Select, SelectItem, SelectProps } from '../Select'

export type AuctionDatePickerValue =
  | {
      type: 'date'
      date: Date
    }
  | {
      type: 'duration'
      durationDays: number
    }
  | null

export type PickDateValue = {
  type: 'pick-date'
}

export type DefaultValue = {
  type: 'default'
}

type AuctionDatePickerValueWithPickDate = AuctionDatePickerValue | PickDateValue | DefaultValue

export type AuctionDatePickerProps = {
  minDate?: Date | null
  maxDate?: Date | null
  value: AuctionDatePickerValue
  onChange: (value: AuctionDatePickerValue) => void
} & Omit<SelectProps<AuctionDatePickerValue>, 'onChange'>

export const AuctionDatePicker: React.FC<AuctionDatePickerProps> = ({
  items,
  value,
  onChange,
  label,
  minDate,
  maxDate,
  ...rest
}) => {
  const selectRef = useRef(null)
  const popOverRef = useRef<PopoverImperativeHandle>(null)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const pickDateItem: SelectItem<AuctionDatePickerValueWithPickDate> = React.useMemo(
    () => ({
      value: { type: 'pick-date' },
      name: 'Pick specific date',
      menuName: 'Pick specific date',
      onClick: () => popOverRef.current?.show(),
    }),
    []
  )

  const msTimestamp = useMsTimestamp()

  const convertedItems = items.map((item) => {
    if (item.value === null) {
      return { value: { type: 'default' as const }, name: item.name }
    }
    return item
  })

  const [pickedValue, setPickedValue] = useState<AuctionDatePickerValueWithPickDate>(value)

  useEffect(() => {
    if (value === null) {
      setPickedValue({ type: 'default' })
    }
  }, [value])

  const isPickDate = pickedValue?.type === 'pick-date' || pickedValue?.type === 'date'

  const mappedItems: SelectItem<AuctionDatePickerValueWithPickDate>[] = useMemo(() => {
    return isPickDate && pickedValue.type === 'date'
      ? [
          ...convertedItems,
          {
            value,
            name: format(new Date(pickedValue.date), 'd MMM yyyy, HH:mm'),
            hideInMenu: true,
            pickDateItem,
          },
          pickDateItem,
        ]
      : [...convertedItems, pickDateItem]
  }, [isPickDate, convertedItems, pickDateItem, pickedValue, value])

  const handleSelect = (value?: AuctionDatePickerValueWithPickDate) => {
    if (!value) {
      return
    }
    if (value.type !== 'default' && value.type !== 'pick-date') {
      onChange(value)
    } else {
      onChange(null)
    }
    setPickedValue(value)
  }

  const handlePickDate = (date: Date | null) => {
    if (!date) {
      return
    }
    setPickedValue({ type: 'date', date })
    onChange({ type: 'date', date })
    setStartDate(date)
  }

  return (
    <Container>
      <Select<AuctionDatePickerValueWithPickDate>
        size="small"
        label={label}
        labelTextProps={{ variant: 'h100', color: cVar('colorTextMuted'), secondary: true }}
        iconLeft={isPickDate ? <SvgControlsCalendar /> : undefined}
        value={pickedValue || { type: 'default' }}
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
          if (pickedValue?.type === 'pick-date') {
            setPickedValue(null)
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
          minDate={minDate || new Date(msTimestamp)}
          maxDate={maxDate}
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
