import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  url = "https://haisaciocnim.herokuapp.com/users";
  constructor(private http: HttpClient, private router : Router) { }

  getUsers() {
    return this.http.get(this.url);
  }
  getUser(id: string) {
    return this.http.get(this.url + '/' + id);
  }
  // to be replaced with user model
  postUser(data : any) {
    return this.http.post(this.url, data);
  }
}
