import { Component } from '@angular/core';
import { DataStudent, DataTeacher } from 'src/app/data';

@Component({
  selector: 'app-option-nav-list',
  templateUrl: './option-nav-list.component.html',
  styleUrls: ['./option-nav-list.component.scss']
})
export class OptionNavListComponent {
  data: any = {
    DataStudent,
    DataTeacher
  }
}
