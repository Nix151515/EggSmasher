import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { SocketsService } from 'src/app/services/sockets.service';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  @ViewChild('egg') egg;
  @ViewChild('egg2') egg2;
  opponent = '';
  opponentId = '';
  username = '';
  isAttacker;
  timeout;
  getMousePosition;
  mouseX;
  mouseY;
  sending = false;
  mouseListen;

  @HostListener('window:mousemove', ['$event'])
  showCoords(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    if(!this.isAttacker && !this.mouseListen){
      this.mouseListen = this.socketsService.onMouseReceived()
      .subscribe((res: any) => {
        console.log(res)
      })
    }

    if (this.sending) {
      console.log(this.mouseX, this.mouseY)
      if (this.isAttacker) {
        console.log('Atk')
        this.moveEgg(this.mouseX, this.mouseY)
        this.socketsService.sendMouseMove(this.opponent, { x: this.mouseX, y: this.mouseY })
      }
    }
  }

  constructor(public socketsService: SocketsService,
    public usersService: UsersService,
    public router: Router) {
    this.username = localStorage.getItem('username');
    this.opponentId = localStorage.getItem('opponentId');
    this.opponent = localStorage.getItem('opponent')
    this.isAttacker = this.username.indexOf('a') != -1;
  }

  ngOnDestroy() {
    clearInterval(this.getMousePosition);
  }

  ngOnInit(): void {
    console.log('attacks', this.isAttacker)
    console.log(this.username, this.username.indexOf('a'))
  }

  startSending($event) {
    this.sending = true;
  }

  stopSending($event) {
    this.sending = false;
    // console.log('stop send')
    // clearInterval(this.timeout)
  }


  printEgg() {
    console.log(this.egg)
    console.log(this.egg2)
    console.log(window)
  }

  moveEgg(x, y) {
    // this.egg.nativeElement.style.left = x - 50 + 'px';
    this.egg.nativeElement.style.left = 45 + '%';
    this.egg.nativeElement.style.top = y - 75 + 'px';
    if (y >= this.egg2.nativeElement.offsetTop - 75) {
      console.log('cioc')
      this.stopSending(null);
    }

  }
  // takeScreenSize() {
  //   console.log(window)
  // }
}
