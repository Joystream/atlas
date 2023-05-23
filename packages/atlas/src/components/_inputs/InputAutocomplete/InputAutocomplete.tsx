import { useApolloClient } from '@apollo/client'
import { OperationVariables } from '@apollo/client/core/types'
import { TypedDocumentNode } from '@graphql-typed-document-node/core'
import debouncePromise from 'awesome-debounce-promise'
import { ReactNode, useEffect, useRef, useState } from 'react'

import { SvgActionCancel } from '@/assets/icons'
import { ComboBox, ComboBoxProps } from '@/components/_inputs/ComboBox'
import { SentryLogger } from '@/utils/logs'

type InputAutocompleteProps<Q extends object, V extends OperationVariables, R = object> = {
  notFoundLabel?: string
  value: string
  onChange: (value: string) => void
  clearSelection: () => void
  onItemSelect: (channel: R | undefined) => void
  queryVariablesFactory: (value: string) => V
  documentQuery: TypedDocumentNode<Q, V>
  renderItem: (value: Q) => ComboBoxProps<R>['items']
  nodeEnd?: ReactNode
  perfectMatcher?: (arg: Q, value: string) => R | undefined
  placeholder?: string
} & Pick<ComboBoxProps, 'onBlur' | 'disabled' | 'error' | 'className'>

export const InputAutocomplete = <Q extends object, V extends OperationVariables, R = object>({
  notFoundLabel = "We couldn't find any result. Please check if spelling is correct.",
  onItemSelect,
  queryVariablesFactory,
  documentQuery,
  renderItem,
  clearSelection,
  placeholder,
  nodeEnd,
  onChange,
  value,
  perfectMatcher,
  ...comboBoxProps
}: InputAutocompleteProps<Q, V, R>) => {
  const [result, setResult] = useState<Q | null>(null)
  const [isLoading, setLoading] = useState(false)
  const client = useApolloClient()

  const debouncedFetch = useRef(
    debouncePromise(async (val) => {
      if (!val) return setResult(null)

      try {
        setLoading(true)
        const data = await client.query<Q, V>({
          query: documentQuery,
          variables: queryVariablesFactory(val),
        })
        setResult(data.data)
        return data.data
      } catch (e) {
        SentryLogger.error('Failed to fetch autocomplete items', 'InputAutocomplete', e)
      } finally {
        setLoading(false)
      }
    }, 500)
  )

  useEffect(() => {
    if (result && perfectMatcher) {
      const matched = perfectMatcher(result, value)
      matched && onItemSelect(matched)
    } else if (perfectMatcher) {
      const tryToMatch = async () => {
        const data = await debouncedFetch.current(value)
        if (data) {
          const matched = perfectMatcher(data, value)
          matched && onItemSelect(matched)
        }
      }

      tryToMatch()
    }
  }, [onItemSelect, perfectMatcher, result, value])

  return (
    <ComboBox
      nodeStart={null}
      {...comboBoxProps}
      items={result ? renderItem(result) : []}
      placeholder={placeholder}
      notFoundNode={{
        nodeStart: <SvgActionCancel />,
        label: notFoundLabel,
      }}
      processing={isLoading}
      nodeEnd={nodeEnd}
      value={value}
      onSelectedItemChange={onItemSelect}
      onInputValueChange={(value) => {
        setLoading(true)
        clearSelection()
        onChange(value ?? '')
        debouncedFetch.current(value)
      }}
    />
  )
}
