import { Post } from "../types";
import { postApi } from "../lib/axios";

interface EditPostData {
  postId: string;
  title?: string;
  description?: string;
  access?: "public" | "private";
}

export const createPost = async (data: Post) => {
  const response = await postApi.post("/", data);
  return response.data as Post;
};

export const getPosts = async ({
  signal,
  maxPerPage,
  page,
}: {
  signal: AbortSignal;
  maxPerPage?: number;
  page?: number;
}) => {
  const response = await postApi.get(
    `/?page=${page}&maxPerPage=${maxPerPage}`,
    { signal }
  );
  return response.data.posts as { posts: Post[]; pageCount: number };
};

export const getPost = async ({
  id,
  signal,
}: {
  id: string;
  signal: AbortSignal;
}) => {
  const response = await postApi.get(`/${id}`, { signal });
  return response.data.post as Post;
};

export const getMyPosts = async ({
  signal,
  page = 1,
  maxPerPage,
}: {
  signal: AbortSignal;
  page?: number;
  maxPerPage?: number;
}) => {
  const response = await postApi.get(
    `/my-posts/?page=${page}&maxPerPage=${maxPerPage}`,
    { signal }
  );
  return response.data.posts as { posts: Post[]; pageCount: number };
};

export const editPost = async (data: EditPostData) => {
  const response = await postApi.patch("/", data);
  return response.data.message;
};

export const deletePost = async ({ postId }: { postId: string }) => {
  const response = await postApi.delete(`/${postId}`);
  return response.data.message;
};
