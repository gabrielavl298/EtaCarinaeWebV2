import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseDataService, Producto } from 'src/app/firebase-data.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import { ConditionalExpr } from '@angular/compiler';
import { finalize } from 'rxjs/operators';

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
  public uploadPercent: Observable<number>;
  public urlImage: Observable<string>;
  constructor(
    private router:Router,
    public auth: AngularFireAuth,
    firestore: AngularFirestore,
    public formBuilder: FormBuilder,
    public firebaseService: FirebaseDataService,
    private storage: AngularFireStorage
  ) {
    this.productoForm = formBuilder.group({
      nombre: ['', [Validators.required]],
      id_empresa: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      titulo: ['', [Validators.required]],
      imageURL:['', [Validators.required]]
    })
    this.filtro= [];
    this.emailauth='';
    this.uploadPercent = new Observable<number>();
    this.urlImage = new Observable<string>();

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

  
  public onUpload(e: any){
    console.log("Entro aqui", e)

    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = this.emailauth + `/img_${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    //this.uploadPercent = task.percentageChanges();

    task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();

  }

  async OnSubmit() {
    let url = (<HTMLInputElement>document.getElementById("imageURL")).value;
    console.log("URL image: ", url);
    const tempProducto: Producto = {
      nombre: this.productoForm.value.nombre,
      id_empresa: this.emailauth,
      descripcion: this.productoForm.value.descripcion,
      precio: Number(this.productoForm.value.precio),
      titulo:this.productoForm.value.titulo,
      image: (<HTMLInputElement>document.getElementById("imageURL")).value
    }
    console.log("Producto model: ", tempProducto);
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
      image:'',
      imageURL: ''
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
