import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import * as socketIo from 'socket.io-client';
// @Injectable({
//   providedIn: 'root'
// });

const SERVER_URL = 'http://192.168.0.171:3000';
// const SERVER_URL = 'http://localhost:3000/';

export class SocketsService {
  private socket;


  constructor() {
    this.initSocket();
  }

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
  }


  /* Username Sockets */

  /* Send your connection to server */
  public sendUsername(message: any): void {
    this.socket.emit('new_user_joined', message);
  }

  /* Listen to new connections */
  public onNewUsers(): Observable<any> {
    return new Observable<any>(observer => {
      // console.log(observer , 'connected')
      // if socket id ( getSession  ==  observer.sessionId)
      this.socket.on('new_user_joined', (data: any) => observer.next(data));
    });
  }

  public onUserLeave(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('user_leave', (data: any) => observer.next(data));
    })
  }

  /* Invitations */


  /* Send your request to server */
  public sendRequestToPlayer(dest: string, data: any, first: any): void {
    this.socket.emit('request', { dest, data, first });
  }

  /* Listen to requests */
  public onRequestReceived(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('request', (data: any) => observer.next(data));
    });
  }

  /* Mouse tracking sockets */

  /* Send your mouse to server */
  public sendMouseMove(dest: string, data: any): void {
    this.socket.emit('mouse_move', { dest, data });
  }

  /* Listen to move movements */
  public onMouseReceived(): Observable<any> {
    return new Observable<any>(observer => {
      // if socket id ( getSession  ==  observer.sessionId)
      this.socket.on('mouse_move', (data: any) => observer.next(data));
    });
  }



  /* Color changes */

  /* Send your color to server */
  public sendColor(dest: string, data: any): void {
    this.socket.emit('color_change', { dest, data });
  }

  /* Listen to color changes */
  public onColorReceived(): Observable<any> {
    return new Observable<any>(observer => {
      // if socket id ( getSession  ==  observer.sessionId)
      this.socket.on('color_change', (data: any) => observer.next(data));
    });
  }


  /* Send end game */
  public sendFinish(dest: string, data: any): void {
    this.socket.emit('finish', { dest, data });
  }

  public receiveFinish(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('finish', (data: any) => observer.next(data));
    });
  }
}
