import axios from "axios";

export interface EZAnswer {
  answer: string,
  question_index: number,
  submission_type: string,
  question_type: string,
  assignment_url: string

};
export function createSingleAnswer(answer: string, assignmentUrl: string): EZAnswer {
  return {
    answer: answer,
    question_index: 0,
    submission_type: "single",
    question_type: "code",
    assignment_url: assignmentUrl
  };
}

export class EZSubmission {
    public accessToken: string | null;

    constructor(private apiUrl: string) {
      this.accessToken = null;
    }

    _config() {
      if (this.accessToken) {
        return {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        };
      } else {
        return {}
      }
    }

    login(username: string, password: string) {
      return axios
        .post(`${this.apiUrl}/login`, { username, password })
        .then((response) => {
          this.accessToken = response.data.access_token;
          return response;
        });
    }
    getLatestAnswers(assignmentUrl: string, username: string) {
      return axios.post(`${this.apiUrl}/answers/latest`, { assignment_url: assignmentUrl, username }, this._config());
    }
    submit(answer: EZAnswer) {
      return axios.post(`${this.apiUrl}/submissions`, answer, this._config());
    }
  }
  