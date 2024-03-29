import { GraphQLNonNull, GraphQLString } from 'graphql'
import {mutationWithClientMutationId, toGlobalId} from 'graphql-relay'

import {resolve} from 'path'
import { readDatabase } from '../../../utils';
import {uuid} from 'uuidv4'

import fs from 'fs';
import { PostEdge } from '../PostType';

export default mutationWithClientMutationId({
  name: 'CreatePost',
  inputFields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    body: {
      type: new GraphQLNonNull(GraphQLString),
    }
  },
  mutateAndGetPayload: async ({title,body}) => {
    const source  =resolve(__dirname, '..', '..', '..', '..');

    const data = await readDatabase();

    const post = {
      id: uuid(),
      title,
      body,
    } 

    let posts = []

    if(data.posts) {
      posts = [
        ...data.posts,
        {
          ...post,
        }
      ]
    }else{
      posts = [
        {
          ...post,
        }
      ]
    }

    await fs.writeFileSync(`${source}/data.json`, JSON.stringify({
      ...data,
      posts,
    }));

    return {
      post,
      error: null,
      sucess: 'Post created succesfully'
    }
  },
  outputFields:{
    postEdge: {
      type: PostEdge,
      resolve: async ({post}) => {
        if(!post){
          return null;
        }

        return {
          cursor: toGlobalId('Post', post.id),
          node: post,
        }
      }
    },
    error: {
      type: GraphQLString,
      resolve: ({error}: {error: string}) => error,
    },
    sucess: {
      type: GraphQLString,
      resolve: ({sucess}: {sucess: string}) => sucess,
    },
  }
})