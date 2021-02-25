import React, { useCallback, useState } from 'react'
import Button from '../Button'
import { ButtonsGroup, DragAndDropArea, InnerContainer, Paragraph, StyledIcon, Title } from './MultiFileSelect.style'
import { useDropzone, DropzoneOptions } from 'react-dropzone'

const MultiFileSelect = () => {
  const [files, setFiles] = useState<File[]>([])

  const onDrop: DropzoneOptions['onDrop'] = useCallback((acceptedFiles) => {
    // Do something with the files
  }, [])
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isFileDialogActive,
    isDragReject,
    acceptedFiles,
    draggedFiles,
    isFocused,
  } = useDropzone({
    onDrop,
    accept: 'video/*',
    maxFiles: 1,
    multiple: false,
  })

  console.log({ acceptedFiles })
  return (
    <>
      <DragAndDropArea {...getRootProps()} isDragAccept={isDragAccept} isFileDialogActive={isFileDialogActive}>
        <InnerContainer>
          <StyledIcon name="video-dnd" />
          <Title variant="h5">Select Video File</Title>
          <Paragraph variant="subtitle2" as="p">
            16:9 Ratio preferred. 4K, 1440p, 1080p or 720p. This is example FPO data only.
          </Paragraph>
          <ButtonsGroup>
            <span>Drag and drop or </span>
            <input {...getInputProps()} />
            <Button>Select a file</Button>
          </ButtonsGroup>
        </InnerContainer>
      </DragAndDropArea>
    </>
  )
}

export default MultiFileSelect
