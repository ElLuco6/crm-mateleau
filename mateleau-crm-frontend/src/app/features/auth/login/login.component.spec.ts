import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
     
      imports: [
        LoginComponent, // Assurez-vous que le composant est importé ici
        HttpClientTestingModule, // Importez HttpClientTestingModule pour les tests HTTP
        FormsModule, // Importez FormsModule pour ngModel
        RouterTestingModule // Utilisez RouterTestingModule pour simuler le routeur
      ],
      providers: [provideHttpClientTesting()] // Configurez HttpClient pour les tests
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});