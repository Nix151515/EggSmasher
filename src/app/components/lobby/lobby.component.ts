import { Component, OnInit } from '@angular/core';
import { SocketsService } from 'src/app/services/sockets.service';
import { UsersService } from 'src/app/services/users.service';
@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})

export class LobbyComponent implements OnInit {

  username = '';
  connectedUsers = [];
  constructor(public socketsService: SocketsService, public usersService: UsersService) {
    this.username = localStorage.getItem('username')
// later
    // this.usersService.getUsers().subscribe((res: any) => {
    //   res.forEach(user => {
    //     this.connectedUsers.push(user)
    //   });
    // })
  }

  ngOnInit(): void {

    this.socketsService
      .onNewUsers()
      .subscribe((data: any) => {
        console.log(data)
        this.connectedUsers.push(data);
      });

      this.socketsService
      .onDataReceived()
      .subscribe((data: any) => {
        console.log('send data from' ,data)
        if (confirm("Accept the invitation ?")) {
          console.log('accepted')
        } else {
          console.log('canceled');
        }
      });
  }

  onUserClick(event) {
    event.socket_id ? this.socketsService.sendDataToPlayer(event.socket_id, this.username) : {};
    console.log('user click', event)
  }
  





}
