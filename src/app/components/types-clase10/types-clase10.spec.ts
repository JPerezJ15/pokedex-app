import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesClase10 } from './types-clase10';

describe('TypesClase10', () => {
  let component: TypesClase10;
  let fixture: ComponentFixture<TypesClase10>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypesClase10]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypesClase10);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
