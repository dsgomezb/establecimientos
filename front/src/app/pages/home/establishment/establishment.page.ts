import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform, NavController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { RequestService } from 'src/app/services/http/request.service';
import { ToastService } from 'src/app/services/toaster/toast.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { BehaviorSubject } from 'rxjs';
import { CartModalPage } from '../../cart-modal/cart-modal.page';
import { Element } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-establishment',
  templateUrl: './establishment.page.html',
  styleUrls: ['./establishment.page.scss'],
})
export class EstablishmentPage implements OnInit {
  cart = [];
  products2 = [];
  cartItemCount: BehaviorSubject<number>;

  @ViewChild('cart',{static: false, read: ElementRef})fab: ElementRef;

  id_establishment = {
    id_establishment: ''
  };
  data_establishment = {
    name_establecimiento: null,
  };
  products = [];
  constructor(
    public activedRoute: ActivatedRoute,
    private platform: Platform,
    private translate: TranslateService,
    public request: RequestService,
    private toast: ToastService,
    private navCtrl: NavController,
    public router: Router,
    private cartService: CartService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.products2 = this.cartService.getProducts();
    this.cart = this.cartService.getCart();
    this.cartItemCount = this.cartService.getCartItemCount();
  }

  addToCart(product){
    this.animateCSS('tada');
    this.cartService.addProduct(product);
  }

  async openCart(product){
    let modal = await this.modalCtrl.create({
      component: CartModalPage,
      cssClass: 'cart-modal'
    });
    modal.present();
  }

  animateCSS(animationName, keepAnimated = false){
    const node = this.fab.nativeElement;
    node.classList.add('animated', animationName);
    function handleAnimationEnd(){
      if(!keepAnimated){
        node.classList.remove('animated', animationName);
      }
      node.removeEventListener('animationend', handleAnimationEnd);
    }
    node.addEventListener('animationend', handleAnimationEnd);
  }

  ionViewWillEnter(){
    var id_establishment;
    id_establishment = this.activedRoute.snapshot.params.id;
    if(id_establishment){
      this.getInfoEstablishment(id_establishment);
      this.getProductsEstablishment(id_establishment);
    }
  }

  getInfoEstablishment(id_establishment){
    this.id_establishment.id_establishment = id_establishment;
    this.request.postData('establecimientos/api/get_establishment_info', this.id_establishment, {}).then(data => {
      if(data.code == 1){
        this.toast.presentToast(data.error, "error-toast", 3000);
      }else if(data.code == 0){
        this.data_establishment.name_establecimiento = data.data[0].name_establecimiento;
      }
    });
  }

  getProductsEstablishment(id_establishment){
    this.id_establishment.id_establishment = id_establishment;
    this.request.postData('establecimientos/api/get_products_establishment', this.id_establishment, {}).then(data => {
      if(data.code == 1){
        this.toast.presentToast(data.error, "error-toast", 3000);
      }else if(data.code == 0){
        this.products = data.data;
      }
    });
  }
}
