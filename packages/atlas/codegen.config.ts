import { CodegenConfig } from '@graphql-codegen/cli'
import * as assert from 'assert'

import { customSchemaLoader } from './scripts/customSchemaLoader'

const NODE_ENV = process.env.NODE_ENV?.toUpperCase() ?? 'PRODUCTION'
const schemaUrl = process.env[`VITE_${NODE_ENV}_ORION_URL`]
const authUrl = process.env[`VITE_${NODE_ENV}_ORION_AUTH_URL`]
assert(schemaUrl)
assert(authUrl)

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    {
      [schemaUrl]: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        loader: customSchemaLoader(schemaUrl, `${authUrl}/anonymous-auth`),
      },
    },
  ],
  documents: ['./src/api/queries/**/*.graphql'],
  config: {
    scalars: {
      DateTime: 'Date',
      BigInt: 'string',
    },
    preResolveTypes: true, // avoid using Pick
  },
  generates: {
    'src/api/schemas/orion.json': {
      plugins: ['introspection'],
      config: {
        minify: true,
      },
    },
    'src/api/queries/__generated__/baseTypes.generated.ts': {
      hooks: {
        afterOneFileWrite: ['prettier --write', 'eslint --fix'],
      },
      plugins: ['typescript'],
    },
    'src/api/queries/__generated__/': {
      preset: 'near-operation-file',
      presetConfig: {
        baseTypesPath: 'baseTypes.generated.ts',
        folder: '__generated__',
        extension: '.generated.tsx',
      },
      hooks: {
        afterOneFileWrite: ['prettier --write', 'eslint --fix'],
      },
      plugins: ['typescript-operations', 'typescript-react-apollo'],
    },
  },
}

export default config
