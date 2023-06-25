import { Injectable } from '@angular/core';
import { Question } from '../types';
import { AngularFirestore, AngularFirestoreCollection, validateEventsArray } from '@angular/fire/compat/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})

export class QuestionService {
  private dbPath = '/questions';

  questionsRef: AngularFirestoreCollection<Question>;
  
  constructor(private db:AngularFirestore) {
    this.questionsRef = db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<Question> {
    return this.questionsRef;
  }

  create(campaign: Question): any {
    return this.questionsRef.add({ ...campaign });
  }

  update(id: string, data: any): Promise<void> {
    return this.questionsRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.questionsRef.doc(id).delete();
  }

  async getByCampaignId(id: string): Promise<Question[]> {
    const data = await this.questionsRef.ref.where('campaignId', '==', id).get();
    const result = data.docs.map(doc => doc.data());

    return result;
  }

  async updateByCampaign(campaignId: string, data: any): Promise<boolean> {
    const questions = await this.questionsRef.ref
    .where('campaignId', '==', campaignId)
    .get();

    let flag = false;

    let result = new Map<string, any>();
    questions.docs.map(doc => {
      result.set(doc.id, doc.data());
    });

    data.forEach((element, id) => {
      result.forEach((value, key) => {
        if(id == value.id) {
          let temp = [];

          if(value.hasOwnProperty('answers')) {
            temp = JSON.parse(value.answers); 
          }

          Array.isArray(temp) && temp.push(element);
          value.answers = JSON.stringify(temp);
          this.update(key, value);
          flag = true;
        }
      } )
    });

    return flag;
  }  
  
}
