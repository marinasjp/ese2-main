import { NgModel } from '@angular/forms';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {SampleDataService} from "./sample-data.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {finalize} from "rxjs/operators";
import {Dataset} from "../models/dataset.model";
import {Datafile} from "../models/datafile.model";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})



export class GraphService {

  

  private _resetAllGraphZooms: BehaviorSubject<any>;

  public get resetAllGraphZooms$(): Observable<any> {
    return this._resetAllGraphZooms.asObservable();
  }

  public set resetAllGraphZooms(value: any) {
    this._resetAllGraphZooms.next(value);
  }
  
  
 
  private _uploadingDataLoading: BehaviorSubject<boolean>;

  public get uploadingDataLoading$(): Observable<boolean> {
    return this._uploadingDataLoading.asObservable();
  }

  private _datafiles: BehaviorSubject<Datafile[]>;

  public get datafiles$(): Observable<Datafile[]> {
    return this._datafiles.asObservable();
  }

  public get datafiles(): Datafile[] {
    return this._datafiles.value;
  }

  public set datafiles(datafiles: Datafile[]) {
    this._datafiles.next(datafiles);
  }

  private _selectedDatafile: BehaviorSubject<Datafile>;

  public get selectedDatafile$(): Observable<Datafile> {
    return this._selectedDatafile.asObservable();
  }

  public get selectedDatafile(): Datafile {
    return this._selectedDatafile.value;
  }

  public set selectedDatafile(datafile: Datafile) {
    this._selectedDatafile.next(datafile);
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
              private http: HttpClient,
              public snackBar?: MatSnackBar) {
    this._datafiles = new BehaviorSubject<Datafile[]>([]);
    this._selectedDatafile = new BehaviorSubject<Datafile>({name: null, datasets: []});
    this._uploadingDataLoading = new BehaviorSubject<boolean>(false);
    this._sliderValue = new BehaviorSubject<number>(0);
    this._resetAllGraphZooms = new BehaviorSubject<any>(null);
    
    
  }


  displayErrorMessage(message: "Error: Your file is the wrong type or incorrectly formatted") { //This is a function to display error message to user in case of error 
    this.snackBar.open(message, 'Close', {
      duration: 5000,  //This leaves it open for 5 seconds
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
   
  }

  prepareUserInputData(input, filename: string): any {
    const inputIndentation = input.Indentation;
    const inputLoad = input.Load;
    let datasets: Dataset[] = [];

    inputIndentation.forEach((inputDataset, index: number) => {
      let dataset: Dataset = {
        contactPoint: null,
        displacementForceData: [],
        displacementForceFilteredData: [],
        indentationForceData: [],
        elspectraData: [],
        testData: []
      }
      let datasetIndentation = inputIndentation[index];
      let datasetLoad = inputLoad[index];

      inputDataset.forEach((datapoint, index) => {
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

    let datafiles = this.datafiles;
    datafiles.push({
      name: filename,
      datasets: datasets
    });
    this.selectedDatafile = this.datafiles[this.datafiles.length - 1];
  }


  prepareUserInputDataTxt(input, filename: string): any {
    const inputIndentation = input.Indentation;
    const inputLoad = input.Load;
    let datasets: Dataset[] = [];

    let dataset: Dataset = {  //
      contactPoint: null,
      displacementForceData: [],
      displacementForceFilteredData: [],
      indentationForceData: [],
      elspectraData: [],
      testData: []
    };

    // Loop through the indentation and load arrays and add data to the dataset
    for (let i = 0; i < inputIndentation.length; i++) {

      let valuePair: { x: number, y: number } = {
        x: inputIndentation[i],
        y: inputLoad[i]
      }
      dataset.displacementForceData.push(valuePair);
      // TODO: REMOVE?
      dataset.displacementForceFilteredData.push(valuePair);
    }
    
    // Add the dataset to the datasets array
    datasets.push(dataset);

    let datafiles = this.datafiles;
    datafiles.push({
      name: filename,
      datasets: datasets
    });
    this.selectedDatafile = this.datafiles[this.datafiles.length - 1];
  }


  uploadDataTxt(file: any): void {
    this._uploadingDataLoading.next(true);
    const formData = new FormData();
    formData.append('file', file);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    const filename: string = file.name; //Takes the filename 
    this.http.post(environment.apiURL + 'send_data_txt', formData, {
      headers: headers,
      responseType: "json"
    }).pipe(finalize(() => this._uploadingDataLoading.next(false)))  //This is what takes the response from the backend 
      .subscribe(
        (response) => { //This is what takes the response/return from the backend 
          if ('error' in response){   //checks if there is an error or not 
            this.displayErrorMessage("Error: Your file is the wrong type or incorrectly formatted");
          } else {
          this.prepareUserInputDataTxt(response, filename); //else sends it to prepareUserInputData functions
          }
        }, () => {
        })
  }

  uploadDataRaw(file: any): void { //This does the same as above but it handles raw data, It is cleaner if it is seperate functions due to having to use afmformats library in the backend 
    this._uploadingDataLoading.next(true);
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    const filename: string = file.name;

    this.http.post(environment.apiURL + 'send_data', formData, {
      headers: headers,
      responseType: "json"
    }).pipe(finalize(() => this._uploadingDataLoading.next(false)))
      .subscribe(
        (response) => {
          if ('error' in response){
            this.displayErrorMessage("Error: Your file is the wrong type or incorrectly formatted");
          } else {
          this.prepareUserInputData(response, filename);
          }
        }, () => {
        })
  }
}