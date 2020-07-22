import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/services/toaster/toast.service';
import { RequestService } from 'src/app/services/http/request.service';
import { Platform, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  id_user;
  userData = {
    user_id: ''
  };
  establishments = [];  
  constructor(
    public request: RequestService,
    private toast: ToastService,
    private navCtrl: NavController,
    public router: Router,
    private fcm: FCM
  ) { 
    this.id_user = localStorage.getItem('user_id');
  }

  ngOnInit() {
    this.fcm.getToken().then(token => {
      console.log(token);
    });
  }

  ionViewWillEnter(){
    this.getEstablishment();
  }

  getEstablishment(){
    this.userData.user_id = this.id_user;
    this.request.postData('establecimientos/api/get_establishment',this.userData, {}).then(data => {
      if(data.code == 0){
        this.establishments = data.data;
        this.toast.presentToast(data.message, "success-toast", 3000);
      }else{
        this.toast.presentToast(data.error, "info-toast", 3000);
      }
    });
  }

  select_establishment(id_establishment){
    console.log(id_establishment);
    this.router.navigate(["establishment", id_establishment]);
  }

}
