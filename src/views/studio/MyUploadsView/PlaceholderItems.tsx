import React from 'react'
import { Placeholder } from '@/shared/components'
import {
  AssetsGroupBarUploadContainer,
  AssetsInfoContainer,
  UploadInfoContainer,
} from './AssetsGroupUploadBar/AssetsGroupUploadBar.style'

const Placeholders = () => {
  return (
    <>
      <AssetsGroupBarUploadContainer>
        <Placeholder width="72px" height="48px" bottomSpace="12px" />
        <AssetsInfoContainer>
          <Placeholder width="50px" height="14px" />
          <Placeholder width="50px" height="14px" />
        </AssetsInfoContainer>
        <UploadInfoContainer>
          <Placeholder width="100px" height="28px" />
        </UploadInfoContainer>
      </AssetsGroupBarUploadContainer>
      <Placeholder width="100%" height="64px" bottomSpace="24px" />
      <Placeholder width="60%" height="80px" bottomSpace="24px" />
    </>
  )
}

export const placeholderItems = Array(2).fill(<Placeholders />)
