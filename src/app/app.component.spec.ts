import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ApiService } from './api.service';

describe('AppComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        ApiService
      ]
    }).compileComponents();

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'dynamic-form-generation'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const titleService = app.titleService;
    expect(titleService.getTitle()).toEqual('dynamic-form-generation');
  });

  it('should render custom quote headline in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Your custom quote starts here');
  });

  it('should get questions', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const spy = spyOn(app.api, 'getQuestions').and.callThrough();
    fixture.componentInstance.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should get NAICS list', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const spy = spyOn(app.api, 'getNaicsRecords').and.callThrough();
    fixture.componentInstance.autoCompleteNAICS();
    expect(spy).toHaveBeenCalled();
  });

  it('should build formgroup', () => {
    const questionData = [{
      id: 1,
      text: 'What is the policy holder\'s first name?',
      type: 'input',
      required: true,
      min: 2
    }];

    const fixture = TestBed.createComponent(AppComponent);
    fixture.componentInstance.ngOnInit();
    fixture.componentInstance.questions = questionData;
    fixture.componentInstance.customQuoteForm = fixture.componentInstance.buildFormGroup();

    const form = buildForm(fixture);

    expect(form.valid).toBe(true);
  });

  it('should be valid form', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.componentInstance.ngOnInit();

    const form = buildForm(fixture);

    expect(form.valid).toBe(true);
  });

  function buildForm(fixture: ComponentFixture<AppComponent>): FormGroup {
    const first = 'Justin';
    const last = 'Collantes';
    const option = 12;
    const naics = '111332';

    const form = fixture.componentInstance.customQuoteForm;
    form.patchValue({1: first});
    form.patchValue({2: last});
    form.patchValue({3: option});
    form.patchValue({4: naics});
    return form;
  }
});
