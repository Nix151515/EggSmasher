import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import * as socketIo from 'socket.io-client';
// @Injectable({
//   providedIn: 'root'
// });

const SERVER_URL = 'http://localhost:3000';

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

/* Invitations */

  
  /* Send your request to server */
  public sendRequestToPlayer(dest: string, data: any): void {
    this.socket.emit('request', { dest, data });
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

}
