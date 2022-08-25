export const LANGUAGES_LIST = [
  { name: 'English', value: 'en' },
  { name: 'Arabic', value: 'ar' },
  { name: 'Chinese', value: 'zh' },
  { name: 'Danish', value: 'da' },
  { name: 'Dutch', value: 'nl' },
  { name: 'Estonian', value: 'et' },
  { name: 'Finnish', value: 'fi' },
  { name: 'French', value: 'fr' },
  { name: 'German', value: 'de' },
  { name: 'Greek', value: 'el' },
  { name: 'Hindi', value: 'hi' },
  { name: 'Italian', value: 'it' },
  { name: 'Japanese', value: 'ja' },
  { name: 'Korean', value: 'ko' },
  { name: 'Norwegian', value: 'no' },
  { name: 'Portuguese', value: 'pt' },
  { name: 'Russian', value: 'ru' },
  { name: 'Spanish', value: 'es' },
  { name: 'Swedish', value: 'sv' },
  { name: 'Turkish', value: 'tr' },
  { name: 'Vietnamese', value: 'vi' },
]

export const LANGUAGES_LOOKUP = LANGUAGES_LIST.reduce((acc, { name, value }) => {
  acc[value] = name
  return acc
}, {} as Record<string, string>)
