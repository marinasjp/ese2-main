import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Dataset} from "../models/dataset.model";
import {SampleDataService} from "./sample-data.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  start: number;
  end: number;

  private _inputData: BehaviorSubject<Dataset[]>;

  public get inputData$(): Observable<Dataset[]> {
    return this._inputData.asObservable();
  }

  public get inputData(): Dataset[] {
    return this._inputData.value;
  }

  public set inputData(datasets: Dataset[]) {
    this._inputData.next(datasets);
  }


  private _filteredData: BehaviorSubject<Dataset[]>;

  public get filteredData$(): Observable<Dataset[]> {
    return this._filteredData.asObservable();
  }

  public set filteredData(dataset: Dataset[]) {
    this._filteredData.next(dataset);
    console.log(dataset);
  }


  constructor(private sampleDataService: SampleDataService,
              private http: HttpClient) {
    this._inputData = new BehaviorSubject<Dataset[]>([]);
    this._filteredData = new BehaviorSubject<Dataset[]>([]);


// TODO: REMOVE: FOR TESTING ONLY
    let sampleData = [];
    const sampleDataIndentation = this.sampleDataService.sampleDataIndentation;
    const sampleDataLoad = this.sampleDataService.sampleDataLoad;
    let start: number;
    let end: number;

    sampleDataIndentation.forEach((dataset, index) => {
      let datasetPoints: { x: number, y: number }[] = [];
      let datasetIndentation = sampleDataIndentation[index];
      let datasetLoad = sampleDataLoad[index];

      dataset.forEach((datapoint, index) => {
        if (!start || datasetIndentation[index] < start) {
          start = datasetIndentation[index];
        }
        if (!end || datasetIndentation[index] > end) {
          end = datasetIndentation[index];
        }

        let valuePair: { x: number, y: number } = {
          x: datasetIndentation[index],
          y: datasetLoad[index]
        }
        datasetPoints.push(valuePair);
      })

      sampleData.push(datasetPoints);
    })

    this._inputData.next(sampleData);

    this.start = start;
    this.end = end;
  }


  uploadData(file: any): void {

    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    this.http.post(environment.apiURL + 'send_data', formData, {
      headers: headers,
      responseType: "json"
    }).subscribe((response) => {
      console.log('FINISHED')
    })
  }


}

