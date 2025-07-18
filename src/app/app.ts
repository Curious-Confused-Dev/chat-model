import { Component, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgIf, NgFor } from '@angular/common';
import { ChatAreaComponent } from './chat-area.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GeminiKeyDialogComponent } from './gemini-key-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    NgIf,
    NgFor,
    ChatAreaComponent,
    MatDialogModule,
    GeminiKeyDialogComponent
  ],
  template: `
    <mat-sidenav-container class="main-container">
      <mat-sidenav #sidenav mode="side" opened class="sidebar">
        <div class="sidebar-header">
          <span class="sidebar-title">Chats</span>
          <button mat-icon-button (click)="sidenav.toggle()">
            <mat-icon>menu_open</mat-icon>
          </button>
        </div>
        <mat-nav-list class="session-list">
          <mat-list-item *ngFor="let session of chatSessions(); let i = index" (click)="selectSession(i)" [class.selected]="i === selectedSession()">
            <mat-icon matListIcon>chat_bubble</mat-icon>
            <span matLine>Session {{ i + 1 }}</span>
          </mat-list-item>
        </mat-nav-list>
        <button mat-flat-button color="primary" class="new-chat-btn" (click)="addSession()">
          <mat-icon>add</mat-icon> New Chat
        </button>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary" class="topbar">
          <div class="toolbar-flex">
            <button mat-icon-button (click)="sidenav.toggle()" class="menu-btn">
              <mat-icon>menu</mat-icon>
            </button>
            <span class="toolbar-title">Multi-Model Chat</span>
            <span class="spacer"></span>
            <button mat-button [matMenuTriggerFor]="modelMenu" class="model-switcher">
              <mat-icon>{{ selectedModel().icon }}</mat-icon>
              {{ selectedModel().name }}
              <mat-icon>expand_more</mat-icon>
            </button>
            <mat-menu #modelMenu="matMenu">
              <button mat-menu-item *ngFor="let model of models" (click)="selectModel(model)">
                <mat-icon>{{ model.icon }}</mat-icon>
                <span>{{ model.name }}</span>
              </button>
            </mat-menu>
            <button mat-icon-button aria-label="Settings" class="settings-btn" (click)="openGeminiKeyDialog()">
              <mat-icon>settings</mat-icon>
            </button>
          </div>
        </mat-toolbar>
        <div class="chat-content">
          <chat-area [model]="selectedModel()" [apiKey]="geminiApiKey()"></chat-area>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .main-container { height: 100vh; background: #f5f6fa; }
    .sidebar { width: 260px; min-width: 220px; max-width: 320px; padding: 0; display: flex; flex-direction: column; }
    .sidebar-header { display: flex; align-items: center; justify-content: space-between; padding: 2rem 1.5rem 1rem 1.5rem; }
    .sidebar-title { font-weight: 600; font-size: 1.3rem; letter-spacing: 0.01em; }
    .session-list { flex: 1 1 auto; padding-left: 0.5rem; }
    .session-list .mat-list-item { margin-bottom: 0.5rem; border-radius: 0.5rem; padding-left: 0.5rem; }
    .new-chat-btn { margin: 1.5rem 1.5rem 2rem 1.5rem; width: calc(100% - 3rem); font-weight: 600; font-size: 1rem; }
    .selected { background: #e3e7f1 !important; }
    .topbar { position: sticky; top: 0; z-index: 2; box-shadow: 0 2px 8px rgba(0,0,0,0.04); min-height: 64px; }
    .toolbar-flex { display: flex; align-items: center; width: 100%; }
    .toolbar-title { font-weight: 600; font-size: 1.2rem; margin-left: 0.5rem; }
    .spacer { flex: 1 1 auto; }
    .model-switcher { margin-left: 1rem; }
    .settings-btn { margin-left: 0.5rem; }
    .menu-btn { margin-right: 1rem; }
    .chat-content { padding: 0; min-height: calc(100vh - 64px); background: #f5f6fa; display: flex; flex-direction: column; height: calc(100vh - 64px); }
  `]
})
export class App {
  models = [
    { name: 'Gemini', icon: 'auto_awesome' },
    { name: 'ChatGPT', icon: 'smart_toy' },
    { name: 'Claude', icon: 'psychology' },
    { name: 'Azure', icon: 'cloud' }
  ];
  selectedModel = signal(this.models[0]);

  chatSessions = signal([{}]);
  selectedSession = signal(0);

  geminiApiKey = signal(localStorage.getItem('geminiApiKey') || '');

  constructor(private dialog: MatDialog) {}

  openGeminiKeyDialog() {
    const ref = this.dialog.open(GeminiKeyDialogComponent);
    ref.componentInstance.keySaved.subscribe((key: string) => {
      this.geminiApiKey.set(key);
      ref.close();
    });
  }

  selectModel(model: any) {
    this.selectedModel.set(model);
  }
  addSession() {
    this.chatSessions.update((arr: object[]) => [...arr, {}]);
    this.selectedSession.set(this.chatSessions().length - 1);
  }
  selectSession(i: number) {
    this.selectedSession.set(i);
  }
}
