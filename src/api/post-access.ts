import { PostAccess, PostAccessAccepted } from "../types";
import { postAccessApi } from "../lib/axios";

interface PostAccessData {
  postId: string;
  requesterId: string;
  accessRequestId: string;
}

export const createPostAccess = async (data: PostAccessData) => {
  const response = await postAccessApi.post("/", data);
  return response.data.message;
};

export const getPostAccesses = async () => {
  const response = await postAccessApi.get("/");
  return response.data.postAccesses as PostAccess[];
};

export const getPostAccessAccepted = async ({
  id,
  signal,
}: {
  id: string;
  signal: AbortSignal;
}) => {
  const response = await postAccessApi.get(`/accepted/${id}`, { signal });
  return response.data.postAccessAccepted as PostAccessAccepted[];
};

export const deletePostAccess = async (ids: string[]) => {
  const response = await postAccessApi.post("/delete-many", {
    postAccessIds: ids,
  });
  return response.data.message;
};
