import styled from '@emotion/styled'
import { addMonths, format } from 'date-fns'
import { isValid } from 'date-fns/esm'
import React, { useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { SvgControlsCalendar } from '@/components/_icons'
import { Popover, PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { cVar } from '@/styles'

import { Select, SelectProps } from '../Select'

export type AuctionDatePickerProps = {
  minDate?: Date | null
  value: string | null
  onChange: (value: string | null) => void
} & Omit<SelectProps, 'onChange'>

const PICK_DATE = 'pick-date'

export const AuctionDatePicker: React.FC<AuctionDatePickerProps> = ({
  items,
  value,
  onChange,
  label,
  minDate = new Date(),
  ...rest
}) => {
  const selectRef = useRef(null)
  const popOverRef = useRef<PopoverImperativeHandle>(null)
  const [startDate, setStartDate] = useState<Date | null>(null)

  const pickDateItem = React.useMemo(
    () => ({
      value: PICK_DATE,
      name: 'Pick specific date',
      menuName: 'Pick specific date',
      onClick: () => popOverRef.current?.show(),
    }),
    []
  )

  const isPickDate = (!!value && !items.find((item) => item.value === value)) || value === PICK_DATE

  const mappedItems = React.useMemo(
    () =>
      isPickDate && isValid(new Date(value))
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
        : [...items, pickDateItem],
    [isPickDate, items, pickDateItem, value]
  )

  return (
    <Container>
      <Select
        size="small"
        label={label}
        labelTextProps={{ variant: 'h100', color: cVar('colorTextMuted'), secondary: true }}
        nodeStart={isPickDate ? <SvgControlsCalendar /> : undefined}
        value={value}
        items={mappedItems}
        onChange={(value) => onChange(value ?? null)}
        ref={selectRef}
        {...rest}
      />
      <Popover offset={[0, 8]} ref={popOverRef} triggerMode="manual" triggerTarget={selectRef.current} trigger={null}>
        <DatePicker
          open
          inline
          selected={startDate}
          onChange={(date) => {
            if (date) {
              setStartDate(date)
              onChange?.(date?.toString())
            }
          }}
          openToDate={minDate ?? undefined}
          minDate={minDate} // TODO: value to be discussed
          maxDate={addMonths(new Date(), 5)} // TODO: value to be discussed
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
