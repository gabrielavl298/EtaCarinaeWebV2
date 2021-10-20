import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = '';
  pass = '';

  constructor(
    private auth: AngularFireAuth,
    private router:Router,
  ) { }

  ngOnInit(): void {
  }

  customLogin(){
    this.auth.signInWithEmailAndPassword(this.email, this.pass)
    .then(res => {
      console.log(res);
      this.router.navigate(['']);
    })
    .catch(err => console.log('Error cl: ', err));
  }
}
