import HTTPService from "../httpService";
import environment from "../../environment";
// import { useAuthState } from "../../contexts/AuthContext";

interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginUserDto {
  email: string;
  password: string;
}

export default class AuthService {
  static registerUser(data: CreateUserDto) {
    const response = HTTPService.post(
      `${environment.apiUrl}${environment.createUserUrl}`,
      data
    );
    console.log(response);
  }

  static loginUser(data: LoginUserDto) {
    console.log(data);
    const response = HTTPService.post(
      `${environment.apiUrl}${environment.loginUserUrl}`,
      data
    );
    console.log(response);
  }
}
