import supabase from "../services/supabase";

async function getBucketFiles(bucketName: string) {
  return await supabase
    .storage
    .from(bucketName)
    .list()
}

export default getBucketFiles