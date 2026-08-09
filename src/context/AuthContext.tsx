import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

interface AuthContextValue {
  token: string | null;
  userId: string | null;
  username: string | null;
  admin: boolean;
  loading: boolean;

  login: (
    token: string,
    userId: string,
    username: string,
    admin: boolean,
  ) => void;

  logout: () => void;

  //getToken: () => string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId"),
  );

  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username"),
  );

  const [admin, setAdmin] = useState<boolean>(
    localStorage.getItem("admin") === "true",
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = useCallback(
    (token: string, userId: string, username: string, admin: boolean) => {
      setToken(token);
      setUserId(userId);
      setUsername(username);
      setAdmin(admin);

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("admin", String(admin));
    },
    [],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setUsername(null);
    setAdmin(false);

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("admin");
  }, []);

  // const getToken = (): string => {
  //   return localStorage.getItem("token") ?? "";
  // };

  // const getUsername = (): string => {
  //   return localStorage.getItem("username") ?? "";
  // };

  // const getUserId = (): string => {
  //   return localStorage.getItem("userId") ?? "";
  // };

  // const getIsAdmin = (): string => {
  //   return localStorage.getItem("admin") ?? "";
  // };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        username,
        admin,
        loading,
        login,
        logout,
        // getToken,
        // getUsername,
        // getUserId,
        // getIsAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
