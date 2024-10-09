import supabase from "../services/supabase";

function getBucketFileUrl(bucketName: string, path: string) {
  return supabase
    .storage
    .from(bucketName)
    .getPublicUrl(path)
}

export default getBucketFileUrl