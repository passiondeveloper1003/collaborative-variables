import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IndexPage, DataStudent, DataTeacher } from 'src/app/data';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})

export class IndexComponent {

  sampleNumber: number = 0;

  data: any = {
    IndexPage,
    DataStudent,
    DataTeacher
  }

  isLoading: boolean = false; 

  constructor(private router: Router) {
    router.events
      .subscribe((event) => {
        console.log(event);
      });
  }

  async onAction(): Promise<void> {
    this.sampleNumber+=100;
  }

  async onLogOut(): Promise<void> {
    this.sampleNumber+=100;
    this.router.navigateByUrl('/index')
  }

  panelOpenState: boolean = false;
  
}
