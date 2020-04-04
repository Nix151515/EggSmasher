import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LobbyComponent } from './components/lobby/lobby.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { GameComponent } from './components/game/game.component';


const routes: Routes = [
  {path : '', component: WelcomePageComponent},
  {path : 'lobby', component: LobbyComponent},
  {path : 'game', component: GameComponent},
  {path : '**', component: LobbyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
