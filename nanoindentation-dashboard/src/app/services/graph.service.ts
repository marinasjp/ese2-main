import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {SampleDataService} from "./sample-data.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {finalize} from "rxjs/operators";
import {Dataset} from "../models/dataset.model";

@Injectable({
  providedIn: 'root',
})
export class GraphService {

  private _uploadingDataLoading: BehaviorSubject<boolean>;

  public get uploadingDataLoading$(): Observable<boolean> {
    return this._uploadingDataLoading.asObservable();
  }

  start: number;
  end: number;


  private _datasets: BehaviorSubject<Dataset[]>;

  public get datasets$(): Observable<Dataset[]> {
    return this._datasets.asObservable();
  }

  public get datasets(): Dataset[] {
    return this._datasets.value;
  }

  public set datasets(datasets: Dataset[]) {
    this._datasets.next(datasets);
    console.log(this.datasets);
  }


  private _sliderValue: BehaviorSubject<number>;

  public get sliderValue$(): Observable<number> {
    return this._sliderValue.asObservable();
  }

  public get sliderValue(): number {
    return this._sliderValue.value;
  }

  public set sliderValue(index: number) {
    this._sliderValue.next(index);
  }

  constructor(private sampleDataService: SampleDataService,
              private http: HttpClient) {
    this._datasets = new BehaviorSubject<Dataset[]>([]);
    this._uploadingDataLoading = new BehaviorSubject<boolean>(false);
    this._sliderValue = new BehaviorSubject<number>(0);
  }

  prepareUserInputData(input): any {
    const inputIndentation = input.Indentation;
    const inputLoad = input.Load;

    let start: number;
    let end: number;

    let datasets: Dataset[] = [];

    inputIndentation.forEach((inputDataset, index: number) => {
      let dataset: Dataset = {
        contactPoint: null,
        displacementForceData: [],
        displacementForceFilteredData: [],
        indentationForceData: []
      }
      let datasetIndentation = inputIndentation[index];
      let datasetLoad = inputLoad[index];

      inputDataset.forEach((datapoint, index) => {
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
        dataset.displacementForceData.push(valuePair);
        //  TODO: REMOVE?
        dataset.displacementForceFilteredData.push(valuePair);
      })
      datasets.push(dataset);
    })

    this._datasets.next(datasets);

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

