import fetch from 'node-fetch';

type Auth = any;

class Authentication {
  urlPrefix: string;
  auth: Auth;

  constructor(urlPrefix: string, auth: Auth) {
    this.urlPrefix = urlPrefix;
    this.auth = auth;
  }

  async getToken() {
    const url = this.urlPrefix + '/auth/tokens';
    const body = JSON.stringify(this.auth);

    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body
    });

    return response.headers.get('x-subject-token');
  }

  async getIdentity(token: string) {
    const headers = {
      'X-Auth-Token': token,
      'content-type': 'application/json'
    };
    const response = await fetch(this.urlPrefix, {
      headers,
      method: 'GET'
    });

    return response.json();
  }
}

export default Authentication;
