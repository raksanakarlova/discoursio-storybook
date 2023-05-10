import type { JSX } from 'solid-js'
import { Accessor, createContext, createSignal, useContext } from 'solid-js'
import { createStore, SetStoreFunction } from 'solid-js/store'
import { Topic } from '../graphql/types.gen'
import { apiClient } from '../utils/apiClient'
import { useLocalize } from './localize'
import { useSnackbar } from './snackbar'
import { translit } from '../utils/ru2en'
import { openPage } from '@nanostores/router'
import { router, useRouter } from '../stores/router'

type WordCounter = {
  characters: number
  words: number
}

type ShoutForm = {
  shoutId: number
  slug: string
  title: string
  subtitle: string
  selectedTopics: Topic[]
  mainTopic: string
  body: string
  coverImageUrl: string
}

type EditorContextType = {
  isEditorPanelVisible: Accessor<boolean>
  wordCounter: Accessor<WordCounter>
  form: ShoutForm
  formErrors: Partial<ShoutForm>
  actions: {
    saveShout: () => Promise<void>
    publishShout: () => Promise<void>
    publishShoutById: (shoutId: number) => Promise<void>
    deleteShout: (shoutId: number) => Promise<boolean>
    toggleEditorPanel: () => void
    countWords: (value: WordCounter) => void
    setForm: SetStoreFunction<ShoutForm>
    setFormErrors: SetStoreFunction<Partial<ShoutForm>>
  }
}

const EditorContext = createContext<EditorContextType>()

export function useEditorContext() {
  return useContext(EditorContext)
}

export const EditorProvider = (props: { children: JSX.Element }) => {
  const { t } = useLocalize()

  const { page } = useRouter()

  const {
    actions: { showSnackbar }
  } = useSnackbar()

  const [isEditorPanelVisible, setIsEditorPanelVisible] = createSignal<boolean>(false)

  const [form, setForm] = createStore<ShoutForm>(null)
  const [formErrors, setFormErrors] = createStore<Partial<ShoutForm>>(null)

  const [wordCounter, setWordCounter] = createSignal<WordCounter>({
    characters: 0,
    words: 0
  })

  const toggleEditorPanel = () => setIsEditorPanelVisible((value) => !value)
  const countWords = (value) => setWordCounter(value)

  const validate = () => {
    if (!form.title) {
      setFormErrors('title', t('Required'))
      return false
    }

    return true
  }

  const saveShout = async () => {
    if (isEditorPanelVisible()) {
      toggleEditorPanel()
    }

    if (!validate()) {
      return
    }

    try {
      const shout = await apiClient.updateArticle({
        shoutId: form.shoutId,
        shoutInput: {
          body: form.body,
          topics: form.selectedTopics.map((topic) => topic.slug),
          // authors?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
          // community?: InputMaybe<Scalars['Int']>
          mainTopic: form.selectedTopics[0]?.slug || 'society',
          slug: form.slug,
          subtitle: form.subtitle,
          title: form.title,
          cover: form.coverImageUrl
        },
        publish: false
      })

      if (shout.visibility === 'owner') {
        openPage(router, 'drafts')
      } else {
        openPage(router, 'article', { slug: shout.slug })
      }
    } catch (error) {
      console.error('[saveShout]', error)
      showSnackbar({ type: 'error', body: t('Error') })
    }
  }

  const publishShout = async () => {
    if (isEditorPanelVisible()) {
      toggleEditorPanel()
    }
    if (!validate()) {
      return
    }
    if (page().route === 'edit') {
      const slug = translit(form.title.toLowerCase()).replaceAll(' ', '-')
      setForm('slug', slug)
      openPage(router, 'editSettings', { shoutId: form.shoutId.toString() })
      return
    }

    try {
      await apiClient.updateArticle({
        shoutId: form.shoutId,
        shoutInput: {
          body: form.body,
          topics: form.selectedTopics.map((topic) => topic.slug),
          // authors?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
          // community?: InputMaybe<Scalars['Int']>
          mainTopic: form.selectedTopics[0]?.slug || 'society',
          slug: form.slug,
          subtitle: form.subtitle,
          title: form.title,
          cover: form.coverImageUrl
        },
        publish: true
      })
      openPage(router, 'feed')
    } catch (error) {
      console.error('[publishShout]', error)
      showSnackbar({ type: 'error', body: t('Error') })
    }
  }

  const publishShoutById = async (shoutId: number) => {
    try {
      await apiClient.updateArticle({
        shoutId,
        publish: true
      })

      openPage(router, 'feed')
    } catch (error) {
      console.error('[publishShoutById]', error)
      showSnackbar({ type: 'error', body: t('Error') })
    }
  }

  const deleteShout = async (shoutId: number) => {
    try {
      await apiClient.deleteShout({
        shoutId
      })
      return true
    } catch {
      showSnackbar({ type: 'error', body: t('Error') })
      return false
    }
  }

  const actions = {
    saveShout,
    publishShout,
    publishShoutById,
    deleteShout,
    toggleEditorPanel,
    countWords,
    setForm,
    setFormErrors
  }

  const value: EditorContextType = { actions, form, formErrors, isEditorPanelVisible, wordCounter }

  return <EditorContext.Provider value={value}>{props.children}</EditorContext.Provider>
}
