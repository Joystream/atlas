import { CodegenConfig } from '@graphql-codegen/cli'

import { customSchemaLoader } from './scripts/customSchemaLoader'

const schemaUrl = 'https://orion.gleev.xyz/graphql'

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    {
      [schemaUrl]: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        loader: customSchemaLoader,
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
