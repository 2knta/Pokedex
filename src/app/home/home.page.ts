import { Component } from '@angular/core';
import {PokeApiService} from '../services/poke-api.service';
import {PokeList} from '../interfaces/poke-list';
import {Pokemon} from '../interfaces/pokemon';
import {Router} from '@angular/router';
import {FirebaseX} from '@ionic-native/firebase-x/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  pokemonList: PokeList;
  pokemon: Pokemon;
  userToken: string;
  userId: any;


  constructor(private http: PokeApiService, private router: Router, private firebaseX: FirebaseX) {
    this.getListFromService();
    // this.addTokenToBd();
   //  this.getNotificationData();
    this.addTokenToBd();
    this.createUser();
    this.getUserInfo();
  }



  addTokenToBd(){
      this.firebaseX.getId().then(resId => {
          this.firebaseX.getToken().then(resToken => {
              const body = {token: resToken};
              // tslint:disable-next-line:only-arrow-functions
              this.firebaseX.setDocumentInFirestoreCollection(resId, body, 'Registro', function(){}, function(){});
          });
      });
  }

  createUser(){
      // tslint:disable-next-line:only-arrow-functions
      this.firebaseX.createUserWithEmailAndPassword('alvaro@gmail.com', '654321').then();
  }
  getUserInfo(){
      this.firebaseX.getCurrentUser().then(res => {
         console.log('usuario --> ' + JSON.stringify(res));
      });
  }

  getListFromService(){
    this.http.getPokemonList()
        .then(res => {
          this.pokemonList = JSON.parse(res.data).results;
        });
  }

  goToDescription(url: string) {
    this.http.getPokemonDescription2(url)
        .then(res => {
          this.pokemon = JSON.parse(res.data);
          this.router.navigate(['/description'], {state: {info: this.pokemon}});
        });
  }
}

