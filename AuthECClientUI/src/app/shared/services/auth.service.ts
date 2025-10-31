import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TOKEN_KEY } from '../constants';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient) { }

  createUser(formData: any) {
    //WARNING!
    //default value for Role, Gender, Age, LibraryID?
    //instead of registration form, there should some other
    //form to update these details of the user
    formData.role = "Teacher"
    formData.gender = "Female"
    formData.age = 35
    return this.http.post(environment.apiBaseUrl + '/signup', formData)
  }

  signin(formData: any) {
    return this.http.post(environment.apiBaseUrl + '/signin', formData)
  }

  isLoggedIn() {
    return this.getToken() != null ? true : false;
  }

  deleteToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  getClaims() {
    return JSON.parse(window.atob(this.getToken()!.split('.')[1]));
  }
}
