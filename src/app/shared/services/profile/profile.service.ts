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
  getDocs,
  query,
  QuerySnapshot,
  setDoc,
  where
} from "@angular/fire/firestore";
import { updateDoc } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { IProfileResponse } from '../../interface/profile/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private firestore: Firestore
  ) { }

  getAllFB(): Observable<DocumentData[]> {
    return collectionData(collection(this.firestore, "feedback"), { idField: 'id' } )
  }
  deleteFB(feedback: any): Promise<void> {
    return deleteDoc(doc(this.firestore , "discount", feedback.id as string))
  }
  deleteFBFeedBack(feedback: any): Promise<void> {
    return deleteDoc(doc(this.firestore , "feedback", feedback.id as string))
  }

  getByNameFB(name: string): Promise<QuerySnapshot<DocumentData>> {
    const q = query(collection(this.firestore, "products"), where("path", "==", name));
    return getDocs(q);
  }

  getOrdersFB(name: string): Promise<QuerySnapshot<DocumentData>> {
    const q = query(collection(this.firestore, "order"), where("email", "==", name));
    return getDocs(q);
  }

  getAllFBUsers(): Observable<DocumentData[]> {
    return collectionData(collection(this.firestore, "users"), { idField: 'id' } )
  }

  updateUserFB(user: IProfileResponse, id: any): Promise<void> {
    return setDoc(doc(this.firestore, "users", id), user)
  }

  getByEmailFB(email: string): Promise<QuerySnapshot<DocumentData>> {
    const q = query(collection(this.firestore, "users"), where("email", "==", email));
    return getDocs(q);
  }

  createFeedBackFB(feedback: any): Promise<DocumentReference<DocumentData>> {
    return addDoc(collection(this.firestore, 'feedback'), feedback)
  }


}
