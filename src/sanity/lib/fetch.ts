import { createClient, type QueryParams } from "next-sanity";
import { projectId, dataset, apiVersion } from "../env";

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  revalidate = 0,
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}) {
  return client.fetch<QueryResponse>(query, params, {
    next: {
      revalidate,
      tags,
    },
  });
}