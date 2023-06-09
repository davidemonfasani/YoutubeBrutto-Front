import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private router: Router,
    private http: HttpClient,
    public auth: UserAuthService,
    private dialogS : DialogService,
    private formBuilder: FormBuilder,
  ) {
  this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      password: ['', Validators.required],
      image: [null],
      banner: ['', Validators.required],
    });

  }
  username = ''
  cognome = ''
  email = ''
  password = ''
  nome = ''
  image : any

  goLogin() {
    this.dialogS.goLogin()
  }

  goHomepage(){
    this.router.navigateByUrl('/homepage')
  }


  selectedFile: File | null = null

onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
}


tryRegister() {
  console.log('banner',this.registerForm.value.banner )
  const body = {
    nome: this.registerForm.value.nome,
    cognome: this.registerForm.value.cognome,
    email: this.registerForm.value.email,
    password: this.registerForm.value.password,
    username: this.registerForm.value.username,
    linkppic: this.registerForm.value.image,
    banner: this.registerForm.value.banner
  };

  this.auth.register(body);
}
}



