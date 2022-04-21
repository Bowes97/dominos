import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  setDoc
} from "@angular/fire/firestore";
import { IOrderResponse } from '../../interface/order/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  changeBasket = new Subject<boolean>();
  
  constructor(
    private firestore: Firestore
  ) { }

  getAllFB(): Observable<DocumentData[]> {
    return collectionData(collection(this.firestore, "order"), { idField: 'id' })
  }

  createFB(order: IOrderResponse): Promise<DocumentReference<DocumentData>> {
    return addDoc(collection(this.firestore, "order"), order);
  }

  updateFB(order: IOrderResponse, id: string): Promise<void> {
    return setDoc(doc(this.firestore, "order", id), order);
  }

  deleteFB(order: IOrderResponse): Promise<void> {
    return deleteDoc(doc(this.firestore, "order", order.id as any));
  }
}
