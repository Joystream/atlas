import React, { useRef } from 'react'

import { Text } from '@/components/Text'
import { TooltipProps } from '@/components/Tooltip'
import { cVar } from '@/styles'

import {
  ChildrenWrapper,
  FormFieldDescription,
  FormFieldFooter,
  FormFieldHeader,
  FormFieldWrapper,
  OptionalText,
  StyledInformation,
  StyledSvgActionWarning,
  SwitchLabel,
  SwitchTitle,
} from './FormField.styles'

import { Switch, SwitchProps } from '../Switch'

type WithSwitchProps =
  | {
      switchable: true
      switchProps: Omit<SwitchProps, 'label'>
    }
  | {
      switchable?: false
      switchProps?: never
    }

export type FormFieldProps = {
  label?: string
  optional?: boolean
  error?: string
  disableErrorAnimation?: boolean
  description?: string | string[]
  dense?: boolean
  className?: string
  tooltip?: TooltipProps
} & WithSwitchProps

export const FormField = React.memo(
  React.forwardRef<HTMLDivElement, React.PropsWithChildren<FormFieldProps>>(
    (
      {
        children,
        label,
        description,
        className,
        optional,
        dense,
        switchProps,
        tooltip,
        error,
        disableErrorAnimation,
        switchable,
      },
      ref
    ) => {
      const childrenWrapperRef = useRef<HTMLDivElement>(null)

      const handleFocusOnClick = () => {
        // This handler imitates the behavior of the native <label> without need of passing custom htmlFor attribute.
        const input = childrenWrapperRef.current?.getElementsByTagName('input')[0]
        if (input?.type === 'radio' || input?.type === 'checkbox') {
          input.click()
        } else {
          input?.focus()
        }
        const button = childrenWrapperRef.current?.getElementsByTagName('button')[0]
        // If Formfield is wrapping custom Select and you click on the label it will click select toggle button and open select menu
        if (button && button.getAttribute('data-select')) {
          button.click()
        }
      }

      const isInputOpen = switchable ? switchProps?.value : true
      return (
        <FormFieldWrapper className={className} dense={dense} ref={ref}>
          <FormFieldHeader>
            {switchable ? (
              <SwitchLabel>
                <Switch {...switchProps} />
                <SwitchTitle as="span" variant="h300">
                  {label}
                </SwitchTitle>
              </SwitchLabel>
            ) : (
              <label onClick={handleFocusOnClick}>
                <Text variant="h300">{label}</Text>
              </label>
            )}
            {optional && (
              <OptionalText variant="t200" secondary>
                (optional)
              </OptionalText>
            )}
            {tooltip && <StyledInformation {...tooltip} />}
          </FormFieldHeader>
          {description &&
            (description instanceof Array ? (
              description.map((p, idx) => (
                <FormFieldDescription secondary key={idx} variant="t200">
                  {p}
                </FormFieldDescription>
              ))
            ) : (
              <FormFieldDescription secondary variant="t200">
                {description}
              </FormFieldDescription>
            ))}
          {isInputOpen && (
            <ChildrenWrapper
              ref={childrenWrapperRef}
              disableErrorAnimation={disableErrorAnimation}
              noMargin={!label && !description}
              isError={!!error}
            >
              {children}
            </ChildrenWrapper>
          )}
          {error ? (
            <FormFieldFooter>
              <StyledSvgActionWarning />
              <Text variant="t100" color={cVar('colorTextError')}>
                {error}
              </Text>
            </FormFieldFooter>
          ) : null}
        </FormFieldWrapper>
      )
    }
  )
)

FormField.displayName = 'FormField'
