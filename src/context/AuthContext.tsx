import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import api from "../services/api";

interface User {
  corretor_id: number;
  nome_completo: string;
  email: string;
  telefone: string;
  cpf: string;
  perfil: "corretor" | "administrador";
  data_cadastro: string;
}

interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUserFromStorage() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await api.get<User>("/auth/profile");
          setUser(data);
        } catch (error) {
          console.log("Sessão expirada ou inválida");
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    }
    loadUserFromStorage();
  }, []);

  const login = async (email: string, senha: string): Promise<void> => {
    const { data } = await api.post<{ access_token: string; user: User }>(
      "/auth/login",
      { email, senha }
    );
    localStorage.setItem("token", data.access_token);
    setUser(data.user);
  };

  const logout = async (): Promise<void> => {
    await api.post("/auth/logout");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export default AuthContext;
