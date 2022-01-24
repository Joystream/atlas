import styled from '@emotion/styled'
import { addMonths, format } from 'date-fns'
import React, { useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { SvgControlsCalendar } from '@/components/_icons'
import { Popover, PopoverImperativeHandle } from '@/components/_overlays/Popover'

import { Select, SelectProps } from '../Select'

export type AuctionDatePickerProps = SelectProps<string>

const PICK_DATE = 'pick-date'

export const AuctionDatePicker: React.FC<AuctionDatePickerProps> = ({ items, onChange, ...rest }) => {
  const selectRef = useRef(null)
  const popOverRef = useRef<PopoverImperativeHandle>(null)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [selectedValue, setSelectedValue] = useState<string | null>()

  return (
    <Container>
      <Select<string>
        size="small"
        nodeStart={selectedValue === PICK_DATE ? <SvgControlsCalendar /> : undefined}
        value={selectedValue}
        items={[
          ...items,
          {
            value: PICK_DATE,
            name: (startDate && format(startDate, 'd MMM yyyy, HH:mm')) ?? 'Pick specific date',
            menuName: 'Pick specific date',
            onClick: () => popOverRef.current?.show(),
          },
        ]}
        onChange={(value) => {
          onChange?.(value)
          setSelectedValue(value)
        }}
        ref={selectRef}
        {...rest}
      />
      <Popover offset={[0, 8]} ref={popOverRef} triggerMode="manual" triggerTarget={selectRef.current} trigger={null}>
        <DatePicker
          open
          inline
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          minDate={new Date()} // TODO: value to be discussed
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
