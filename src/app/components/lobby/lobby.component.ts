import { Component, OnInit } from '@angular/core';
import { SocketsService } from 'src/app/services/sockets.service';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})

export class LobbyComponent implements OnInit {

  username = '';
  accepted = false;
  listenToRequests;
  connectedUsers = [];
  constructor(public socketsService: SocketsService,
    public usersService: UsersService,
    public router: Router) {
    localStorage.removeItem('opponent')
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

    this.listenToRequests = this.socketsService.onRequestReceived()
      .subscribe((res: any) => {
        console.log('send data from', res)
        if (confirm("Play a game with " + res.data + '?')) {
          this.accepted = true;
          this.socketsService.sendRequestToPlayer(res.src, this.username)
          localStorage.setItem('opponentId', res.src)
          localStorage.setItem('opponent', res.data)
          this.listenToRequests.unsubscribe();
          this.router.navigate(['/game']);
          console.log('accepted')
        } else {
          console.log('canceled');
        }
      });
  }

  onUserClick(event) {
    event.socket_id ? this.socketsService.sendRequestToPlayer(event.socket_id, this.username) : {};
    console.log('user click', event)
  }






}
