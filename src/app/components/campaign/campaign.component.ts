import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Question, QuestionType } from 'src/app/types';
import { QuestionComponent } from '../question/question.component';
import { delayUtil, generateRandomNumberWithSigma, generateRandomString } from 'src/app/utils';
import { CampaignService } from 'src/app/services/campaign.service';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent implements OnInit, AfterViewInit {
  sampleNumber: number = 0;

  isLoading: boolean = false;


  isTeacher: boolean = false;

  campaignId: string = '';

  questions: Question[] = [];

  defaultFormGroupValues: any = {};

  get title(): string {
    return ['Campaign', this.campaignId, this.isTeacher ? '(Teacher)' : ''].join(' ');
  }

  allRecords: Map<string, Map<string, string>> = new Map<string, Map<string, string>>();

  recordColumns: string[] = ['_key', 'var1', 'var2'];

  get recordColumnsWithoutFirst(): string[] {
    return this.recordColumns.slice(1);
  }


  allRecordsArray01: Map<string, string>[] = [];
  allRecordsArray02: {}[] = [];

  recordDataSource = new MatTableDataSource<Map<string, string>>([]);
  recordDataSource2 = new MatTableDataSource<{}>([]);

  _matSort: MatSort = new MatSort();

  @ViewChild(MatSort, { static: false }) set matSort(matSort: MatSort) {
    this._matSort = matSort;
    this.recordDataSource2.sort = this._matSort;
  }

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private campaignService: CampaignService,
    private questionService: QuestionService) {

    this.activatedRoute.params.subscribe(params => {
      this.campaignId = params['id'];
      this.updateByCampaignId();
    });

    this.activatedRoute.url.subscribe(urls => {
      var url = urls.join('/');
      this.isTeacher = url.startsWith('campaign/teacher');
      // TODO: authentication of teacher mode.
    })

    this.activatePlotly();
  }


  get url (): string {return  this.router.url ; };
  tabSelectedIndex: number = 0;


  async updateByCampaignId(): Promise<void> {
    // TODO: rpc load questions 
    // TODO: rpc load responses
    this.isLoading = true;
    await delayUtil(500);

    const result: Question[] = await this.questionService.getByCampaignId('vks3yd');
    if(result.length == 0) {
      this.questions = []; 
      this.isLoading = false;
      return;
    }

    this.questions = result;
    let count = this.questions.length;
    let length = JSON.parse(this.questions[0].answers).length ? JSON.parse(this.questions[0].answers).length : 0;
    this.formGroupTakeCampaign = new FormGroup({});
    this.allRecords = new Map<string, Map<string, string>>();
    this.recordColumns = ['_key'];

    for (let i = 0; i < count; i++) {
      // let question = QuestionComponent.getDefaultQuestion(i + 1);
      // if ((i + 1) % 3 == 0) question.questionType = QuestionType.String;
      // this.questions.push(question);
      const tempControl = new FormControl('', Validators.required);
      this.formGroupTakeCampaign.addControl(i.toString(), tempControl);
      this.recordColumns.push(this.questions[i].questionVar);

    }

    for (let k = 0; k < length; k++) {
      let userInputMap = new Map<string, string>();
      let key = generateRandomString(10);
      for (let i = 0; i < count; i++) {
        let temp = JSON.parse(this.questions[i].answers);
        if (this.questions[i].questionType == QuestionType.Number) {
          userInputMap.set(this.recordColumns[i + 1], temp[k].toString());
        } else {
          userInputMap.set(this.recordColumns[i + 1], temp[k]);
        }
      }
      this.allRecords.set(key, userInputMap);
    }

    


    let allRecordsArray = Array.from(this.allRecords, ([key, value]) => {
      let copiedMap = new Map<string, string>();
      copiedMap.set('_key', key);
      for (let [key0, value0] of value.entries()) {
        copiedMap.set(key0, value0);
      }
      return copiedMap;
    });

    let allRecordsArray2 = Array.from(this.allRecords, ([key, value]) => {
      let copiedMap = new Map<string, string>();
      copiedMap.set('_key', key);
      for (let [key0, value0] of value.entries()) {
        copiedMap.set(key0, value0);
      }

      return Array.from(copiedMap.entries()).reduce((main, [key, value]) => ({ ...main, [key]: value }), {})
    });

    this.allRecordsArray01 = allRecordsArray;
    this.allRecordsArray02 = allRecordsArray2;
    this.recordDataSource = new MatTableDataSource<Map<string, string>>(allRecordsArray);
    this.recordDataSource2 = new MatTableDataSource(allRecordsArray2);
    
    // await delayUtil(500);
    this.recordDataSource2.sort = this._matSort;
    // console.log(this.allRecords);
    // console.log(allRecordsArray);
    // console.log(this.recordColumns);

    this.isLoading = false;
  }



  /**
   * Check the Campaign is existed or not
   * 
   */
  async checkUrl() {
    this.isLoading = true;
    const id = String(this.route.snapshot.paramMap.get('id'))
    const result = await this.campaignService.check(id);
    const flag = result.length > 0 ? true : false;

    if(! flag) {
      window.alert('Campaign ID is wrong!');
      this.router.navigateByUrl('/index');
      this.isLoading = false;
    }
  }

 ngOnInit() {
  this.checkUrl();
}

  ngAfterViewInit() {
    this._matSort.sortChange.subscribe(() => {
      // console.log(this._matSort.active, this._matSort.direction);
    });
    // this.recordDataSource2.sort = this._matSort;
  }


  get isFormGroupTakeCampaignValid(): boolean {
    let isValid = true;
    let controls = this.formGroupTakeCampaign.controls;

    for (let controlName in controls) {
      let questionType = this.questions[parseInt(controlName)]?.questionType;
      let value = controls[controlName]?.value;

      if (questionType == QuestionType.Number) {
        let num = parseInt(value);
        if (isNaN(num)) {
          isValid = false;
          break;
        }
      } else { // Defaults to [QuestionType.String].
        if (value.trim() == '') {
          isValid = false;
          break;
        }
      }
    }

    return isValid;
  }






  async onAction(): Promise<void> {
    this.sampleNumber += 100;
  }

  async onLogOut(): Promise<void> {
    this.sampleNumber += 100;
    this.router.navigateByUrl('/index')
  }

  formGroupTakeCampaign: FormGroup = new FormGroup({});


  errorTakeCampaign: string = '';


  async submitTakeCampaign(): Promise<void> {
    var userInputMap = new Map<string, string>();

    // const data = await this.questionService.getByCampaignId('vks3yd');

    let controls = this.formGroupTakeCampaign.controls;
    
    for (let controlName in controls) {
      const value = this.formGroupTakeCampaign.controls[controlName]!.value;
      userInputMap.set((parseInt(controlName) + 1).toString(), value);
    }

   const flag = await this.questionService.updateByCampaign('vks3yd', userInputMap);

   if(flag) {
    console.log('Success');
   } else {
    console.log('Failed');
   }
    // TODO: rpc
  }

  async deleteRecord(recordId: number): Promise<void> {
    console.log('to delete', recordId);

    // TODO: rpc 
  }



  formGroupPlotly: FormGroup = new FormGroup({
    'type': new FormControl(''),
    'x': new FormControl(''),
    'y': new FormControl(''),
  });

  plotlyTypes: string[] = ['bar', 'scatter', 'box', 'pie'];


  activatePlotly() {
    this.formGroupPlotly.valueChanges.subscribe(values => {
      this.graph.data[0].type = values.type;

      var xVar = values.x as string;
      var yVar = values.y as string;

      this.graph.data[0].x = this.allRecordsArray01.map((item) => item.get(xVar)).map(Number);

      this.graph.data[0].y = this.allRecordsArray01.map((item) => item.get(yVar)).map(Number);

      if (values.type == 'pie') {

        this.graph.data[0].values = this.allRecordsArray01.map((item) => item.get(xVar)).map(Number);

        this.graph.data[0].labels = this.allRecordsArray01.map((item) => item.get(yVar) ?? '');
      }
    });
  }

  graph = {
    data: [
      {
        x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'points', marker: { color: 'red' },
        values: [1, 2, 3], labels: ['2', '6', '3'],
      },
    ],
    layout: { width: 640, height: 640, title: 'A Fancy Plot' }
  };

  get graphType(): string { return this.graph.data[0].type };

}
