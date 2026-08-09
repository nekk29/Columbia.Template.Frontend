import type { LoginResultModel } from "@/features/users/models/LoginResultModel";

const sessionKey = "session";

export interface AuthToken extends LoginResultModel {
  stored_at: number;
}

export class AuthService {
  static authenticate(result: LoginResultModel) {
    const storedAt = Date.now();
    const authToken: AuthToken = {
      stored_at: storedAt,
      ...result
    };

    localStorage.setItem(sessionKey, JSON.stringify(authToken));
  }

  static isAuthenticated(): boolean {
    const authToken = AuthService.getAuthToken();
    if (!authToken) {
      return false;
    }

    try {
      const now = Date.now();
      const storedAt = +new Date(authToken.stored_at);
      const expiresAt = storedAt + ((authToken.expires_in - 10) * 1000);

      return now < expiresAt;
    } catch {
      return false;
    }
  }

  static getAuthToken(): AuthToken | null | undefined {
    const authToken = localStorage.getItem(sessionKey);

    if (authToken)
      return JSON.parse(authToken);

    return null;
  }

  static getToken(): string | null | undefined {
    const authToken = AuthService.getAuthToken();
    return authToken?.access_token;
  }

  static logout() {
    localStorage.removeItem(sessionKey);
  }
}
