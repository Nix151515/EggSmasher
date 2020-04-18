import { Component, OnInit, ViewChild } from '@angular/core';
import { SocketsService } from 'src/app/services/sockets.service';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})

export class LobbyComponent implements OnInit {

  @ViewChild('modal') modal;
  username = '';
  accepted = false;
  listenToRequests;
  connectedUsers = [];
  modalMessage = '';
  opponentData;
  constructor(public socketsService: SocketsService, public usersService: UsersService, public router: Router) {
    localStorage.removeItem('opponent');
    localStorage.removeItem('isAttacker');
    this.username = localStorage.getItem('username');
    this.usersService.getUsers().subscribe((users: []) => {
      this.connectedUsers.push(...users);
    });
  }

  ngOnInit(): void {

    this.socketsService
      .onNewUsers()
      .subscribe((data: any) => {
        console.log(data);
        this.connectedUsers.push(data);
      });

    this.socketsService
      .onUserLeave()
      .subscribe((data: any) => {
        console.log(data);
        this.connectedUsers = this.connectedUsers.filter(el =>  el.socket_id != data.socket_id)
      });

    this.listenToRequests = this.socketsService.onRequestReceived()
      .subscribe((res: any) => {
        console.log('send data from', res);
        this.opponentData = res;
        this.showModal('Vrei să joci cu ' + res.data + '?');
      });
  }

  onUserClick(event) {
    if (event.socket_id) {
      this.socketsService.sendRequestToPlayer(event.socket_id, this.username, true);
    }
    console.log('user click', event);
  }


  showModal(message) {
    console.log(this.modal)
    this.modalMessage = message;
    this.modal.nativeElement.style.display = "block";
  }

  closeModal() {
    this.modal.nativeElement.style.display = "none";
    this.modalMessage = '';
    console.log('not accepted');
  }

  play(res) {
    this.accepted = true;
    console.log(res);
    this.socketsService.sendRequestToPlayer(res.src, this.username, null);
    localStorage.setItem('opponentId', res.src);
    localStorage.setItem('opponent', res.data);
    res.first === true ? localStorage.setItem('isAttacker', 'true') : localStorage.setItem('isAttacker', 'false');
    this.listenToRequests.unsubscribe();
    this.router.navigate(['/game']);
    console.log('accepted');
  }





}
