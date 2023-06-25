import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Question, QuestionType, defaultQuestion } from 'src/app/types';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})

export class QuestionComponent implements OnInit {
  
  form: FormGroup = new FormGroup({
    questionText: new FormControl(''),
    questionVar: new FormControl('', /*[Validators.pattern('^[a-zA-Z]+$')]*/),
    questionType: new FormControl(this.questionTypes[0]),
  });

  constructor() {
    this.form.valueChanges.subscribe((value) => {
      var question2 = this._question;
      question2.questionText = value.questionText || QuestionComponent.getDefaultQuestion(this.question.id).questionText,
        question2.questionVar = value.questionVar.replace(/[^a-zA-Z0-9]/g, '') || QuestionComponent.getDefaultQuestion(this.question.id).questionVar,
        question2.questionType = value.questionType;
      this.question = question2;
    });
  }

  _question: Question = QuestionComponent.getDefaultQuestion(-1);
  get question(): Question { return this._question; }

  @Input()
  isEditing: boolean = false;

  @Input()
  set question(value: Question) {
    if (this.questionToJson(this._question) == this.questionToJson(value)) {
      return;
    }
    this._question = value;
    this.form.patchValue({
      questionText: value.questionText,
      questionVar: value.questionVar,
      questionType: value.questionType
    });
    this.questionChange.emit(this._question);
  }

  @Output()
  questionChange = new EventEmitter<Question>();

  get questionTypes(): string[] { return Object.values(QuestionType); }

  get defaultType(): string { return this.questionTypes[0]; }

  get favoriteAnswer(): any[] {
    return [this.form.controls['questionText'].value, this.form.controls['questionType'].value];
  }

  ngOnInit(): void {
    //
  }

  static getDefaultQuestion(id: number): Question {
    var _defaultQuestion = JSON.parse(JSON.stringify(defaultQuestion));
    _defaultQuestion.id = id;
    _defaultQuestion.questionText = 'Question ' + id + '?';
    _defaultQuestion.questionVar = 'var' + id;
    _defaultQuestion.questionType = QuestionType.Number;
    return _defaultQuestion;
  }

  questionToJson(question: Question): string {
    return JSON.stringify(question);
  }

  debugAdvanced: boolean = false;

}
