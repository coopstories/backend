import { GraphQLContext } from '../context'

const typeDefs = /* GraphQL */ `
  extend type Query {
    getPublicStoryData(id: Int!): PublicStoryData!

    accessStory(id: Int!, password: String): VisibleStory!
  }

  extend type Mutation {
    createStory(
      title: String!
      creator: String!
      content: String!
    ): NextCollaboratorData!

    continueStory(
      id: Int!
      password: String!

      contributor: String!
      content: String!
    ): NextCollaboratorData!

    unlockFullStory(id: Int!, masterPassword: String!): EntireStory!
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
    locked: Boolean
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
      parent: unknown,
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
      parent: unknown,
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

      if (story.nextPassword !== args.password) {
        throw new Error('Incorrect password')
      }

      // TODO: Cut out the end section of the fragment
      const previousFragment = story.storyFragments[0].content

      return {
        id: story.id,
        title: story.title,
        creatorName: story.creatorName,
        createdAt: story.createdAt,
        previousFragment,
      }
    },
  },

  Mutation: {
    createStory: async (
      _parent: unknown,
      args: { title: string; creator: string; content: string },
      { prisma }: GraphQLContext,
    ) => {
      const { story } = await prisma.storyFragment.create({
        data: {
          story: {
            create: {
              title: args.title,
              creatorName: args.creator,

              nextPassword: '1',
              masterPassword: '2',
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
        nextPassword: story.nextPassword,
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

      if (story.nextPassword !== args.password) {
        throw new Error('Incorrect password')
      }

      const nextPassword = args.password + '1'

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
        nextPassword,
      }
    },
  },
}

const StorySchema = { typeDefs, resolvers }

export default StorySchema
