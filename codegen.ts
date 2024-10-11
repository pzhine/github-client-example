import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'graphql/schema.docs.graphql',
  documents: ['graphql/**/*.graphql'],
  generates: {
    './graphql/__generated__/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      // preset: 'client',
      // presetConfig: {
      //   gqlTagName: 'gql',
      // },
    },
  },
}

export default config
