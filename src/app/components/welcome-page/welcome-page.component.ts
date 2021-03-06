import { Component, OnInit } from '@angular/core';
import { SocketsService } from 'src/app/services/sockets.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {

  username: '';
  constructor(public socketsService: SocketsService,
    public router: Router,
    public usersService: UsersService) { }

  ngOnInit(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('opponent');
  }

  setUsername() {
    if (this.username) {
      localStorage.setItem('username', this.username);
      this.socketsService.sendUsername(this.username);
      this.router.navigate(['/lobby']);
    }
  }
}
