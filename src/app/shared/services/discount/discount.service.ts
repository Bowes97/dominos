import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  QuerySnapshot,
  setDoc
} from "@angular/fire/firestore";
import { ref } from '@angular/fire/storage';
import { getDocs, query, where } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { IDiscountResponse } from '../../interface/discount/discount.interface';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  constructor(private firestore: Firestore) { }

  getAllFB(): Observable<DocumentData[]> {
    return collectionData(collection(this.firestore, "discount"), { idField: 'id' })
  }

  createFB(discount: IDiscountResponse): Promise<DocumentReference<DocumentData>> {
    return addDoc(collection(this.firestore, "discount"), discount);
  }

  updateFB(discount: IDiscountResponse, id: string): Promise<void> {
    return setDoc(doc(this.firestore, "discount", id), discount)
  }

  deleteFB(discount: IDiscountResponse): Promise<void> {
    return deleteDoc(doc(this.firestore , "discount", discount.id as string))
  }

  getByOneFB(discount: string): Promise<QuerySnapshot<DocumentData>>{
    const q = query(collection(this.firestore, "discount"), where ("path", "==", discount));
    return getDocs(q);
  }

  createId(): void{
    doc(collection(this.firestore, 'id')).id;
  }


}
