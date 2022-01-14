import { GraphQLContext } from '../context'
import {
  comparePasswords,
  createMasterPassword,
  createNextPassword,
  getLastWords,
  hashPassword,
} from '../utils'

const PREVIOUS_FRAGMENT_WORDS = 20

const typeDefs = /* GraphQL */ `
  extend type Query {
    getPublicStoryData(id: Int!): PublicStoryData!

    accessStory(id: Int!, password: String): VisibleStory!
    accessFullStory(id: Int!, masterPassword: String!): EntireStory!
  }

  extend type Mutation {
    createStory(
      title: String!
      creator: String!
      content: String!
    ): StoryCreatedData!

    continueStory(
      id: Int!
      password: String!

      contributor: String!
      content: String!
    ): NextCollaboratorData!
  }

  type StoryCreatedData {
    storyId: Int!
    nextPassword: String!
    masterPassword: String!
  }

  type NextCollaboratorData {
    storyId: Int!
    nextPassword: String!
  }

  type PublicStoryData {
    id: Int!
    title: String!
    creatorName: String!
    createdAt: Date!
  }

  type VisibleStory {
    id: Int!
    title: String!
    creatorName: String!
    createdAt: Date!
    previousFragment: String!
  }

  type StoryFragment {
    id: Int!

    contributorName: String!
    content: String!
  }

  type EntireStory {
    id: Int!
    title: String!
    creatorName: String!
    createdAt: Date!

    storyFragments: [StoryFragment!]!
  }
`

const resolvers = {
  Query: {
    getPublicStoryData: (
      _parent: unknown,
      args: { id: number },
      { prisma }: GraphQLContext,
    ) => {
      return prisma.story.findUnique({
        where: {
          id: args.id,
        },

        select: {
          id: true,
          title: true,
          creatorName: true,
          createdAt: true,
        },
      })
    },

    accessStory: async (
      _parent: unknown,
      args: { id: number; password: string },
      { prisma }: GraphQLContext,
    ) => {
      const story = await prisma.story.findUnique({
        where: {
          id: args.id,
        },

        select: {
          id: true,
          title: true,
          creatorName: true,
          createdAt: true,
          nextPassword: true,

          storyFragments: { take: 1, orderBy: { id: 'desc' } },
        },
      })

      if (!story) {
        throw new Error('Unknown story with ID: ' + args.id)
      }

      const arePasswordsEqual = await comparePasswords(
        args.password,
        story.nextPassword,
      )

      if (!arePasswordsEqual) {
        throw new Error('Incorrect password')
      }

      const previousFragment = getLastWords(
        PREVIOUS_FRAGMENT_WORDS,
        story.storyFragments[0].content,
      )

      return {
        id: story.id,
        title: story.title,
        creatorName: story.creatorName,
        createdAt: story.createdAt,
        previousFragment,
      }
    },

    accessFullStory: async (
      _parent: unknown,
      args: { id: number; masterPassword: string },
      { prisma }: GraphQLContext,
    ) => {
      const story = await prisma.story.findUnique({
        where: {
          id: args.id,
        },

        select: {
          id: true,
          title: true,
          creatorName: true,
          createdAt: true,
          masterPassword: true,

          storyFragments: { orderBy: { id: 'asc' } },
        },
      })

      if (!story) {
        throw new Error('Unknown story with ID: ' + args.id)
      }

      const arePasswordsEqual = await comparePasswords(
        args.masterPassword,
        story.masterPassword,
      )

      if (!arePasswordsEqual) {
        throw new Error('Incorrect password')
      }

      return {
        id: story.id,
        title: story.title,
        creatorName: story.creatorName,
        createdAt: story.createdAt,
        storyFragments: story.storyFragments,
      }
    },
  },

  Mutation: {
    createStory: async (
      _parent: unknown,
      args: { title: string; creator: string; content: string },
      { prisma }: GraphQLContext,
    ) => {
      const plainNextPassword = createNextPassword()
      const nextPassword = await hashPassword(plainNextPassword)

      const plainMasterPassword = createMasterPassword()
      const masterPassword = await hashPassword(plainMasterPassword)

      const { story } = await prisma.storyFragment.create({
        data: {
          story: {
            create: {
              title: args.title,
              creatorName: args.creator,

              nextPassword,
              masterPassword,
            },
          },

          contributorName: args.creator,
          content: args.content,
        },

        select: {
          story: true,
        },
      })

      return {
        storyId: story.id,
        nextPassword: plainNextPassword,
        masterPassword: plainMasterPassword,
      }
    },

    continueStory: async (
      _parent: unknown,
      args: {
        id: number
        password: string

        contributor: string
        content: string
      },
      { prisma }: GraphQLContext,
    ) => {
      const story = await prisma.story.findUnique({
        where: {
          id: args.id,
        },
        select: {
          nextPassword: true,
        },
      })

      if (!story) {
        throw new Error('Unknown story with ID: ' + args.id)
      }

      const arePasswordsEqual = await comparePasswords(
        args.password,
        story.nextPassword,
      )

      if (!arePasswordsEqual) {
        throw new Error('Incorrect password')
      }

      const plainNextPassword = createNextPassword()
      const nextPassword = await hashPassword(plainNextPassword)

      await prisma.$transaction([
        prisma.story.update({
          where: { id: args.id },
          data: { nextPassword },
        }),

        prisma.storyFragment.create({
          data: {
            storyId: args.id,
            contributorName: args.contributor,
            content: args.content,
          },
        }),
      ])

      return {
        storyId: args.id,
        nextPassword: plainNextPassword,
      }
    },
  },
}

const StorySchema = { typeDefs, resolvers }

export default StorySchema
