import { Component, OnInit } from '@angular/core';
import { i18nMessages } from '../../TranslateLoader';
import { ToastService } from 'src/app/services/toaster/toast.service';
import { RequestService } from 'src/app/services/http/request.service';
import { Platform, NavController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SERVICES } from "../../constants/services";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
@Component({
  selector: 'app-register-client',
  templateUrl: './register-client.page.html',
  styleUrls: ['./register-client.page.scss'],
})
export class RegisterClientPage implements OnInit {
  registerClient: FormGroup;
  new_client = {
    names: '',
    lastnames: '',
    document: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirm_password: '',
    term_condition: false
  }
  constructor(
    public request: RequestService,
    private toast: ToastService,
    private navCtrl: NavController,
    public router: Router,
    private menu: MenuController,
    public formBuilder: FormBuilder
  ) {
    this.setting_form();
  }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.menu.enable(false, 'menu');
    this.menu.close(SERVICES.menuId);
  }

    // Almacena un nuevo cliente
    save_new_client() {
      this.request.postData('client/api/client_register', this.new_client, {}).then(data => {
        if (data.code == 1) {
          this.toast.presentToast(data.error, 'error-toast', 3000);
        } else if (data.code == 0) {
          this.toast.presentToast(data.message, 'info-toast', 3000);
          this.navCtrl.navigateForward('/login');
        }
      });
    }

    // Creación del formulario de registro con sus campos
    setting_form() {
      this.registerClient = this.formBuilder.group({
        names: ['', [Validators.required]],
        lastnames: ['', [Validators.required]],
        document: ['', [Validators.required]],
        email: ['', [
          Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}[^\\S]*$'),
          Validators.maxLength(100),
          Validators.minLength(5),
          Validators.required]],
        phone: ['', [
          Validators.pattern('[0-9]+'),
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.required
        ]],
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
        confirm_password: ['', [Validators.required]],
        term_condition: ['false', [Validators.requiredTrue]],
      });
    }

    // Validación de contraseñas iguales y campos
    validate_form() {
      if (!this.registerClient.invalid) {
        if (this.registerClient.get('password').value === this.registerClient.get('confirm_password').value) {
          this.save_new_client();
        } else {
          this.toast.presentToast('Las contraseñas no coinciden, inténtalo de nuevo', 'error-toast', 3000);
        }
      } else {
        if (this.registerClient.get('names').invalid) {
          this.toast.presentToast('El campo Nombres el obligatorio', 'error-toast', 3000);
        } else if (this.registerClient.get('lastnames').invalid) {
          this.toast.presentToast('El campo Apellidos es obligatorio', 'error-toast', 3000);
        } else if (this.registerClient.get('document').invalid) {
          this.toast.presentToast('El campo Documento es obligatorio', 'error-toast', 3000);
        } else if (this.registerClient.get('email').invalid) {
          this.toast.presentToast('El campo Correo electrónico es obligatorio', 'error-toast', 3000);
        } else if (this.registerClient.get('phone').invalid) {
          this.toast.presentToast('El campo Teléfono celular es obligatorio', 'error-toast', 3000);
        } else if (this.registerClient.get('username').invalid) {
          this.toast.presentToast('El campo Nombre de usuario es obligatorio', 'error-toast', 3000);
        } else if (this.registerClient.get('password').invalid) {
          this.toast.presentToast('El campo Contraseña es obligatorio', 'error-toast', 3000);
        } else if (this.registerClient.get('confirm_password').invalid) {
          this.toast.presentToast('El campo Confirmar contraseña es obligatorio', 'error-toast', 3000);
        } else if (this.registerClient.get('term_condition').invalid) {
          this.toast.presentToast('Debe aceptar los terminos y condiciones', 'error-toast', 3000);
        }
      }
    }

    // Función para colocar mensajes desde el html
    presentToast(message) {
      this.toast.presentToast(message, 'error-toast', 3000);
    }

    // Función para retroceder a la pagina anterio (login)
    returnPage() {
      this.navCtrl.navigateBack('login');
    }

}
