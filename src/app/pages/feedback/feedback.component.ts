import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  public disabled!: boolean;
  public email!: string;
  public feedbackForm!: FormGroup;

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loadProfile();
    this.initFeedbackForm();
    this.isDisabled();
  }

  isDisabled(): void {
    if (localStorage.length > 0 && localStorage.getItem("user")) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
  }

  loadProfile(): void {
    let user;
    user = JSON.parse(localStorage.getItem('user') as string)
    this.email = user.email;
  }

  initFeedbackForm(): void {
    this.feedbackForm = this.fb.group({
      phoneNumber: [null, Validators.required],
      topic: [null, Validators.required],
      comment: [null, Validators.required],
      email: [this.email, Validators.required]
    })
  }

  createFeedBack(): void {
    const feedback = {
      ...this.feedbackForm.value
    }
    this.profileService.createFeedBackFB(feedback).then(data => {
      this.initFeedbackForm();
      this.toastr.success('Дякуєм за ваш відгук!')
    })
  }

}
