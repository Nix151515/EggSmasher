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
  @ViewChild('modal') modal;
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
  isMobile;
  eggHit = false;
  modalMessage = '';

  @HostListener('window:mousemove', ['$event'])
  showCoords(event: MouseEvent) {
    if (!this.isMobile) {
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
  }

  @HostListener('window:touchmove', ['$event'])
  showCoords2(event: TouchEvent) {
    if (this.isMobile) {
      let touchLocation = event.targetTouches[0];
      this.mouseX = touchLocation.clientX;
      this.mouseY = touchLocation.clientY;
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
  }

  constructor(public socketsService: SocketsService, public usersService: UsersService, public router: Router) {
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
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
        this.egg.nativeElement.style.top = this.egg2.nativeElement.offsetTop;
        setTimeout(() => {
          if (res.data === true) {
            // alert('L-ai luat');
            this.showModal('L-ai luat')
          } else {
            // alert('Te-a facut');
            this.showModal('Te-a facut');
          }
        }, 50);
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

    if (y >= this.egg2.nativeElement.offsetTop - 70 && this.isAttacker && this.eggHit === false) {
      this.eggHit = true;
      const win = Math.random() >= 0.5;
      console.log('cioc');
      this.socketsService.sendFinish(this.opponentId, !win);
      setTimeout(() => {
        if (win) {
          this.showModal('L-ai spart');
          // alert('L-ai spart !');
        }
        else {
          this.showModal('Te-a spart');
          // alert('Te-a spart');
        }
        this.stopSending(null);
      }, 50);


    }
  }

  resetEggPosition() {
    this.egg.nativeElement.style.top = '100px';
    this.eggHit = false;
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


  // Modal Methods 
  showModal(message) {
    console.log(this.modal)
    this.modalMessage = message;
    this.modal.nativeElement.style.display = "block";
  }

  closeModal() {
    this.modal.nativeElement.style.display = "none";
    this.modalMessage = '';
    this.resetEggPosition();
  }

}
