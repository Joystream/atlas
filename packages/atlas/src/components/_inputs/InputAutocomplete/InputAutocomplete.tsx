import { useApolloClient } from '@apollo/client'
import { OperationVariables } from '@apollo/client/core/types'
import { TypedDocumentNode } from '@graphql-typed-document-node/core'
import debouncePromise from 'awesome-debounce-promise'
import { ReactNode, useEffect, useRef, useState } from 'react'

import { SvgActionCancel } from '@/assets/icons'
import { ComboBox, ComboBoxProps } from '@/components/_inputs/ComboBox'
import { SentryLogger } from '@/utils/logs'

const notFoundNode = {
  label: `We couldn't find any result. Please check if spelling is correct.`,
  nodeStart: <SvgActionCancel />,
}

type InputAutocompleteProps<Q extends object, V extends OperationVariables, R = object> = {
  selectedItem: string
  onItemSelect: (channel: R | undefined) => void
  clearSelection: () => void
  queryVariablesFactory: (value: string) => V
  documentQuery: TypedDocumentNode<Q, V>
  renderItem: (value: Q) => ComboBoxProps<R>['items']
  nodeEnd?: ReactNode
  perfectMatcher?: (arg: Q, value: string) => R | undefined
  placeholder?: string
} & Pick<ComboBoxProps, 'onBlur' | 'disabled' | 'error' | 'className'>

export const InputAutocomplete = <Q extends object, V extends OperationVariables, R = object>({
  onItemSelect,
  queryVariablesFactory,
  documentQuery,
  renderItem,
  placeholder,
  nodeEnd,
  clearSelection,
  selectedItem,
  perfectMatcher,
  ...comboBoxProps
}: InputAutocompleteProps<Q, V, R>) => {
  const [result, setResult] = useState<Q | null>(null)
  const [inputValue, setInputValue] = useState<string>('')
  const [isLoading, setLoading] = useState(false)
  const client = useApolloClient()

  const debouncedFetchChannels = useRef(
    debouncePromise(async (val) => {
      if (!val) return setResult(null)

      try {
        setLoading(true)
        const data = await client.query<Q, V>({
          query: documentQuery,
          variables: queryVariablesFactory(val),
        })
        setResult(data.data)
      } catch (e) {
        SentryLogger.error('Failed to fetch channels', 'InputAutocomplete', e)
      } finally {
        setLoading(false)
      }
    }, 500)
  )

  useEffect(() => {
    if (result && perfectMatcher) {
      const matched = perfectMatcher(result, inputValue)
      matched && onItemSelect(matched)
    }
  }, [onItemSelect, perfectMatcher, result, inputValue])

  return (
    <ComboBox
      nodeStart={null}
      {...comboBoxProps}
      items={result ? renderItem(result) : []}
      placeholder={placeholder}
      notFoundNode={notFoundNode}
      processing={isLoading}
      nodeEnd={nodeEnd}
      onSelectedItemChange={onItemSelect}
      onInputValueChange={(value) => {
        setLoading(true)
        setInputValue(value ?? '')
        selectedItem && clearSelection()
        debouncedFetchChannels.current(value)
      }}
    />
  )
}
