import { UploadFile, createDropzone, createFileUploader } from '@solid-primitives/upload'
import { clsx } from 'clsx'
import { Show, createSignal } from 'solid-js'

import { Button } from '~/components/_shared/Button'
import { Icon } from '~/components/_shared/Icon'
import { Loading } from '~/components/_shared/Loading'
import { useLocalize } from '~/context/localize'
import { useSession } from '~/context/session'
import { useUI } from '~/context/ui'
import { handleImageUpload } from '~/lib/handleImageUpload'
import { UploadedFile } from '~/types/upload'
import { InlineForm } from '../InlineForm'

import styles from './UploadModalContent.module.scss'

type Props = {
  onClose: (image?: UploadedFile) => void
}

const verify = (url: string) =>
  fetch(url, { method: 'HEAD' }).then((res) => res.headers.get('Content-Type')?.startsWith('image'))

export const UploadModalContent = (props: Props) => {
  const { t } = useLocalize()
  const { hideModal } = useUI()
  const [isUploading, setIsUploading] = createSignal(false)
  const [uploadError, setUploadError] = createSignal<string | undefined>()
  const [dragActive, setDragActive] = createSignal(false)
  const [dragError, setDragError] = createSignal<string | undefined>()
  const { session } = useSession()
  const { selectFiles } = createFileUploader({ multiple: false, accept: 'image/*' })
  const runUpload = async (file: UploadFile) => {
    try {
      setIsUploading(true)
      const result = await handleImageUpload(file, session()?.access_token || '')
      props.onClose(result)
      setIsUploading(false)
    } catch (error) {
      setIsUploading(false)
      setUploadError(t('Error'))
      console.error('[runUpload]', error)
    }
  }

  const handleImageFormSubmit = async (value: string) => {
    try {
      const data = await fetch(value)
      const blob = await data.blob()
      const file = new File([blob], 'convertedFromUrl', {
        type: data.headers.get('Content-Type') || undefined
      })
      const fileToUpload: UploadFile = {
        source: blob.toString(),
        name: file.name,
        size: file.size,
        file: file
      }
      await runUpload(fileToUpload)
    } catch (error) {
      console.error('[handleImageFormSubmit]', error)
    }
  }

  const handleUpload = () => {
    selectFiles(async ([uploadFile]) => {
      await runUpload(uploadFile)
    })
  }

  const { setRef: dropzoneRef, files: droppedFiles } = createDropzone({
    onDrop: async () => {
      setDragActive(false)
      if (droppedFiles().length > 1) {
        setDragError(t('Many files, choose only one'))
      } else if (droppedFiles()[0].file.type.startsWith('image/')) {
        await runUpload(droppedFiles()[0])
      } else {
        setDragError(t('Image format not supported'))
      }
    }
  })
  const handleDrag = (event: MouseEvent) => {
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true)
    } else if (event.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleValidate = async (value: string) => {
    const validationResult = await verify(value)
    if (!validationResult) {
      return t('Invalid image URL')
    }

    return ''
  }

  return (
    <div class={styles.uploadModalContent}>
      <Show when={!isUploading()} fallback={<Loading />}>
        <>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            ref={dropzoneRef}
            class={clsx(styles.dropZone, { [styles.active]: dragActive() })}
          >
            <Icon class={styles.icon} name="editor-image-dd" />
            <div class={clsx(styles.text, { [styles.error]: dragError() })}>
              {dragError() ?? t('Drag the image to this area')}
            </div>
          </div>
          <Button
            value={t('Upload')}
            variant="bordered"
            onClick={handleUpload}
            class={styles.uploadButton}
          />
          <Show when={uploadError()}>
            <div class={styles.error}>{uploadError()}</div>
          </Show>
          <div class={styles.formHolder}>
            <InlineForm
              placeholder={t('Or paste a link to an image')}
              showInput={true}
              onClose={() => {
                hideModal()
                props.onClose()
              }}
              validate={handleValidate}
              onSubmit={handleImageFormSubmit}
            />
          </div>
        </>
      </Show>
    </div>
  )
}
