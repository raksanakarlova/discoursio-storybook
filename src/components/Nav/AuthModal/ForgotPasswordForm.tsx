import type { AuthModalSearchParams } from './types'

import { clsx } from 'clsx'
import { createSignal, JSX, Show } from 'solid-js'

import { useLocalize } from '../../../context/localize'
import { useSession } from '../../../context/session'
// import { ApiError } from '../../../graphql/error'
import { useRouter } from '../../../stores/router'
import { validateEmail } from '../../../utils/validateEmail'

import { email, setEmail } from './sharedLogic'

import styles from './AuthModal.module.scss'

type FormFields = {
  email: string
}

type ValidationErrors = Partial<Record<keyof FormFields, string | JSX.Element>>

export const ForgotPasswordForm = () => {
  const { changeSearchParams } = useRouter<AuthModalSearchParams>()
  const { t } = useLocalize()
  const handleEmailInput = (newEmail: string) => {
    setValidationErrors(({ email: _notNeeded, ...rest }) => rest)
    setEmail(newEmail.toLowerCase())
  }
  const {
    actions: { forgotPassword },
  } = useSession()
  const [submitError, setSubmitError] = createSignal('')
  const [isSubmitting, setIsSubmitting] = createSignal(false)
  const [validationErrors, setValidationErrors] = createSignal<ValidationErrors>({})
  const [isUserNotFount, setIsUserNotFound] = createSignal(false)
  const authFormRef: { current: HTMLFormElement } = { current: null }
  const [message, setMessage] = createSignal<string>('')

  const handleSubmit = async (event: Event) => {
    event.preventDefault()
    setSubmitError('')
    setIsUserNotFound(false)
    const newValidationErrors: ValidationErrors = {}

    if (!email()) {
      newValidationErrors.email = t('Please enter email')
    } else if (!validateEmail(email())) {
      newValidationErrors.email = t('Invalid email')
    }

    setValidationErrors(newValidationErrors)
    const isValid = Object.keys(newValidationErrors).length === 0

    if (!isValid) {
      authFormRef.current
        .querySelector<HTMLInputElement>(`input[name="${Object.keys(newValidationErrors)[0]}"]`)
        .focus()

      return
    }

    setIsSubmitting(true)
    try {
      const { data, errors } = await forgotPassword({
        email: email(),
        redirect_uri: window.location.origin,
      })
      if (data) {
        console.debug('[ForgotPasswordForm] authorizer response:', data)
        setMessage(data.message)
      }
      if (errors) {
        console.warn(errors)
        if (errors) {
          const error: Error = errors[0]
          if (error.cause === 'user_not_found') {
            setIsUserNotFound(true)
            return
          } else {
            setSubmitError(error.message)
          }
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      class={clsx(styles.authForm, styles.authFormForgetPassword)}
      ref={(el) => (authFormRef.current = el)}
    >
      <div>
        <h4>{t('Restore password')}</h4>
        <div class={styles.authSubtitle}>
          {t(message()) || t('Everything is ok, please give us your email address')}
        </div>
        <div
          class={clsx('pretty-form__item', {
            'pretty-form__item--error': validationErrors().email,
          })}
        >
          <input
            disabled={Boolean(message())}
            id="email"
            name="email"
            autocomplete="email"
            type="email"
            value={email()}
            placeholder={t('Email')}
            onInput={(event) => handleEmailInput(event.currentTarget.value)}
          />

          <label for="email">{t('Email')}</label>
        </div>

        <Show when={submitError()}>
          <div class={styles.authInfo}>
            <ul>
              <li class={styles.warn}>{submitError()}</li>
            </ul>
          </div>
        </Show>

        <Show when={isUserNotFount()}>
          <div class={styles.authSubtitle}>
            {t("We can't find you, check email or")}{' '}
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault()
                changeSearchParams({
                  mode: 'register',
                })
              }}
            >
              {t('register')}
            </a>
            <Show when={validationErrors().email}>
              <div class={styles.validationError}>{validationErrors().email}</div>
            </Show>
          </div>
        </Show>

        <div>
          <button
            class={clsx('button', styles.submitButton)}
            disabled={isSubmitting() || Boolean(message())}
            type="submit"
          >
            {isSubmitting() ? '...' : t('Restore password')}
          </button>
        </div>
        <div class={styles.authControl}>
          <span
            class={styles.authLink}
            onClick={() =>
              changeSearchParams({
                mode: 'login',
              })
            }
          >
            {t('I know the password')}
          </span>
        </div>
      </div>
    </form>
  )
}
