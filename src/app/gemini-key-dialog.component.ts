import { Component, Output, EventEmitter } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'gemini-key-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  template: `
    <h2 mat-dialog-title>Gemini API Key</h2>
    <mat-dialog-content>
      <p>Enter your Gemini API key from <a href='https://aistudio.google.com/app/apikey' target='_blank'>Google AI Studio</a>:</p>
      <mat-form-field style="width: 100%;">
        <input matInput [(ngModel)]="apiKey" placeholder="API Key" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" (click)="saveKey()" [disabled]="!apiKey">Save</button>
    </mat-dialog-actions>
  `
})
export class GeminiKeyDialogComponent {
  apiKey = localStorage.getItem('geminiApiKey') || '';
  @Output() keySaved = new EventEmitter<string>();

  saveKey() {
    localStorage.setItem('geminiApiKey', this.apiKey);
    this.keySaved.emit(this.apiKey);
  }
} 