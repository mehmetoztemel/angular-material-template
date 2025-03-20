import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../shared/services/loader.service';
import { LoaderState } from '../shared/models/loaderState';

@Component({
  selector: 'app-loader',
  standalone: false,
  templateUrl: './app-loader.component.html',
  styleUrl: './app-loader.component.scss'
})
export class AppLoaderComponent implements OnInit, OnDestroy  {
  loading = false;
  private subscription: Subscription;
  constructor(private loaderService: LoaderService) { }
  ngOnInit(): void {
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        setTimeout(() => {
          this.loading = state.show;
        });
      });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
