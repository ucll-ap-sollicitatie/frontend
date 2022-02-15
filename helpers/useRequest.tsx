import useSwr from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const useRequest = (path: String, ms = 0) => {
  if (!path) throw new Error("Path is required");

  const url = `http://localhost:3001/${path}`;
  const { data, error } = useSwr(url, fetcher);

  return { data, error };
};
