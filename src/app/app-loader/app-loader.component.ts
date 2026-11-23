import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
import { LoaderService } from '../shared/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './app-loader.component.html',
  styleUrls: ['./app-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AppLoaderComponent implements OnInit, OnDestroy {
  @ViewChild('loaderTemplate', { static: true })
  template!: TemplateRef<unknown>;
  private subscription?: Subscription;
  private overlayRef?: OverlayRef;
  constructor(
    private loaderService: LoaderService,
    private overlay: Overlay,
    private viewContainer: ViewContainerRef,
  ) {}
  ngOnInit(): void {
    this.subscription = this.loaderService.loaderState.subscribe((state) => {
      if (state.show) {
        this.overlayRef ??= this.overlay.create({
          usePopover: true,
          positionStrategy: this.overlay
            .position()
            .global()
            .centerHorizontally()
            .centerVertically(),
        });
        if (!this.overlayRef.hasAttached())
          this.overlayRef.attach(
            new TemplatePortal(this.template, this.viewContainer),
          );
      } else {
        this.overlayRef?.detach();
      }
    });
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.overlayRef?.dispose();
  }
}
