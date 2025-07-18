// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { ensurePrefix } from '@/utils/string'

// Check if the url is missing the locale
export const isUrlMissingLocale = url => {
  return i18n.locales.every(locale => !(url.startsWith(`/`) || url === `/`))
}

// Get the localized url
export const getLocalizedUrl = (url, languageCode) => {
  if (!url || !languageCode) throw new Error("URL or Language Code can't be empty")

  return isUrlMissingLocale(url) ? `/${ensurePrefix(url, '/')}` : url
}
