export type SchemaOrgTag = {
  type: 'link' | 'regular'
  prop: string
  value: unknown
}

export type MetaTags = Record<string, string | number>

export type AppData = {
  name: string
  orionUrl: string
  twitterId?: string
  yppOgTitle?: string
  yppOgDescription?: string
  yppOgImage?: string
}
