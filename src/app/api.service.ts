import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  questionsUrl = 'https://pengwinning.boldpenguin.com/api/questions';
  naicsSearchUrl = 'https://pengwinning.boldpenguin.com/api/naics/search';
  saveAppUrl = 'https://pengwinning.boldpenguin.com/api/application_forms';

  constructor(private http: HttpClient) { }

  getQuestions() {
    return this.http.get<any>(this.questionsUrl, httpOptions);
  }

  getNaicsRecords() {
    httpOptions['params'] = new HttpParams().set('q', '');
    return this.http.get<any>(this.naicsSearchUrl, httpOptions);
  }

  saveCustomQuote(data){
    return this.http.post(this.saveAppUrl, httpOptions, data);
  }
}

const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'Bearer 1c97e76a905491ed7ccbee0cb5152411'
  })
}
