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

export type SelectedDuration = {
  type: 'duration'
  pickedValue: number // number of days
}

export type SelectedDate = {
  type: 'date'
  pickedValue: Date
}

export type SelectedPickedDate = {
  type: 'pick-date'
  pickedValue: 'pick-date'
}

export type SelectedAuctionOption = SelectedDuration | SelectedDate | SelectedPickedDate | null

export type AuctionDatePickerProps = {
  minDate?: Date | null
  maxDate?: Date | null
  value: SelectedAuctionOption | null
  onChange: (value: SelectedAuctionOption) => void
} & Omit<SelectProps<SelectedAuctionOption>, 'onChange'>

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

  const pickDateItem: SelectItem<SelectedAuctionOption> = React.useMemo(
    () => ({
      value: {
        type: 'pick-date',
        pickedValue: 'pick-date',
      },
      name: 'Pick specific date',
      menuName: 'Pick specific date',
      onClick: () => popOverRef.current?.show(),
    }),
    []
  )

  const isPickDate =
    (!!value?.pickedValue && !items.find((item) => item.value?.pickedValue === value.pickedValue)) ||
    value?.pickedValue === 'pick-date'

  const mappedItems: SelectItem<SelectedAuctionOption>[] = useMemo(() => {
    return isPickDate && isValid(new Date(value.pickedValue))
      ? [
          ...items,
          // selected date
          {
            value,
            name: format(new Date(value.pickedValue), 'd MMM yyyy, HH:mm'),
            hideInMenu: true,
          },
          pickDateItem,
        ]
      : [...items, pickDateItem]
  }, [isPickDate, items, pickDateItem, value])

  return (
    <Container>
      <Select<SelectedAuctionOption>
        size="small"
        label={label}
        labelTextProps={{ variant: 'h100', color: cVar('colorTextMuted'), secondary: true }}
        iconLeft={isPickDate ? <SvgControlsCalendar /> : undefined}
        value={value}
        items={mappedItems}
        onChange={(value) => {
          if (value) {
            onChange(value ?? null)
          }
        }}
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
          if (value?.pickedValue === 'pick-date') {
            onChange(null)
          }
        }}
      >
        <DatePicker
          open
          inline
          selected={startDate}
          timeFormat="HH:mm"
          onChange={(date) => {
            if (date) {
              setStartDate(date)
              onChange?.({
                type: 'date',
                pickedValue: date,
              })
            }
          }}
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
