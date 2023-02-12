import apolloClient from "./apollo.client";
import {gql} from "@apollo/client";

class AuthService {
  private static readonly TOKEN_KEY = 'auth_token';

  public async login(email: string, password: string) {
    if (this.isLoggedIn()) throw new Error('You already login');

    const res = await apolloClient.mutate({
      mutation: gql`
          mutation Login($email: String!, $password: String!) {
              login(input: {email: $email, password: $password})
          }
      `,
      variables: {
        email: email,
        password: password
      }
    });
    this.storeToken(res.data.login);
  }

  public async register(email: string, password: string, repeatPassword: string) {
    if (this.isLoggedIn()) throw new Error('You already login');
    const res = await apolloClient.mutate({
      mutation: gql`
          mutation Register($email: String!, $password: String!, $repeatPassword: String!) {
              register(input: {email: $email, password: $password, repeatPassword: $repeatPassword})
          }
      `,
      variables: {
        email: email,
        password: password,
        repeatPassword: repeatPassword,
      }
    });
    this.storeToken(res.data.register);
  }

  public isLoggedIn(): boolean {
    return localStorage.getItem(AuthService.TOKEN_KEY) !== null;
  }

  public logout() {
    localStorage.removeItem(AuthService.TOKEN_KEY);
  }

  public getToken(): string {
    const token = localStorage.getItem(AuthService.TOKEN_KEY);
    return (token === null) ? '' : token;
  }

  private storeToken(token: string) {
    localStorage.setItem(AuthService.TOKEN_KEY, token);
  }
}

const authService = new AuthService();

export default authService;
