import { EZSubmission } from "../ezsubmission/client";

export class SubmissionSession {
    static get SESSION_KEY() { return "submissao_token_key"; }
  
    constructor(private ez: EZSubmission) {
      this.ez.accessToken = this.getToken();
    }
  
    getToken() {
      return sessionStorage.getItem(SubmissionSession.SESSION_KEY);
    }
    setToken(token: string | null) {
      if (token) {
        sessionStorage.setItem(SubmissionSession.SESSION_KEY, token);
      } else {
        sessionStorage.removeItem(SubmissionSession.SESSION_KEY);
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
