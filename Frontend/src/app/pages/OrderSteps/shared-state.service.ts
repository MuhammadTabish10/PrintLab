import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedStateService {
  private buttonActiveSource = new BehaviorSubject<boolean>(true);
  buttonActive$ = this.buttonActiveSource.asObservable();
  setButtonActive(isActive: boolean) {
    this.buttonActiveSource.next(isActive);
  }
}
