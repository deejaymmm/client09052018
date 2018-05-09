import {TemplateRef, ViewChild} from '@angular/core';
import {Component, OnInit} from '@angular/core';
import {User} from './user';
import {UserService} from './user.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
  
@Component({ 
    selector: 'app-root', 
    templateUrl: './app.component.html',
    providers: [UserService]
}) 
export class AppComponent implements OnInit {
    //типы шаблонов
    @ViewChild('readOnlyTemplate') readOnlyTemplate: TemplateRef<any>;
    @ViewChild('editTemplate') editTemplate: TemplateRef<any>;
      
    editedUser: User;
    users: Array<User>;
    isNewRecord: boolean;
    statusMessage: string;
      
    constructor(private serv: UserService) {
        this.users = new Array<User>();
    }
      
    ngOnInit() {
        this.loadUsers();
    }
      
    //загрузка пользователей
    private loadUsers() {
        this.serv.getUsers().subscribe((data: User[]) => {
                this.users = data;  
            });
    }
    // добавление пользователя
    addUser() {
        this.editedUser = new User((this.users.length==0) ? 0 : this.users[this.users.length - 1].Id+1,"","","");
        this.users.push(this.editedUser);
        this.isNewRecord = true;
    }
   
    // редактирование пользователя
    editUser(user: User) {
        this.editedUser = new User(user.Id, user.Username, user.Password, user.Email);
    }
    // загружаем один из двух шаблонов
    loadTemplate(user: User) {
        if (this.editedUser && this.editedUser.Id == user.Id) {
            return this.editTemplate;
        } else {
            return this.readOnlyTemplate;
        }
    }
    // сохраняем пользователя
    saveUser() {
        if (this.isNewRecord) {
            // добавляем пользователя
            this.serv.createUser(this.editedUser).subscribe(data => {
                this.statusMessage = 'Данные успешно добавлены',
                this.loadUsers();
            }, error => { 
                this.statusMessage = 'Такой пользователь уже существует',
                this.loadUsers(); 
            });
            this.isNewRecord = false;
            this.editedUser = null;
        } else {
            // изменяем пользователя
            this.serv.updateUser(this.editedUser.Id, this.editedUser).subscribe(data => {
                this.statusMessage = 'Данные успешно обновлены',
                this.loadUsers();
            }, error => { 
                this.statusMessage = 'Такой пользователь уже существует', 
                this.loadUsers();
            });
            this.editedUser = null;
        }
    }
    // отмена редактирования
    cancel() {
        // если отмена при добавлении, удаляем последнюю запись
        if (this.isNewRecord) {
            this.users.pop();
            this.isNewRecord = false;
        }
        this.editedUser = null;
    }
    // удаление пользователя
    deleteUser(user: User) {
        this.serv.deleteUser(user.Id).subscribe(data => {
            this.statusMessage = 'Данные успешно удалены',
            this.loadUsers();
        });
    }

    login(){
        this.serv.userLogin().subscribe(data => { console.log(JSON.stringify(data)); } );
    }
    logout(){
        this.serv.userLogout().subscribe(data => { console.log(JSON.stringify(data)); } );
    }
    google(){
        this.serv.userGoogle().subscribe(data => { console.log(JSON.stringify(data)); } );
    }
}