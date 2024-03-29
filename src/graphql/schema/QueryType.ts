import {GraphQLNonNull, GraphQLObjectType} from 'graphql'
import { connectionArgs, connectionFromArray } from 'graphql-relay'
import { PostConnection } from '../post/PostType'

import * as PostLoader from '../post/PostLoader';

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all queries',
  fields: () => ({  
    posts: {
      type: GraphQLNonNull(PostConnection),
      args: connectionArgs,
      resolve: async (_, args, context) => {
        const data = await PostLoader.loadAll()
        return connectionFromArray(data, args);
      }
    }
  })
})  

export default QueryType