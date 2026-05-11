import { createClient, type QueryParams } from "next-sanity";
import { projectId, dataset, apiVersion } from "../env";

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if you need statically generated pages to update instantly
});

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  revalidate = 3600, // Revalidate every hour by default
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}) {
  return client.fetch<QueryResponse>(query, params, {
    next: {
      revalidate: revalidate,
      tags: tags,
    },
  });
}