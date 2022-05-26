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
  SwitchTitle,
  SwitchWrapper,
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

      const isInputOpen = switchable ? switchProps?.value : true
      return (
        <FormFieldWrapper className={className} dense={dense} ref={ref}>
          <FormFieldHeader>
            {switchable ? (
              <SwitchWrapper>
                <Switch {...switchProps} />
                <SwitchTitle variant="h300">{label}</SwitchTitle>
              </SwitchWrapper>
            ) : (
              <Text variant="h300">{label}</Text>
            )}
            {tooltip && <StyledInformation {...tooltip} />}
            {optional && (
              <OptionalText variant="t200" secondary>
                (Optional)
              </OptionalText>
            )}
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
