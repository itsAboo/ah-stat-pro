import { convertDDMMYYYtoDate } from "../util/transform";
import { handicapApi } from "../lib/axios";

interface HandicapMovementData {
  postId: string;
  start: string;
  end: string;
  type: "HDP" | "OU";
  ahSide: "HOME" | "AWAY";
}

interface MatchData {
  matchId?: string;
  postId: string;
  handicapMovementId: string;
  matchDay?: string;
  home?: string;
  away?: string;
  league?: string;
  fullTimeScore?: string;
  result: "W" | "L" | "P" | "D";
}

interface RemoveMatchesData {
  matchIds: string[];
  postId: string;
  handicapMovementId: string;
}

interface DeleteHandicapData {
  postId: string;
  handicapMovementId: string;
}

export const addHandicapMovement = async (data: HandicapMovementData) => {
  const response = await handicapApi.post("/", data);
  return response.data.message;
};

export const addMatch = async (data: MatchData) => {
  const response = await handicapApi.post(`/${data.handicapMovementId}/match`, {
    ...data,
    matchDay: convertDDMMYYYtoDate(data.matchDay!),
  });
  return response.data.message;
};

export const updateMatch = async (data: MatchData) => {
  const response = await handicapApi.patch(
    `/${data.handicapMovementId}/match/${data.matchId}`,
    data
  );
  return response.data.message;
};

export const deleteHandicap = async (data: DeleteHandicapData) => {
  const response = await handicapApi.delete(`/${data.handicapMovementId}`, {
    data,
  });
  return response.data.message;
};

export const removeMatches = async (data: RemoveMatchesData) => {
  const response = await handicapApi.patch(
    `/${data.handicapMovementId}/matches`,
    data
  );
  return response.data.message;
};
