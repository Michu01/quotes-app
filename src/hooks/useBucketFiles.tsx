import { useQuery } from "@tanstack/react-query";
import getBucketFiles from "../helpers/getBucketFiles";

function useBucketFiles(bucketName: string) {
  return useQuery({
    queryFn: async () => await getBucketFiles(bucketName),
    queryKey: ["bucket", bucketName]
  })
}

export default useBucketFiles