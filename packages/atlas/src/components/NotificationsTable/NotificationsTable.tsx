import { FC, Fragment, useEffect, useState } from 'react'
import { Controller, UseFormReturn, useWatch } from 'react-hook-form'

import { SvgActionComputer, SvgActionRead } from '@/assets/icons'
import { Checkbox } from '@/components/_inputs/Checkbox'

import { Table } from './NotificationsTable.styles'

type NotificationsTableComponentProps = {
  sections: { name: string; label?: string; rows: { name: string; label: string }[] }[]
  form: UseFormReturn<Record<'inApp' | 'email', Record<string, boolean>>>
}
export const NotificationsTable: FC<NotificationsTableComponentProps> = ({ sections, form }) => (
  <Table>
    <thead>
      <tr>
        <th />
        <th>
          <SvgActionComputer />
          <span>In App</span>
        </th>
        <th>
          <SvgActionRead />
          <span>Email</span>
        </th>
      </tr>
    </thead>

    <tbody>
      <SubscribeToAllRow form={form} />

      {sections.map(({ name, label = name, rows }) => (
        <Fragment key={name}>
          {label && (
            <tr>
              <th colSpan={3}>{label}</th>
            </tr>
          )}

          {rows.map(({ name, label }) => (
            <tr key={name}>
              <td>{label}</td>
              <td>
                <Controller
                  name={`inApp.${name}`}
                  control={form.control}
                  render={({ field: { value = false, onChange } }) => <Checkbox value={value} onChange={onChange} />}
                />
              </td>
              <td>
                <Controller
                  name={`email.${name}`}
                  control={form.control}
                  render={({ field: { value = false, onChange } }) => <Checkbox value={value} onChange={onChange} />}
                />
              </td>
            </tr>
          ))}
        </Fragment>
      ))}
    </tbody>
  </Table>
)

const SubscribeToAllRow: FC<Pick<NotificationsTableComponentProps, 'form'>> = ({ form }) => {
  const [allInApp, setAllInApp] = useState<boolean | undefined>()
  const [allEmail, setAllEmail] = useState<boolean | undefined>()

  const values = useWatch({ control: form.control })
  const { getValues, setValue } = form

  useEffect(() => {
    if (typeof allInApp === 'undefined' && typeof allEmail === 'undefined') return

    const values = getValues()
    if (typeof allInApp !== 'undefined') {
      Object.entries(values.inApp).forEach(([key, value]) => {
        if (value !== allInApp) setValue(`inApp.${key}`, allInApp, { shouldDirty: true })
      })
    }
    if (typeof allEmail !== 'undefined') {
      Object.entries(values.email).forEach(([key, value]) => {
        if (value !== allEmail) setValue(`email.${key}`, allEmail, { shouldDirty: true })
      })
    }
  }, [allInApp, allEmail, getValues, setValue])

  useEffect(() => {
    setAllInApp(values.inApp && Object.values(values.inApp).reduce((a, b) => (a === b ? a : undefined)))
    setAllEmail(values.email && Object.values(values.email).reduce((a, b) => (a === b ? a : undefined)))
  }, [values])

  return (
    <tr>
      <td>Subscribe to all notifications</td>

      <td>
        <Checkbox value={allInApp ?? true} indeterminate={typeof allInApp === 'undefined'} onChange={setAllInApp} />
      </td>

      <td>
        <Checkbox value={allEmail ?? true} indeterminate={typeof allEmail === 'undefined'} onChange={setAllEmail} />
      </td>
    </tr>
  )
}
