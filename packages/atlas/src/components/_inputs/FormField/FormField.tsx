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
  StyledInformation,
  StyledSvgActionWarning,
  SwitchLabel,
} from './FormField.styles'

import { Switch, SwitchProps } from '../Switch'

export type FormFieldProps = PropsWithChildren<{
  headerNode?: ReactNode
  footerNode?: ReactNode
  label?: string
  optional?: boolean
  error?: string
  disableErrorAnimation?: boolean
  description?: string | string[] | ReactNode
  className?: string
  tooltip?: TooltipProps
  switchProps?: Omit<SwitchProps, 'label'>
}>

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
        headerNode,
        tooltip,
        error,
        disableErrorAnimation,
        footerNode,
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

      const switchable = !!switchProps
      const isInputOpen = switchable ? switchProps?.value : true
      return (
        <FormFieldWrapper className={className} ref={ref}>
          {(label || description) && (
            <FormFieldHeader switchable={switchable}>
              {(label || headerNode) && (
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
                    <label onClick={handleFocusOnClick}>
                      <Text as="span" variant="h300">
                        {label}
                      </Text>
                    </label>
                  )}
                  {optional && (
                    <Text as="span" variant="t200" color="colorText" margin={{ left: 1 }}>
                      (optional)
                    </Text>
                  )}
                  {tooltip && <StyledInformation {...tooltip} />}
                  {headerNode}
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
          {footerNode}
        </FormFieldWrapper>
      )
    }
  )
)

FormField.displayName = 'FormField'
