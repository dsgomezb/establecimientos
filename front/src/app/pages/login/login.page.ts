import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { Platform, MenuController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from "@ngx-translate/core";
import { i18nMessages } from '../../TranslateLoader';
import { RequestService } from '../../services/http/request.service';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ToastService  } from '../../services/toaster/toast.service';
import { SERVICES } from "../../constants/services";
import { StorageService } from "../../storage.service";
import { Geolocation, Geoposition, GeolocationOptions  } from '@ionic-native/geolocation/ngx';
//import { SERVICES } from "../../constants/services";
//import { HttpClientModule, HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  lat:number
  lon:number
  total:string
  data;
  formGroup: any;
  userData = {
    username: '',
    password: ''
  };
  //options : GeolocationOptions;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    public request: RequestService,
    private toast: ToastService,
    private menu: MenuController,
    private router: Router,
    private navCtrl: NavController,
    public storageService: StorageService,
    public geolocation: Geolocation
  ) { 
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.translate.setDefaultLang("es");
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.menu.enable(false, 'menu');
    this.menu.close(SERVICES.menuId);
  }

  async login() {
    if(this.userData.username == '' || this.userData.password == ''){
      this.toast.presentToast(i18nMessages.General["errors"]["username_and_password"], "error-toast", 3000); //Ejemplo de como usar el translate desde typescript (se centraliza todo en el es.json)
    }else{
      this.request.postData('api/signin',this.userData, {}).then(data => {
        console.log(data);
        if(data.code == 1 || data.code == 2){
          this.toast.presentToast(data.error, "error-toast", 3000);
        }else if(data.code == 0){
          this.storageService.token_user = data.token;
          localStorage.setItem('token', data.token);
          localStorage.setItem('user_id', data.user_id);
          this.saveGeolocation();
          this.navCtrl.navigateForward('/home');
        }
        this.data = data;
       });
    }
  }

  saveGeolocation(){
    var position = {
      latitude: null,
      longitude: null,
      user: localStorage.getItem('user_id')
    };
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{
      position.latitude = geoposition.coords.latitude;
      position.longitude = geoposition.coords.longitude;
      this.request.postData('users/api/save_position_user',position, {}).then(data => {
      });
    });
  }

    // Función para dirigirse a la pagina de registro
    goRegister() {
      this.navCtrl.navigateForward('/register-client');
    }
}
