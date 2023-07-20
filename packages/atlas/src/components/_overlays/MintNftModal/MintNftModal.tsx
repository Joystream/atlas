import styled from '@emotion/styled'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { SvgAlertsInformative24 } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { Text } from '@/components/Text'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { Switch } from '@/components/_inputs/Switch'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { SaleNftFirstTimeModal } from '@/components/_overlays/SaleNftFirstTimeModal'
import { useVideoForm } from '@/hooks/useVideoForm'
import { useJoystream } from '@/providers/joystream'
import { useNftActions } from '@/providers/nftActions/nftActions.hooks'
import { usePersonalDataStore } from '@/providers/personalData'
import { VideoWorkspaceVideoFormFields, useVideoWorkspaceData } from '@/providers/videoWorkspace'
import { sizes } from '@/styles'
import { useHandleVideoWorkspaceSubmit } from '@/views/studio/VideoWorkspace/VideoWorkspace.hooks'

const SALE_CONFIRMATION_ID = 'first-mint'

export const MintNftModal = () => {
  const {
    chainState: { nftMaxCreatorRoyaltyPercentage, nftMinCreatorRoyaltyPercentage },
  } = useJoystream()
  const [shouldHideMintModal, setShouldHideMintModal] = useState(false)
  const [showRoyaltyInput, setShowRoyaltyInput] = useState(false)

  const handleVideoWorkspaceSubmit = useHandleVideoWorkspaceSubmit()
  const { setNftToMint, nftToMint, openNftPutOnSale } = useNftActions()
  const { tabData } = useVideoWorkspaceData(nftToMint ?? undefined)
  const [showSaleConfirmationDialog, setShowSaleConfirmationDialog] = useState(false)
  const saleConfirmationDismissed = usePersonalDataStore((state) =>
    state.dismissedMessages.some((message) => message.id === SALE_CONFIRMATION_ID)
  )
  const updateMintConfirmationDismiss = usePersonalDataStore((state) => state.actions.updateDismissedMessages)

  const form = useForm<VideoWorkspaceVideoFormFields>({
    defaultValues: { ...tabData, mintNft: true },
  })

  const {
    register,
    formState: { errors },
  } = form

  const { submitHandler, formStatus } = useVideoForm({
    id: nftToMint,
    isEdit: true,
    onSubmit: async (data) => {
      handleVideoWorkspaceSubmit(
        data,
        { isNew: false, mintNft: true, isDraft: false, id: nftToMint ?? '' },
        undefined,
        () => {
          if (!saleConfirmationDismissed) {
            setShowSaleConfirmationDialog(true)
          } else {
            setNftToMint(null)
          }
        }
      )
    },
    form,
  })

  return (
    <>
      <SaleNftFirstTimeModal
        shouldHideNextTime={shouldHideMintModal}
        onShouldHideNextTime={setShouldHideMintModal}
        show={showSaleConfirmationDialog}
        onSkip={() => {
          if (shouldHideMintModal) {
            updateMintConfirmationDismiss(SALE_CONFIRMATION_ID, true)
          }
          setShowSaleConfirmationDialog(false)
          setNftToMint(null)
        }}
        onSale={() => {
          if (shouldHideMintModal) {
            updateMintConfirmationDismiss(SALE_CONFIRMATION_ID, true)
          }
          openNftPutOnSale(nftToMint ?? '')
          setShowSaleConfirmationDialog(false)
          setNftToMint(null)
        }}
      />
      <DialogModal
        show={!!nftToMint}
        title="Mint NFT"
        primaryButton={{
          text: 'Mint NFT',
          onClick: () => submitHandler(),
        }}
        secondaryButton={{
          text: 'Cancel',
          onClick: () => setNftToMint(null),
        }}
        fee={formStatus.actionBarFee}
      >
        <Container>
          <Text variant="t200" as="p" color="colorText">
            Minting an NFT creates a record of ownership on the blockchain that can be put on sale. This doesn't impact
            your intellectual rights to the video.
          </Text>
          <SwitchContainer>
            <Switch
              label="Royalties"
              value={showRoyaltyInput}
              onChange={(e) => setShowRoyaltyInput(e?.target.checked ?? false)}
            />
            <Text variant="t100" as="p" color="colorText">
              Royalties let you earn commissions from every sale of this NFT. Sale commissions go out to your channel
              account.
            </Text>
            {showRoyaltyInput && (
              <FormField error={errors.nftRoyaltiesPercent?.message}>
                <Input
                  type="number"
                  {...register('nftRoyaltiesPercent', {
                    valueAsNumber: true,
                    min: {
                      value: nftMinCreatorRoyaltyPercentage,
                      message: `Creator royalties cannot be lower than ${nftMinCreatorRoyaltyPercentage}%`,
                    },
                    max: {
                      value: nftMaxCreatorRoyaltyPercentage,
                      message: `Creator royalties cannot be higher than ${nftMaxCreatorRoyaltyPercentage}%`,
                    },
                  })}
                  error={!!errors.nftRoyaltiesPercent}
                  placeholder="—"
                  nodeEnd={
                    <Text variant="t300" as="span" color="colorTextMuted">
                      %
                    </Text>
                  }
                />
              </FormField>
            )}
          </SwitchContainer>

          <Banner
            icon={<SvgAlertsInformative24 />}
            title="Heads up!"
            description="You won’t be able to edit this video once you mint an NFT for it. Sale revenue and potential commissions will go out to your channel account, from where they can be withdrawn to your membership account."
          />
        </Container>
      </DialogModal>
    </>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(8)};
`

const SwitchContainer = styled.div`
  display: grid;
  gap: ${sizes(2)};
`
