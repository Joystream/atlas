import styled from '@emotion/styled'
import { addMonths, format } from 'date-fns'
import { isEqual } from 'lodash-es'
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

export type PickDateValue = {
  type: 'pick-date'
}

type AuctionDatePickerValueWithPickDate = AuctionDatePickerValue | PickDateValue

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
  minDate = new Date(),
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
  const [pickedValue, setPickedValue] = useState<AuctionDatePickerValueWithPickDate>(value)

  const isPickDate =
    (!!pickedValue && !items.find((item) => isEqual(pickedValue, item.value))) || pickedValue?.type === 'pick-date'

  const mappedItems: SelectItem<AuctionDatePickerValueWithPickDate>[] = useMemo(() => {
    return isPickDate && pickedValue.type === 'date'
      ? [
          ...items,
          {
            value,
            name: format(new Date(pickedValue?.date || 0), 'd MMM yyyy, HH:mm'),
            hideInMenu: true,
            pickDateItem,
          },
          pickDateItem,
        ]
      : [...items, pickDateItem]
  }, [isPickDate, items, pickDateItem, pickedValue, value])

  const handleSelect = (value?: AuctionDatePickerValueWithPickDate) => {
    if (!value) {
      return
    }
    if (value?.type !== 'pick-date') {
      onChange(value)
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
          if (pickedValue?.type === 'pick-date') {
            setPickedValue({ durationDays: null, type: 'duration' })
            onChange({ durationDays: null, type: 'duration' })
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
