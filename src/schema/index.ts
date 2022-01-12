import { makeExecutableSchema } from '@graphql-tools/schema'
import StorySchema from './StorySchema'

const baseTypeDefs = /* GraphQL */ `
  scalar Date

  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`

const rootSchema = makeExecutableSchema({
  typeDefs: [baseTypeDefs, StorySchema.typeDefs],
  resolvers: [StorySchema.resolvers],
})

export default rootSchema
