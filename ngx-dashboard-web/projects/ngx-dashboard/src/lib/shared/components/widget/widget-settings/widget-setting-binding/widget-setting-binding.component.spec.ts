import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetSettingBindingComponent } from './widget-setting-binding.component';

describe('WidgetSettingBindingComponent', () => {
  let component: WidgetSettingBindingComponent;
  let fixture: ComponentFixture<WidgetSettingBindingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetSettingBindingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetSettingBindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
