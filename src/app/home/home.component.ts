import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseDataService, Producto } from 'src/app/firebase-data.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public productoForm: FormGroup;
  public emailauth;
  public observableProducto: Observable<Producto[]>;
   filtro: Producto[] ;
  constructor(
    private router:Router,
    public auth: AngularFireAuth,
    firestore: AngularFirestore,
    public formBuilder: FormBuilder,
    public firebaseService: FirebaseDataService,
  ) {
    this.productoForm = formBuilder.group({
      nombre: ['', [Validators.required]],
      id_empresa: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      titulo: ['', [Validators.required]],
      image:['', [Validators.required]]
    })
    this.filtro= [];
    this.emailauth='';
    this.observableProducto = this.firebaseService.GetProducto();
    this.observableProducto.forEach(element=> {
      for(var i = 0; i<element.length; i++) {
        
        if(element[i].id_empresa==this.emailauth){
          this.filtro[i]=element[i];

        }
      }
    })
   }

  ngOnInit(): void {
    
    this.auth.user.forEach(element=>{
      console.log(element?.email);
      if(element?.email){
        this.emailauth=element.email;
      }
     console.log("Filtro: ",this.filtro);
    })
    
  }

  async OnSubmit() {

    const tempProducto: Producto = {
      nombre: this.productoForm.value.nombre,
      id_empresa: this.emailauth,
      descripcion: this.productoForm.value.descripcion,
      precio: Number(this.productoForm.value.precio),
      titulo:this.productoForm.value.titulo,
      image:this.productoForm.value.titulo
    }
    await this.firebaseService.AddProducto(tempProducto);
    Swal.fire('Producto Agregado!');
    this.clearForm();
    
    
  }

  clearForm(){
    this.productoForm = this.formBuilder.group({
      nombre: '',
      id_empresa: '',
      descripcion: '',
      precio: '',
      titulo:'',
      image:''
    })
  }

  ShowConfirm(item: Producto) {
    this.firebaseService.DeleteProducto(item);
    Swal.fire('Producto Borrado Recarga la pagina!');
    
 }
  logout(){
    this.auth.signOut();
  }
}
