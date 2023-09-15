import { EZSubmissionClient } from "../ezsubmission/client";

export class EZSubmissionSession {
    static get SESSION_KEY() { return "submissao_token_key"; }
  
    constructor(private ez: EZSubmissionClient) {
      this.ez.accessToken = this.getToken();
    }
  
    getToken() {
      return sessionStorage.getItem(EZSubmissionSession.SESSION_KEY);
    }
    setToken(token: string | null) {
      if (token) {
        sessionStorage.setItem(EZSubmissionSession.SESSION_KEY, token);
      } else {
        sessionStorage.removeItem(EZSubmissionSession.SESSION_KEY);
      }
      this.ez.accessToken = token;
    }
    getLoggedInUsername() {
      const token = this.getToken();
      let username = '';
      if (token) {
        const parts = token.split(".");
        const payload = parts[1];
        username = JSON.parse(atob(payload))["sub"];
      }
      return username;
    }

    isLoggedIn() {
      return this.getLoggedInUsername() !== '';
    }
  
    isAdmin() {
      const token = this.getToken();
      let resultIsAdmin = false;
      if (token) {
        const parts = token.split(".");
        const payload = parts[1];
        resultIsAdmin = JSON.parse(atob(payload))["admin"];
      }
      return resultIsAdmin;
    }
}
