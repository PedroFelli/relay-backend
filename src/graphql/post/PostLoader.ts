import { readDatabase } from "../../utils"

export async function loadAll(){
  const posts = await readDatabase("posts");

  if(!posts){
  }

  return posts.reverse();
}