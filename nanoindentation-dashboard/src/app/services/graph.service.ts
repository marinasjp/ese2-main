import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Dataset} from "../models/dataset.model";
import {SampleDataService} from "./sample-data.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {finalize} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class GraphService {

  private _uploadingDataLoading: BehaviorSubject<boolean>;

  public get uploadingDataLoading$(): Observable<boolean> {
    return this._uploadingDataLoading.asObservable();
  }

  // sliderVal: number;
  sliderVal = 5;

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
  }


  constructor(private sampleDataService: SampleDataService,
              private http: HttpClient) {
    this._inputData = new BehaviorSubject<Dataset[]>([]);
    this._filteredData = new BehaviorSubject<Dataset[]>([]);
    this._uploadingDataLoading = new BehaviorSubject<boolean>(false);
  }

  prepareUserInputData(dataset): any {
    let data = [];
    const dataIndentation = dataset.Indentation;
    const dataLoad = dataset.Load;
    let start: number;
    let end: number;

    dataIndentation.forEach((dataset, index) => {
      let datasetPoints: { x: number, y: number }[] = [];
      let datasetIndentation = dataIndentation[index];
      let datasetLoad = dataLoad[index];

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

      data.push(datasetPoints);
    })

    this._inputData.next(data);

    this.start = start;
    this.end = end;
  }


  uploadData(file: any): void {
    this._uploadingDataLoading.next(true);
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    this.http.post(environment.apiURL + 'send_data', formData, {
      headers: headers,
      responseType: "json"
    }).pipe(finalize(() => this._uploadingDataLoading.next(false)))
      .subscribe(
        (response) => {
          this.prepareUserInputData(response);
        }, () => {
        })
  }


}

