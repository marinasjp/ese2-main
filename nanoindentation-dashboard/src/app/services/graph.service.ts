import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  private _graphData: BehaviorSubject<any>;

  public get graphData$(): Observable<any> {
    return this._graphData.asObservable();
  }

  public set graphData(data: any) {
    this._graphData.next(data);
  }

  constructor() {
    this._graphData = new BehaviorSubject<any>(null);
  }
}
