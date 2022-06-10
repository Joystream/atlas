import { PropsWithChildren, forwardRef, memo, useRef } from 'react'

import { Text } from '@/components/Text'
import { TooltipProps } from '@/components/Tooltip'

import {
  ChildrenWrapper,
  FormFieldDescription,
  FormFieldFooter,
  FormFieldHeader,
  FormFieldTitleWrapper,
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

export type FormFieldProps = PropsWithChildren<{
  label?: string
  optional?: boolean
  error?: string
  disableErrorAnimation?: boolean
  description?: string | string[]
  className?: string
  tooltip?: TooltipProps
}> &
  WithSwitchProps

export const FormField = memo(
  forwardRef<HTMLDivElement, FormFieldProps>(
    (
      {
        children,
        label,
        description,
        className,
        optional,
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

        const textArea = childrenWrapperRef.current?.getElementsByTagName('textarea')[0]
        if (textArea) {
          textArea?.focus()
        }

        const button = childrenWrapperRef.current?.getElementsByTagName('button')[0]
        // If Formfield is wrapping custom Select and you click on the label it will click select toggle button and open select menu
        if (button && button.getAttribute('data-select')) {
          button.click()
        }
      }

      const isInputOpen = switchable ? switchProps?.value : true
      return (
        <FormFieldWrapper className={className} ref={ref}>
          {(label || description) && (
            <FormFieldHeader switchable={switchable}>
              {label && (
                <FormFieldTitleWrapper>
                  {switchable ? (
                    <SwitchLabel>
                      <Switch {...switchProps} />
                      <SwitchTitle as="span" variant="h300">
                        {label}
                      </SwitchTitle>
                    </SwitchLabel>
                  ) : (
                    <label onClick={handleFocusOnClick}>
                      <Text variant="h300" as="span">
                        {label}
                      </Text>
                    </label>
                  )}
                  {optional && (
                    <OptionalText variant="t200" color="default">
                      (optional)
                    </OptionalText>
                  )}
                  {tooltip && <StyledInformation {...tooltip} />}
                </FormFieldTitleWrapper>
              )}
              {description &&
                (description instanceof Array ? (
                  description.map((p, idx) => (
                    <FormFieldDescription color="default" key={idx} variant="t200">
                      {p}
                    </FormFieldDescription>
                  ))
                ) : (
                  <FormFieldDescription color="default" variant="t200">
                    {description}
                  </FormFieldDescription>
                ))}
            </FormFieldHeader>
          )}
          {isInputOpen && (
            <ChildrenWrapper ref={childrenWrapperRef} disableErrorAnimation={disableErrorAnimation} isError={!!error}>
              {children}
            </ChildrenWrapper>
          )}
          {error ? (
            <FormFieldFooter>
              <StyledSvgActionWarning />
              <Text variant="t100" color="error">
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
