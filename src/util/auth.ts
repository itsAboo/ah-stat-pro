export const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return JSON.parse(token);
  } catch (error) {
    console.warn("Invalid token in localStorage:", error);
    localStorage.removeItem("token"); 
    return null;
  }
};

export const addToken = (token: string) => {
  localStorage.setItem("token", JSON.stringify(token));
};

export const removeToken = () => {
  return localStorage.removeItem("token");
};
