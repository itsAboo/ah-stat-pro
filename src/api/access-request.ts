import { AccessRequest } from "../types";
import { accessRequestApi } from "../lib/axios";

interface SendAccessRequestData {
  userId: string;
  postId: string;
}

export const sendAccessRequest = async (data: SendAccessRequestData) => {
  const response = await accessRequestApi.post("/", data);
  return response.data.message;
};

export const getAccessesRequest = async () => {
  const response = await accessRequestApi.get("/");
  return response.data.accessRequest as AccessRequest[];
};

export const rejectAccessRequest = async (accessRequestId: string) => {
  const response = await accessRequestApi.patch(`/${accessRequestId}/reject`);
  return response.data.message;
};
