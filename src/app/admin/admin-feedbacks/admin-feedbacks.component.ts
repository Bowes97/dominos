import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-feedbacks',
  templateUrl: './admin-feedbacks.component.html',
  styleUrls: ['./admin-feedbacks.component.scss']
})
export class AdminFeedbacksComponent implements OnInit {

  public person!: string;
  public adminFeeback!: Array<any>;

  constructor(
    private profileService: ProfileService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loadFeedbacks()
  }

  loadFeedbacks(): void{
    this.profileService.getAllFB().subscribe(data => {
      this.adminFeeback = data;
    })
  }

  deleteFeedback(feedback: any): void {
    this.profileService.deleteFBFeedBack(feedback as any).then(() => {
      this.loadFeedbacks();
      this.toastr.success('Discount successfully deleted!');
    }, err => {
      this.toastr.error(err.message);
    });
  }
}
