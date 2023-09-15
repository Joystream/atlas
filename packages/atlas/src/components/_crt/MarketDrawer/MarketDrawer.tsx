import { useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Controller, useForm } from 'react-hook-form'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { SvgActionPlay, SvgAlertsInformative24 } from '@/assets/icons'
import { CrtDrawer } from '@/components/CrtDrawer'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { ColumnBox } from '@/components/ProgressWidget/ProgressWidget.styles'
import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { TextButton } from '@/components/_buttons/Button'
import { CrtMarketForm } from '@/components/_crt/MarketDrawer/MarketDrawer.types'
import { MarketDrawerPreview } from '@/components/_crt/MarketDrawer/MarketDrawerPreview'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { TextArea } from '@/components/_inputs/TextArea'
import { TokenInput } from '@/components/_inputs/TokenInput'
import { SummaryRow } from '@/components/_overlays/SendTransferDialogs/SendTransferDialogs.styles'
import { atlasConfig } from '@/config'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useJoystream } from '@/providers/joystream'
import { transitions } from '@/styles'
import { Divider } from '@/views/global/NftSaleBottomDrawer/NftForm/AcceptTerms/AcceptTerms.styles'

enum MARKET_STEPS {
  market,
  saleSummary,
}
const marketStepsNames: string[] = ['Market', 'Sale summary']

export type CrtMarketSaleViewProps = {
  tokenName: string
  show: boolean
  onClose: () => void
}

const DEFAULT_MIN_PRICE = 100

