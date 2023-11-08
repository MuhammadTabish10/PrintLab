import { LoaderService } from './services/loader.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'print-lab';

  constructor(public loaderService: LoaderService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loaderService.isLoading$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }
}
