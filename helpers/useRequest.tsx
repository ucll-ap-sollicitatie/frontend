import useSwr from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json())

export const useRequest = (path: String) => {
  if (!path) throw new Error("Path is required");

  const url = `http://localhost:3001/${path}`;
  const { data, error } = useSwr(url, fetcher);

  return { data, error };
};
