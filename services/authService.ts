
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  isVerified: boolean;
}

const USERS_KEY = 'cartagenes_users';
const SESSION_KEY = 'cartagenes_session';

export const authService = {
  // Simula o cadastro no banco de dados
  register: (name: string, email: string, phone: string, address: string, pass: string): { success: boolean; message: string } => {
    const usersStr = localStorage.getItem(USERS_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    if (users.some(u => u.email === email)) {
      return { success: false, message: 'Este e-mail já está cadastrado.' };
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      address,
      password: pass, // Em um app real, isso seria criptografado!
      isVerified: false // Começa como não validado
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { success: true, message: 'Cadastro realizado com sucesso!' };
  },

  // Função para simular o clique no link do email
  verifyEmail: (email: string): boolean => {
    const usersStr = localStorage.getItem(USERS_KEY);
    if (!usersStr) return false;
    
    let users: User[] = JSON.parse(usersStr);
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) return false;

    users[userIndex].isVerified = true;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  },

  // Simula o login
  login: (email: string, pass: string): { success: boolean; user?: User; message: string } => {
    const usersStr = localStorage.getItem(USERS_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    const user = users.find(u => u.email === email && u.password === pass);

    if (user) {
      // Salva sessão
      const { password, ...userWithoutPass } = user;
      localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutPass));
      return { success: true, user: userWithoutPass, message: 'Login realizado.' };
    }

    return { success: false, message: 'E-mail ou senha inválidos.' };
  },

  // Simula login social com Google
  loginWithGoogle: (): Promise<{ success: boolean; user: User }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: 'google-user-123',
          name: 'Usuário Google',
          email: 'usuario@gmail.com',
          isVerified: true // Contas Google já vêm verificadas
        };
        // Salva sessão
        localStorage.setItem(SESSION_KEY, JSON.stringify(mockUser));
        resolve({ success: true, user: mockUser });
      }, 1000); // Delay simulado
    });
  },

  // Simula recuperação de senha
  resetPassword: (email: string): { success: boolean; message: string } => {
    const usersStr = localStorage.getItem(USERS_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    
    const exists = users.some(u => u.email === email);
    
    if (exists) {
        return { success: true, message: `Um link de recuperação foi enviado para ${email}.` };
    } else {
        // Por segurança, muitas vezes dizemos que enviamos mesmo se não existir, 
        // mas aqui vamos ser diretos para o teste.
        return { success: false, message: 'E-mail não encontrado em nossa base.' };
    }
  },

  // Recupera usuário logado
  getCurrentUser: (): User | null => {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    return sessionStr ? JSON.parse(sessionStr) : null;
  },

  // Logout
  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  }
};
