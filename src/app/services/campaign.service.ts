import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Campaign } from '../models/campaign.model';
import { collection, query, where, getDocs } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  private dbPath = '/campaigns';

  campaignsRef: AngularFirestoreCollection<Campaign>;
  
  constructor(private db:AngularFirestore) {
    this.campaignsRef = db.collection(this.dbPath);
   }

  getAll(): AngularFirestoreCollection<Campaign> {
    return this.campaignsRef;
  }

  getByName(name: string) {
    return this.campaignsRef.ref.where('campaignId', '==', name);
  }

  create(campaign: Campaign): any {
    return this.campaignsRef.add({ ...campaign });
  }

  update(id: string, data: any): Promise<void> {
    return this.campaignsRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.campaignsRef.doc(id).delete();
  }

  async check(id: string): Promise<any> {
    const data = await this.getByName(id).get();
    const result = data.docs.map(doc => doc.data());

    return result;
  }
}
