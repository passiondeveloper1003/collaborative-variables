import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { Question } from 'src/app/types';
import { QuestionService } from 'src/app/services/question.service';
import { Campaign } from 'src/app/models/campaign.model';
import { CampaignService } from 'src/app/services/campaign.service';

@Component({
  selector: 'app-campaign-join',
  templateUrl: './campaign-join.component.html',
  styleUrls: ['./campaign-join.component.scss']
})

export class CampaignJoinComponent implements OnInit {
  sampleNumber: number = 0;

  questions: Question[];

  filterCampaign: Campaign[];
  // title: string = 'Join Campaign';

  get title(): string {
    if (this.isTeacher) {
      return 'Join Campaign (Teacher)';
    }
    if (!this.isTeacher) {
      return 'Join Campaign (Student)';
    }
    return 'Join Campaign';
  }

  isLoading: boolean = false;

  constructor(private router: Router, 
    private questionService: QuestionService, 
    private campaignService: CampaignService) {
    router.events
      .subscribe((event) => {
        console.log(event);
      });
  }

  async onAction(): Promise<void> {
    this.sampleNumber += 100;
  }

  async onLogOut(): Promise<void> {
    this.sampleNumber += 100;
    this.router.navigateByUrl('/index')
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    await new Promise(resolve => setTimeout(resolve, 50));
    
    this.questionService.getAll().snapshotChanges().pipe(
      map(items => 
        items.map(item => (
          item.payload.doc.data()
        )))
    ).subscribe(data => {
      this.questions = data;
      console.log("Questions: ", this.questions);
    });
   
    this.isTeacher = this.router.url.includes('/campaigns/teacher/join');
    await new Promise(resolve => setTimeout(resolve, 50));
    this.isLoading = false;
  }

  isTeacher: boolean | null = null;

  error: string | null = '';

  form: FormGroup = new FormGroup({
    campaignId: new FormControl(''),
    campaignPassword: new FormControl(''),
  });

  async submit(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    let tempId: string = this.form.controls['campaignId'].value;
    // await new Promise(resolve => setTimeout(resolve, 50));
    
    // Input validation.
    if (tempId == '') {
      this.error = 'Check Campaign ID input!';
      this.isLoading = false;
      return;
    }

    let result = await this.campaignService.check(tempId);
    let checkFlag = result.length ? true : false;

    if (! checkFlag) {
      this.error = 'Campaign ID is not existed.';
      this.isLoading = false;
      return;
    }    
    
    if (this.isTeacher && this.form.controls['campaignPassword'].value == '') {
      this.error = 'Check Campaign Password input!';
      this.isLoading = false;
      return;
    }

    if(this.isTeacher && result.length == 1 && this.form.controls['campaignPassword'].value != result[0].password) {
      this.error = 'Input Password is Wrong!';
      this.isLoading = false;
      return;
    }

    if (!this.isTeacher) {
      this.router.navigateByUrl('/campaign/' + this.form.controls['campaignId'].value);
      this.isLoading = false;
      return;
    } else {
      // check and write to localStorage to validate
      this.router.navigateByUrl('/campaign/teacher/' + this.form.controls['campaignId'].value);
      this.isLoading = false;
      return;
    }

    this.isLoading = false;
  }

  filterCampaignFunc(name: string) {
    
  }
}
