import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { finalize, startWith, map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  questions;
  naicsList: string[];
  customQuoteForm: FormGroup;
  filteredNAICS: Observable<any[]>;

  constructor(private titleService: Title, private api: ApiService, private fb: FormBuilder) {
    this.setTitle('dynamic-form-generation');
  }

  ngOnInit(): void {
    this.customQuoteForm = this.fb.group({ });
    this.showQuestions();
  }

  public setTitle(title) {
    this.titleService.setTitle(title);
  }

  private filterNaics(name): any[] {
    const filterValue = name.toLowerCase();

    return this.naicsList.filter(naics => naics['description'].toLowerCase().indexOf(filterValue) === 0);
  }

  private showQuestions() {
    this.api.getQuestions()
    .pipe(
      finalize(() => {
        this.autoCompleteNAICS();
      })
    )
    .subscribe((data) => {
      this.questions = data;
      this.customQuoteForm = this.buildFormGroup();
    });
  }

  autoCompleteNAICS() {
    this.api.getNaicsRecords()
    .pipe(
      finalize(() => {
        this.filteredNAICS = this.customQuoteForm.get('4').valueChanges
        .pipe(
          startWith(''),
          map(name => name ? this.filterNaics(name) : this.naicsList.slice())
        );
      })
    )
    .subscribe(response => {
      this.naicsList = response;
    });
  }

  buildFormGroup() {
    const group: any = {};

    this.questions.forEach(question => {
      group[question.id] = question.required ? new FormControl('', Validators.required) : new FormControl('');
    });
    return new FormGroup(group);
  }

  saveCustomQuote() {
    if (this.customQuoteForm.invalid) {
      console.log('Please check form values and try again');
      return;
    }

    const formData = this.customQuoteForm.getRawValue();
    const responses = [];

    for (const [key, value] of Object.entries(formData)) {
      let naics;

      if (key === '4') {
        naics = this.filterNaics(value);
      }

      responses.push({
        question_id: parseInt(key),
        [typeof value === 'number'  ? 'option_id' : 'text']: naics && naics[0].code ? naics[0].code : value
      });
    }

    this.api.saveCustomQuote({responses})
    .pipe(
      catchError(err => {
        return throwError(err);
      })
    )
    .subscribe(
      response => {
        console.log('Custom Quote submission complete', response);
      },
      err => {
        console.log('Custom Quote submission error', err);
      }
    );
  }
}
