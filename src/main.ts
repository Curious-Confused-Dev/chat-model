import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

// This is the main entry point for the Angular application.
// It bootstraps the App component with the provided application configuration.
// The configuration includes global error listeners, zone change detection, routing, and animations.
// The application is set up to use the Angular Material components and services defined in the App component
// and other related components like GeminiKeyDialogComponent for handling API keys.
import { Component, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button'; 