import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage, ref, deleteObject, uploadBytesResumable, percentage, getDownloadURL } from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';
import { DiscountService } from 'src/app/shared/services/discount/discount.service';
import { IDiscountResponse } from 'src/app/shared/interface/discount/discount.interface';
import { doc, updateDoc, deleteField } from "firebase/firestore";

@Component({
  selector: 'app-admin-discounts',
  templateUrl: './admin-discounts.component.html',
  styleUrls: ['./admin-discounts.component.scss']
})
export class AdminDiscountsComponent implements OnInit {
  @ViewChild('close') close!: ElementRef;

  public person!: string;
  public adminDiscounts: Array<IDiscountResponse> = [];
  public currentDiscount!: IDiscountResponse;
  public currentDiscountID!: number | string;
  public num: number = 1;
  public editStatus = false;
  public discountForm!: FormGroup;
  public isUploaded = false;
  public uploadPercent!: number;

  constructor(
    private discountService: DiscountService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private storage: Storage
  ) { }

  ngOnInit(): void {
    this.initDiscountForm();
    this.loadDiscounts();
  }

  initDiscountForm(): void {
    this.discountForm = this.fb.group({
      description: [null, Validators.required],
      imagePath: [null, Validators.required],
      title: [null, Validators.required],
      time: [null, Validators.required],
      path: [null, Validators.required],
      id: [this.adminDiscounts.length + 1, Validators.required]
    })
  }


  loadDiscounts(): void {
    this.discountService.getAllFB().subscribe(data => {
      this.adminDiscounts = data as IDiscountResponse[];
      console.log(this.adminDiscounts);
    }, err => {
      console.log('load discount error', err);
    })
  }

  saveDiscount(): void {
    if (this.editStatus) {
      this.discountService.updateFB(this.discountForm.value, this.currentDiscountID as string).then((data) => {
        this.loadDiscounts();
        this.editStatus = false;
        this.initDiscountForm();
        this.close.nativeElement.click();
        this.isUploaded = false;
      }, err => {
        console.log('update discount error', err);
      });
    } else {
      this.discountService.createFB(this.discountForm.value).then(() => {
        this.close.nativeElement.click();
        this.loadDiscounts();
        this.initDiscountForm();
        this.isUploaded = false;
      }, err => {
        console.log('create discount error', err);
      });
    }
  }

  deleteDiscount(discount: IDiscountResponse): void {
    this.discountService.deleteFB(discount as any).then(data => {
      this.loadDiscounts();
      this.deleteImage(discount.imagePath);
      this.toastr.success('Discount successfully deleted!');
    }, err => {
      console.log('delete discount error', err);
      this.toastr.error(err.message);
    });
  }

  editDiscount(discount: IDiscountResponse): void {
    this.discountForm.patchValue({
      description: discount.description,
      imagePath: discount.imagePath,
      time: discount.time,
      title: discount.title,
      path: discount.path,
    });
    this.currentDiscountID = discount.id;
    this.editStatus = true;
    this.isUploaded = true;
  }

  upload(event: any): void {
    const file = event.target.files[0];
    this.uploadFile('discount', file.name, file)
      .then(data => {
        this.discountForm.patchValue({
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
    const task = ref(this.storage, imagePath);
    deleteObject(task).then(() => {
      console.log('File deleted successfully');
      this.discountForm.patchValue({
        imagePath: null
      })
    })
  }

  valueByControl(control: string): string {
    return this.discountForm.get(control)?.value;
  }
}
