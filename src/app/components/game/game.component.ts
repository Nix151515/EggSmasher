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
  mouseX;
  mouseY;
  sending = false;
  mouseListen;
  colorListen;
  endGameListen;
  eggColor;

  @HostListener('window:mousemove', ['$event'])
  showCoords(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    if (!this.isAttacker) {
      console.log('def');
      return;
    }
    this.mouseListen.unsubscribe();
    this.endGameListen.unsubscribe();
    if (this.sending) {
      this.moveEgg(this.mouseX, this.mouseY);
      // console.log('Atk', this.mouseX, this.mouseY)
      this.socketsService.sendMouseMove(this.opponentId, { x: this.mouseX, y: this.mouseY });
    }
  }

  constructor(public socketsService: SocketsService, public usersService: UsersService, public router: Router) {
    this.username = localStorage.getItem('username');
    this.opponentId = localStorage.getItem('opponentId');
    this.opponent = localStorage.getItem('opponent');
    // this.isAttacker = this.username.indexOf('a') !== -1;
    localStorage.getItem('isAttacker') === 'true' ? this.isAttacker = true : this.isAttacker = false;
    this.eggColor = this.isAttacker ? '#691414' : '#37176b';
  }

  ngOnInit(): void {
    console.log('attacks', this.isAttacker);
    this.mouseListen = this.socketsService.onMouseReceived()
      .subscribe((res: any) => {
        this.moveEgg(res.data.x, res.data.y);
      });
    this.colorListen = this.socketsService.onColorReceived()
      .subscribe((res: any) => {
        console.log(res);
        if (this.isAttacker) {
          this.egg2.nativeElement.style.backgroundColor = res.data;
        }
        else {
          this.egg.nativeElement.style.backgroundColor = res.data;
        }
      });
    this.endGameListen = this.socketsService.receiveFinish()
      .subscribe((res: any) => {
        console.log(res);
        if (res.data === true) {
          alert('You won');
        } else {
          alert('You lost');
        }
      });
  }

  startSending($event) {
    this.sending = true;
  }

  stopSending($event) {
    this.sending = false;
  }


  printEgg() {
    console.log(this.egg);
    console.log(this.egg2);
    console.log(window);
    console.log(this.eggColor);
  }

  moveEgg(x, y) {
    // this.egg.nativeElement.style.left = x - 50 + 'px';
    this.egg.nativeElement.style.left = 45 + '%';
    this.egg.nativeElement.style.top = y - 75 + 'px';

    if (y >= this.egg2.nativeElement.offsetTop - 70 && this.isAttacker) {
      const win = Math.random() >= 0.5;
      console.log('cioc');
      this.socketsService.sendFinish(this.opponentId, !win);
      if (win) {
        alert('You won');
      }
      else {
        alert('You lost');
      }
      this.stopSending(null);
      this.resetEggPosition();
    }
  }

  resetEggPosition() {
    this.egg.nativeElement.style.top = '100px';
  }

  setColor($event) {
    if (this.isAttacker) {
      this.egg.nativeElement.style.backgroundColor = this.eggColor;
      this.socketsService.sendColor(this.opponentId, this.eggColor);
    } else {
      this.egg2.nativeElement.style.backgroundColor = this.eggColor;
      this.socketsService.sendColor(this.opponentId, this.eggColor);
    }
    console.log($event);
  }

}
