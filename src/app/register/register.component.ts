import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email = '';
  pass = '';


  constructor(
    private auth: AngularFireAuth,
    private router:Router,
    
  ) { }

  ngOnInit(): void {
  }

  register(){
    this.auth.createUserWithEmailAndPassword(this.email, this.pass)
    .then(user =>{
      console.log(user)
      Swal.fire('Usuario Registrado')
      this.router.navigate(['login']);
      
    })
    .catch(err => console.log('Error user: ', err))
  }

  

}
