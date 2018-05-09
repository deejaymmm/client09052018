import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {User} from './user';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserService{
   
    private url = "http://localhost:8080/users/";
    constructor(private http: HttpClient){ }
      
    getUsers(){
        return this.http.get(this.url);
    }
  
    createUser(user: User){
        return this.http.post(this.url, user); 
    }
    updateUser(id: number, user: User) {
        const urlParams = new HttpParams().set("id", id.toString());
        //return this.http.put(this.url, user, { params: urlParams});
        return this.http.put(this.url+id.toString(), user, { params: urlParams});
    }
    deleteUser(id: number){
        const urlParams = new HttpParams().set("id", id.toString());
        //return this.http.delete(this.url, { params: urlParams});
        return this.http.delete(this.url+id.toString(), { params: urlParams});
    }
    userLogin(){
        return this.http.get(this.url+'login');
    }
    userLogout(){
        return this.http.get(this.url+'logout');
    }
    userGoogle(){
        const headers = new HttpHeaders({ 
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
            'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
            'Access-Control-Allow-Credentials': 'true'
         });
        return this.http.get(this.url+'google', { headers: headers });
    }
}