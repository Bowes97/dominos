
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { addDoc, collection, collectionData, deleteDoc, doc, DocumentData, DocumentReference, Firestore, getDocs, query, QuerySnapshot, setDoc, where } from "@angular/fire/firestore";
import { IProductRequest, IProductResponse } from '../../interface/product/product.interface';
import { IProfileResponse } from '../../interface/profile/profile.interface';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  constructor(
    private firestore: Firestore
  ) { }

  getByCategoryFB(categoryName: string): Promise<QuerySnapshot<DocumentData>> {
    const q = query(collection(this.firestore, "products"), where("category.path", "==", categoryName));  
    return getDocs(q);
  }
  
  getAllFB(): Observable<DocumentData[]> {
    return collectionData(collection(this.firestore, "products"), { idField: 'id' })
  }

  createFB(product: IProductRequest): Promise<DocumentReference<DocumentData>> {
    return addDoc(collection(this.firestore, "products"), product);
  }

  updateFB(product: IProductResponse, id: string): Promise<void> {
    return setDoc(doc(this.firestore, "products", id), product);
  }

  deleteFB(product: IProfileResponse): Promise<void> {
    return deleteDoc(doc(this.firestore, "products", product.id as any));
  }

  getByNameFB(name: string): Promise<QuerySnapshot<DocumentData>> {
    const q = query(collection(this.firestore, "products"), where("path", "==", name));  
    return getDocs(q);
  }

  
}
