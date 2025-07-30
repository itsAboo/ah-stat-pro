import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getToken } from "../util/auth";

interface SocketContextType {
  socket: Socket | null;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => getToken());
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      socket?.disconnect();
      setSocket(null);
      return;
    }

    const newSocket = io(import.meta.env.VITE_APP_SOCKET_URL, {
      auth: { token },
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, token, setToken }}>
      {children}
    </SocketContext.Provider>
  );
};