export const MarketDrawer = ({ show, onClose, tokenName }: CrtMarketSaleViewProps) => {
  const [activeStep, setActiveStep] = useState(MARKET_STEPS.market)
  const [isGoingBack, setIsGoingBack] = useState(false)
  const { tokenPrice } = useJoystream()
  const nodeRef = useRef<HTMLDivElement>(null)

  const {
    control,
    getValues,
    resetField,
    formState: { isDirty },
  } = useForm<CrtMarketForm>({
    defaultValues: {
      price: DEFAULT_MIN_PRICE,
      tnc: atlasConfig.legal.crtTnc,
      isChecked: true,
    },
  })
  const tokenInUsd = (getValues('price') || 0) * (tokenPrice || 0)

  const [openDialog, closeDialog] = useConfirmationModal({
    type: 'warning',
    title: 'Discard changes?',
    description:
      'You have unsaved changes which are going to be lost if you close this window. Are you sure you want to continue?',
    primaryButton: {
      variant: 'warning',
      text: 'Confirm and discard',
      onClick: () => {
        closeDialog()
        onClose()
      },
    },
    secondaryButton: {
      text: 'Cancel',
      onClick: () => closeDialog(),
    },
  })

  const secondaryButton = useMemo(() => {
    switch (activeStep) {
      case MARKET_STEPS.market:
        return {
          text: 'Cancel',
          onClick: () => (isDirty ? onClose() : openDialog()),
        }
      case MARKET_STEPS.saleSummary:
        return {
          text: 'Back',
          onClick: () => {
            flushSync(() => {
              setIsGoingBack(true)
            })
            setActiveStep(MARKET_STEPS.market)
          },
        }
    }
  }, [activeStep, isDirty, onClose, openDialog])

  const primaryButton = useMemo(() => {
    switch (activeStep) {
      case MARKET_STEPS.market:
        return {
          text: 'Next',
          onClick: () => {
            setActiveStep(MARKET_STEPS.saleSummary)
          },
        }
      case MARKET_STEPS.saleSummary:
        return {
          text: 'Start sale',
          onClick: () => {
            //token sale tx
          },
        }
    }
  }, [activeStep])

  const stepContent = () => {
    switch (activeStep) {
      case MARKET_STEPS.market:
        return (
          <div>
            <Text variant="h500" as="span" margin={{ bottom: 2, right: 4 }}>
              Market
            </Text>
            <TextButton as="span" icon={<SvgActionPlay />} iconPlacement="left" color="colorTextPrimary">
              Learn more
            </TextButton>
            <Text variant="t300" color="colorText" as="p">
              Automated market maker (AMM) will increase ${tokenName} price after each purchase and decrease its price
              when someone sells it to the AMM.
            </Text>
            <Text variant="h300" as="h1" margin={{ top: 8, bottom: 2 }}>
              Starting price for token
            </Text>
            <Text variant="t100" color="colorText" as="div" margin={{ bottom: 4 }}>
              You cannot set price lower than <NumberFormat value={DEFAULT_MIN_PRICE} as="span" withToken />
            </Text>
            <Controller
              control={control}
              render={({ field: { value: price, onChange: setPrice } }) => (
                <TokenInput
                  value={price}
                  onChange={setPrice}
                  nodeEnd={
                    <Text variant="t300" as="p" color="colorTextMuted">
                      ${tokenInUsd.toFixed(2)}
                    </Text>
                  }
                />
              )}
              name="price"
            />
            <Text variant="h300" as="h1" margin={{ top: 8, bottom: 2 }}>
              Terms and conditions
            </Text>
            <Text variant="t100" color="colorText" as="p" margin={{ bottom: 4 }}>
              Change default rules if you want to add some additional terms.
            </Text>
            <Controller
              control={control}
              render={({ field: { value: isChecked, onChange } }) => (
                <Checkbox
                  value={isChecked}
                  label="Keep the default terms & conditions"
                  onChange={(checked) => {
                    if (checked) {
                      resetField('tnc')
                    }
                    onChange(checked)
                  }}
                />
              )}
              name="isChecked"
            />
            <Controller
              control={control}
              render={({ field: { value: tnc, onChange } }) => (
                <TextArea rows={7} value={tnc} disabled={getValues('isChecked')} onChange={onChange} />
              )}
              name="tnc"
            />
          </div>
        )
      case MARKET_STEPS.saleSummary:
        return (
          <ColumnBox gap={2}>
            <Text variant="h500" as="h2" margin={{ top: 4, bottom: 2 }}>
              Market summary
            </Text>
            <Text variant="h400" as="h2" margin={{ bottom: 2 }}>
              Sale settings
            </Text>
            <SummaryRow>
              <FlexBox alignItems="center">
                <Text as="span" variant="h300" color="colorText">
                  Starting price
                </Text>
                <Tooltip text="Tooltip placeholder" placement="top" offsetY={4} delay={[1000, null]}>
                  <SvgAlertsInformative24 width={16} height={16} />
                </Tooltip>
              </FlexBox>
              <NumberFormat variant="h300" value={getValues('price')} withToken as="span" />
            </SummaryRow>
            <Divider />
            <SummaryRow>
              <FlexBox alignItems="center">
                <Text as="span" variant="h300" color="colorText">
                  Transaction Fee
                </Text>
                <Tooltip text="Tooltip placeholder" placement="top" offsetY={4} delay={[1000, null]}>
                  <SvgAlertsInformative24 width={16} height={16} />
                </Tooltip>
              </FlexBox>
              <NumberFormat variant="h300" withDenomination="before" value={getValues('price')} withToken as="span" />
            </SummaryRow>
          </ColumnBox>
        )
    }
  }

  return (
    <CrtDrawer
      steps={marketStepsNames}
      activeStep={activeStep}
      actionBar={{
        isNoneCrypto: true,
        primaryButton,
        secondaryButton,
      }}
      isOpen={show}
      onClose={onClose}
      preview={<MarketDrawerPreview tokenName={tokenName} />}
    >
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={activeStep}
          nodeRef={nodeRef}
          timeout={100}
          addEndListener={(done) => {
            nodeRef.current?.addEventListener('transitionend', done, false)
          }}
          onEntered={() => setIsGoingBack(false)}
          classNames={isGoingBack ? transitions.names.backwardSlideSwitch : transitions.names.forwardSlideSwitch}
        >
          <div ref={nodeRef}>{stepContent()}</div>
        </CSSTransition>
      </SwitchTransition>
    </CrtDrawer>
  )
}
