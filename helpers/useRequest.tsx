import useSwr from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const useRequest = (path: String) => {
  if (!path) throw new Error("Path is required");

  const url = `${process.env.NEXT_PUBLIC_API_URL}/${path}`;
  const { data, error } = useSwr(url, fetcher);

  return { data, error };
};
