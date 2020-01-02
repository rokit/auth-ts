import sgr from './jsonResponse';

export default class User {
  email: string;
  username: string;
  password: string;

  constructor(email: string, username: string, password: string) {
    this.email = email;
    this.username = username;
    this.password = password;
  }

  isValidEmail(context: string): boolean {
    if (this.email === "") {
      throw { status: 400, code: 2, context: `${context}Email`, data: "Please enter your email." };
    }
    return true;
  }

  isValidUsername(): boolean {
    if (this.username == "") {
      throw { status: 400, code: 3, context: "username", data: "Please enter a username." };
    }
    return true;
  }

  isValidPassword(context: string): boolean {
    if (this.password === "") {
      throw { status: 400, code: 4, context: `${context}Password`, data: "Please enter a password." };
    }
    return true;
  }

  isValidSignup() {
    this.isValidEmail("signup");
    this.isValidUsername();
    this.isValidPassword("signup");
  }

  isValidSignin() {
    this.isValidEmail("signin");
    this.isValidPassword("signin");
  }
}
