import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Storage, ref, deleteObject, getDownloadURL, uploadBytesResumable } from '@angular/fire/storage';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { percentage } from "rxfire/storage";
import { ICategoryRequest, ICategoryResponse } from 'src/app/shared/interface/category/category.interface';
import { documentId } from 'firebase/firestore';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {

  @ViewChild('close') close!: ElementRef;

  public person!: string;
  public adminCategories: Array<ICategoryResponse> = [];
  public currentCategoryID!: number | string;
  public editStatus = false;
  public categoryForm!: FormGroup;
  public isUploaded = false;
  public uploadPercent!: number;
  public as: Array<any> = [];
  public b = 'snack'

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private storage: Storage
  ) {
  }

  ngOnInit(): void {
    this.initCategoryForm();
    this.loadCategories();
  }

  initCategoryForm(): void {
    this.categoryForm = this.fb.group({
      name: [null, Validators.required],
      path: [null, Validators.required],
      imagePath: [null, Validators.required]
    })
  }

  loadCategories(): void {
    this.categoryService.getAllFB().subscribe(data => {
      data.forEach((doc) => {
      })
      this.adminCategories = data as ICategoryResponse[];
      console.log(data)
    }, err => {
      this.toastr.error(err.message);
    });
  }

  saveCategory(): void {
    if (this.editStatus) {
      this.categoryService.updateFB(this.categoryForm.value, this.currentCategoryID as string).then(() => {
        this.loadCategories();
        this.editStatus = false;
        this.initCategoryForm();
        this.close.nativeElement.click();
        this.isUploaded = false;
        this.toastr.success('Category successfully updated!');
      }).catch(err => {
        this.toastr.error(err.message);
      })
    } else {
      this.categoryService.createFB(this.categoryForm.value).then(() => {
        this.close.nativeElement.click();
        this.loadCategories();
        this.initCategoryForm();
        this.isUploaded = false;
        this.toastr.success('Category successfully created!');
      }).catch(err => {
        this.toastr.error(err.message);
      })
    }
  }

  deleteCategory(category: ICategoryResponse): void {
    this.categoryService.deleteFB(category.id as string).then(() => {
      this.loadCategories();
      this.deleteImage(category.imagePath);
      this.toastr.success('Category successfully deleted!');
    }).catch(err => {
      this.toastr.error(err.message);
    });
  }

  editCategory(category: ICategoryResponse): void {
    this.categoryForm.patchValue({
      name: category.name,
      path: category.path,
      imagePath: category.imagePath
    });
    this.currentCategoryID = category.id;
    this.editStatus = true;
    this.isUploaded = true;
  }

  upload(event: any): void {
    const file = event.target.files[0];
    this.uploadFile('category', file.name, file)
      .then(data => {
        this.categoryForm.patchValue({
          imagePath: data
        });
        this.isUploaded = true;
      })
      .catch(err => {
        console.log(err);
      })
  }

  async uploadFile(folder: string, name: string, file: File | null): Promise<string> {
    const ext = file!.name.split('.').pop();
    const path = `${folder}/${name}.${ext}`;
    let url = '';
    if (file) {
      try {
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file);
        percentage(task).subscribe(data => {
          this.uploadPercent = data.progress
        });
        await task;
        url = await getDownloadURL(storageRef);
      } catch (e: any) {
        console.error(e);
      }
    } else {
      console.log('wrong format')
    }
    return Promise.resolve(url);
  }

  deleteImage(imagePath?: string): void {
    imagePath = imagePath ? imagePath : this.valueByControl('imagePath')
    this.isUploaded = false;
    this.uploadPercent = 0;
    const task = ref(this.storage, imagePath);
    deleteObject(task).then(() => {
      console.log('File deleted successfully');
      this.categoryForm.patchValue({
        imagePath: null
      })
    })
  }

  valueByControl(control: string): string {
    return this.categoryForm.get(control)?.value;
  }
}
