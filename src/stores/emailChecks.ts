import { createSignal } from 'solid-js'

import { apiClient } from '../utils/apiClient'

const [emailChecks, setEmailChecks] = createSignal<{ [email: string]: boolean }>({})

export const checkEmail = async (email: string): Promise<boolean> => {
  if (emailChecks()[email]) {
    return true
  }

  const checkResult = await apiClient.authCheckEmail({ email })

  if (checkResult) {
    setEmailChecks((oldEmailChecks) => ({ ...oldEmailChecks, [email]: true }))
    return true
  }

  return false
}

export const useEmailChecks = () => {
  return { emailChecks }
}
