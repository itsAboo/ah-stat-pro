export interface User {
  id: string;
  username: string;
  name?: string;
  posts: string[];
  role: "admin" | "member";
  createdAt: Date;
  updatedAt: Date;
  accessiblePostIds: string[];
  accessRequest: {
    postId: string;
    status: string;
  }[];
}

export interface HandicapMovement {
  _id?: string;
  postId?: string;
  matches?: Match[];
  ahSide?: "HOME" | "AWAY";
  type: "HDP" | "OU";
  start: string;
  end: string;
  winCount?: number;
  lostCount?: number;
  drawCount?: number;
  winRate?: number;
  drawRate?: number;
  lostRate?: number;
  totalMatches?: number;
  last5MatchWinRate?: number;
  updatedAt?: string;
}

export interface Match {
  _id?: string;
  handicapMovementId?: string;
  home?: string;
  away?: string;
  league?: string;
  matchDay?: string;
  fullTimeScore?: string;
  result: "W" | "L" | "D" | "P";
}

export interface MostStatDetail {
  type: "HDP" | "OU";
  ahSide: string;
  start: string;
  end: string;
  winRate: number;
  drawRate: number;
  lostRate: number;
  totalMatches?: number;
}

export interface Post {
  id?: string;
  title: string;
  description?: string;
  handicapMovements?: HandicapMovement[];
  updatedAt?: string;
  author?: string;
  mostWin?: MostStatDetail;
  mostLost?: MostStatDetail;
  mostDraw?: MostStatDetail;
  mostHomeWin?: MostStatDetail;
  mostAwayWin?: MostStatDetail;
  mostOUWin?: MostStatDetail;
  access?: "public" | "private";
}

export interface Notification {
  id: string;
  sender: string;
  createdAt: Date;
  source: {
    post: {
      id: string;
      title: string;
    };
  };
  message: string;
  type: "access_request" | "access_approved" | "access_rejected";
  isRead: boolean;
  accessRequest: AccessRequest;
  recipientId: string;
}

export interface AccessRequest {
  id: string;
  postId: string;
  requesterId: string;
  status: "pending" | "approved" | "rejected";
  receiverId: string;
}

export interface PostAccess {
  postId: string;
  userId: string;
  grantedBy: string;
}

export interface PostAccessAccepted {
  id: string;
  name: string;
  approvedAt: Date | string;
}
