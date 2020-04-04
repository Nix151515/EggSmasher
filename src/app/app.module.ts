import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { SocketsService } from './services/sockets.service';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { UsersService } from './services/users.service';
import { GameComponent } from './components/game/game.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    LobbyComponent,
    WelcomePageComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [SocketsService, UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
