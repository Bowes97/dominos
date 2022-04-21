import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  getDocs,
  query,
  QuerySnapshot,
  setDoc,
  where
} from "@angular/fire/firestore";
import { ICategoryResponse } from '../../interface/category/category.interface';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private firestore: Firestore
  ) { }


  getAllFB(): Observable<DocumentData[]> {
    return collectionData(collection(this.firestore, "category"), { idField: 'id' })
  }

  createFB(category: ICategoryResponse): Promise<DocumentReference<DocumentData>> {
    return addDoc(collection(this.firestore, "category"), category);
  }

  updateFB(category: ICategoryResponse, id: string): Promise<void> {
    return setDoc(doc(this.firestore, "category", id), category);
  }

  deleteFB(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, "category", id));
  }

  getByCategoryFB(categoryName: string): Promise<QuerySnapshot<DocumentData>> {
    const q = query(collection(this.firestore, "category"), where("category.path", "==", categoryName));  
    return getDocs(q);
  }
}
