import { ChangeDetectorRef, Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Question, QuestionType, defaultQuestion, QuestionOptions } from 'src/app/types';
import { generateRandomString, generateRandomUniqueString } from 'src/app/utils';
import { Campaign } from 'src/app/models/campaign.model';
import { CampaignService } from 'src/app/services/campaign.service';
import { newCampaignPage } from 'src/app/data';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-campaign-add',
  templateUrl: './campaign-add.component.html',
  styleUrls: ['./campaign-add.component.scss']
})

export class CampaignAddComponent {
  
  // Create New Campaign
  campaign: Campaign = new Campaign();

  // Select Option Variable
  selectedQuickOption: string = 'one';

  // Static content data of page
  content = newCampaignPage;


  isLoading: boolean = false;

  // @Output() loading = new EventEmitter<boolean>();

  // Defulat Select option
  quickOptions = [
    { label: 'One numerical variable', value: 'one' },
    { label: 'Two numerical variables', value: 'two' },
    { label: 'Others', value: 'others' }
  ];

  // formgroup for campaign
  formGroupA: FormGroup = new FormGroup({
    campaignId: new FormControl(),
    campaignPassword: new FormControl(),
    selectedQuickOption: new FormControl(QuestionOptions.ONE),
  });

  // Questions of this campaign
  questions: Question[] = [CampaignAddComponent.getDefaultQuestion(1)];
  
  /**
   * Constructor Function
   * 
   * @param firestore the instance connected to firestore database
   * @param router 
   * @param changeDetection 
   * @param campaignService 
   */
  constructor(
    private router: Router, 
    private changeDetection: ChangeDetectorRef, 
    private campaignService: CampaignService,
    private questionService: QuestionService) {

    // Initialize the campaign default values 
    this.campaign.campaignId = generateRandomString(6);
    this.campaign.password = generateRandomString(10);
    this.campaign.option = QuestionOptions.ONE;
  }

  /**
   *  Initialize some functions
   * 
   */
  ngOnInit() {
    this.formGroupA.controls['selectedQuickOption'].valueChanges.subscribe((selectedQuickOption) => {
      this.selectedQuickOption = selectedQuickOption;
      if (selectedQuickOption == QuestionOptions.ONE) {
        if (this.questions.length != 1) this.questions =
          [CampaignAddComponent.getDefaultQuestion(1)];
      }
      if (selectedQuickOption == QuestionOptions.TWO) {
        if (this.questions.length != 2) this.questions =
          [CampaignAddComponent.getDefaultQuestion(1), CampaignAddComponent.getDefaultQuestion(2)];
      }
    });
  }

  /**
   * Add campaign to the database
   * 
   * @returns Promise<void>
   */
  async onCreate(): Promise<void> {

    this.isLoading = true;
    
    if(this.questions.length > 0 && this.campaign.campaignId) {
      console.log(this.campaign.campaignId);
      this.questions.forEach((item: Question) => {
        item.campaignId = this.campaign.campaignId;
      });

      this.campaignService.create(this.campaign).then(() => {
        console.log('Create new campaign successfully');
        
        this.questions.forEach((question: Question) => {
          this.questionService.create(question).then(() => {
            this.isLoading = false;
            this.router.navigateByUrl('/index');
          })
        });
      })
    }

    // this.router.navigateByUrl('/campaign/teacher/' + this.formGroupA.controls['campaignId']!.value + '#' + this.formGroupA.controls['campaignPassword']!.value);
  }
  
  /**
   * Convert question object to Json
   * 
   * @param question object that type is Question
   * @returns json string
   */
  questionToJson(question: Question): string {
    return JSON.stringify(question);
  }
    
  /**
   * Emit when the question field's value is changed
   * 
   * @param question 
   * @param id 
   */
  questionChange(question: Question, id: number): void {
    this.questions[id] = question;
    this.changeDetection.detectChanges();
  }

  /**
   * Add new question fields
   * 
   */
  async onAddQuestion(): Promise<void> {
    this.questions.push(CampaignAddComponent.getDefaultQuestion(
      this.questions.length + 1
    ));
  }

  /**
   * Delete last question fields
   * 
   */
  async onRemoveQuestion(): Promise<void> {
    this.questions.pop();
  }

  /**
   *  Set the default values for all question fields
   * 
   * @param id Question id
   * @returns Default question
   */
  static getDefaultQuestion(id: number): Question {
    var _defaultQuestion = JSON.parse(JSON.stringify(defaultQuestion));
    _defaultQuestion.id = id;
    _defaultQuestion.questionText = 'Question ' + id + '?';
    _defaultQuestion.questionVar = 'var' + id;
    _defaultQuestion.questionType = QuestionType.Number;
    return _defaultQuestion;
  }


  sampleNumber: number = 0;

  debugAdvanced: boolean = false;


  async onAction(): Promise<void> {
    this.sampleNumber += 100;
  }

  async onLogOut(): Promise<void> {
    this.sampleNumber += 100;
    this.router.navigateByUrl('/index')
  }
}
