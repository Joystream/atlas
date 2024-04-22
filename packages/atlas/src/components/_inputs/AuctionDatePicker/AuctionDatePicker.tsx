import styled from '@emotion/styled'
import { format, roundToNearestMinutes, setMinutes } from 'date-fns'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { SvgControlsCalendar } from '@/assets/icons'
import { Popover, PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { useMsTimestamp } from '@/hooks/useMsTimestamp'

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

// TODO shake animation on date picker is very glitchy, for now just disable it
export const AuctionDatePicker: FC<AuctionDatePickerProps> = ({
  items,
  value,
  onChange,
  minDate,
  maxDate,
  ...rest
}) => {
  const selectRef = useRef(null)
  const popOverRef = useRef<PopoverImperativeHandle>(null)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [open, setOpen] = useState(false)
  const pickDateItem: SelectItem<AuctionDatePickerValueWithPickDate> = useMemo(
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

  const fromDate = minDate || new Date(msTimestamp)

  // set the initial date and round the time to the nearest 30 minutes
  const selectedDate =
    startDate ||
    (fromDate.getMinutes() > 30 ? roundToNearestMinutes(fromDate, { nearestTo: 30 }) : setMinutes(fromDate, 30))

  return (
    <Container>
      <Select<AuctionDatePickerValueWithPickDate>
        icon={isPickDate ? <SvgControlsCalendar /> : undefined}
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
        appendTo={document.body}
        triggerTarget={selectRef.current}
        trigger={null}
        onShow={() => {
          setOpen(true)
        }}
        onHide={() => {
          setOpen(false)
          if (pickedValue?.type === 'pick-date') {
            setPickedValue(null)
            onChange(null)
          }
        }}
      >
        {open && (
          <DatePicker
            inline
            selected={selectedDate}
            timeFormat="HH:mm"
            onChange={handlePickDate}
            openToDate={minDate ?? undefined}
            minDate={fromDate}
            maxDate={maxDate}
            showDisabledMonthNavigation
            showTimeSelect
          />
        )}
      </Popover>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
`
