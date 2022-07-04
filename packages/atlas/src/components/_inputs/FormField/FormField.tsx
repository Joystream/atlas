import { PropsWithChildren, ReactNode, forwardRef, memo, useRef } from 'react'

import { Text } from '@/components/Text'
import { TooltipProps } from '@/components/Tooltip'

import {
  ChildrenWrapper,
  FormFieldDescription,
  FormFieldFooter,
  FormFieldHeader,
  FormFieldTitleWrapper,
  FormFieldWrapper,
  Label,
  StyledInformation,
  StyledSvgActionWarning,
  SwitchLabel,
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
  // We use ReactNode only in exceptional circumstances! In most cases you should use regular string.
  label?: ReactNode
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
                      {typeof label === 'string' ? (
                        <Text as="span" variant="h300" margin={{ left: 2 }}>
                          {label}
                        </Text>
                      ) : (
                        label
                      )}
                    </SwitchLabel>
                  ) : (
                    <Label onClick={handleFocusOnClick}>
                      {typeof label === 'string' ? (
                        <Text as="span" variant="h300" margin={{ left: 2 }}>
                          {label}
                        </Text>
                      ) : (
                        label
                      )}
                    </Label>
                  )}
                  {optional && (
                    <Text as="span" variant="t200" color="colorText" margin={{ left: 1 }}>
                      (optional)
                    </Text>
                  )}
                  {tooltip && <StyledInformation {...tooltip} />}
                </FormFieldTitleWrapper>
              )}
              {description &&
                (description instanceof Array ? (
                  description.map((p, idx) => (
                    <FormFieldDescription as="span" color="colorText" key={idx} variant="t100">
                      {p}
                    </FormFieldDescription>
                  ))
                ) : (
                  <FormFieldDescription as="span" color="colorText" variant="t100">
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
              <Text as="span" variant="t100" color="colorTextError">
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
