import { SwiftAuth } from "./type";

class Authentication {
  urlPrefix: string;
  auth: { auth: SwiftAuth };

  constructor(urlPrefix: string, auth: { auth: SwiftAuth }) {
    this.urlPrefix = urlPrefix;
    this.auth = auth;
  }

  async getToken() {
    const url = this.urlPrefix + "/auth/tokens";
    const body = JSON.stringify(this.auth);

    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body,
    });

    return response.headers.get("x-subject-token");
  }

  async getIdentity(token: string) {
    const headers = {
      "X-Auth-Token": token,
      "content-type": "application/json",
    };
    const response = await fetch(this.urlPrefix, {
      headers,
      method: "GET",
    });

    return response.json();
  }
}

export default Authentication;
