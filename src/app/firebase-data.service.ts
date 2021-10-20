import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask, createUploadTask } from '@angular/fire/compat/storage';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Producto {
  id?: string;
  nombre:string;
  id_empresa:string;
  descripcion:string;
  precio:number;
  titulo:string;
  image:string;
}
@Injectable({
  providedIn: 'root'
})
export class FirebaseDataService {
  private productoCollection: AngularFirestoreCollection<Producto>;
  private producto: Observable<Producto[]>;
  constructor(private afs: AngularFirestore, private storage: AngularFireStorage) { 

    this.productoCollection = this.afs.collection<Producto>('productoInfo');
    this.producto = this.productoCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data};
        });
      })
    );
  }

  // ---------------------- PRODUCTO --------------------------
  GetProducto(): Observable<Producto[]> {
    return this.producto;
  }

  AddProducto(p: Producto): Promise<DocumentReference>{
    return this.productoCollection.add(p);
  }
  
  DeleteProducto(p: Producto): Promise<void>{
    return this.productoCollection.doc(p.id).delete();
  }

  public tareaCloudStorage(nombreArchivo: string, datos: any) {
    return this.storage.upload(nombreArchivo, datos);
  }
  public referenciaCloudStorage(nombreArchivo: string) {
    return this.storage.ref(nombreArchivo);
  }
}
