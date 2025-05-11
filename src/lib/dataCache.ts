type CACHE_TAG = "user" | "categories";

export const getGlobalTag = (tag: CACHE_TAG) => {
  return `global : ${tag}` as const;
};

export const getIdTag = (tag: CACHE_TAG, id: string) => {
  return `id : ${id} - ${tag}` as const;
};
