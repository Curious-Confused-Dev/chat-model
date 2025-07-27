import { Component, Input, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from './gemini.service';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'chat-area',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgFor,
    NgClass,
    NgIf,
    FormsModule,
    MarkdownModule
  ],
  template: `
    <div class="chat-area-root chat flex">
      <div class="messages-list">
        <div *ngFor="let msg of messages()" [ngClass]="{'user-msg': msg.role === 'user', 'bot-msg': msg.role !== 'user'}" class="msg-row">
          <div class="msg-bubble" [ngClass]="msg.role === 'user' ? 'user-bubble' : 'bot-bubble'">
            <ng-container *ngIf="msg.role === 'bot'; else userText">
              <markdown [data]="msg.text" class="markdown-content"></markdown>
            </ng-container>
            <ng-template #userText>
              <span>{{ msg.text }}</span>
            </ng-template>
            <ng-container *ngIf="msg.image">
              <img [src]="msg.image" class="msg-image" />
            </ng-container>
          </div>
        </div>
        <div *ngIf="loading" class="msg-row bot-msg"><div class="msg-bubble bot-bubble">Thinking...</div></div>
      </div>
      <form (ngSubmit)="sendMessage()" class="chat-input-row">
        <mat-form-field class="chat-input-field">
          <input matInput placeholder="Type your message..." [(ngModel)]="input" name="chatInput" [disabled]="loading" />
        </mat-form-field>
        <input type="file" accept="image/*" style="display: none;" #fileInput (change)="onImageSelected($event)" />
        <button mat-icon-button type="button" (click)="fileInput.click()" aria-label="Upload image" [disabled]="loading">
          <mat-icon>image</mat-icon>
        </button>
        <button mat-icon-button type="button" (click)="startVoiceInput()" aria-label="Voice input" [disabled]="loading">
          <mat-icon>keyboard_voice</mat-icon>
        </button>
        <button mat-raised-button color="primary" type="submit" [disabled]="(!input && !selectedImage) || loading">
          <mat-icon>send</mat-icon>
        </button>
      </form>
      <div *ngIf="error" style="color: #d32f2f; padding: 0.5rem 2rem 0 2rem;">{{ error }}</div>
    </div>
  `,
  styles: [`
    .chat-area-root {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 2rem 0 0 0;
    }
    .messages-list {
      flex: 1 1 auto;
      overflow-y: auto;
      padding: 0 2rem 1rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }
    .msg-row {
      display: flex;
      width: 100%;
    }
    .user-msg {
      justify-content: flex-end;
    }
    .bot-msg {
      justify-content: flex-start;
    }
    .msg-bubble {
      padding: 0.75rem 1.1rem;
      border-radius: 1.2rem;
      max-width: 70%;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
      font-size: 1rem;
      line-height: 1.5;
      word-break: break-word;
      display: inline-block;
    }
    .user-bubble {
      background: #e3e7f1;
      color: #222;
      border-bottom-right-radius: 0.3rem;
    }
    .bot-bubble {
      background: #fff;
      color: #222;
      border-bottom-left-radius: 0.3rem;
    }
    .msg-image {
      max-width: 180px;
      display: block;
      margin-top: 0.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }
    .chat-input-row {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
      padding: 1rem 2rem 1.5rem 2rem;
      background: #f5f6fa;
      position: sticky;
      bottom: 0;
      z-index: 2;
    }
    .chat-input-field {
      flex: 1 1 auto;
    }
    .markdown-content {
      font-size: 1rem;
      line-height: 1.6;
      color: #222;
    }
    .markdown-content pre {
      background: #f5f5f5;
      border-radius: 0.5rem;
      padding: 0.75rem;
      overflow-x: auto;
      font-size: 0.95rem;
    }
    .markdown-content code {
      background: #f5f5f5;
      border-radius: 0.3rem;
      padding: 0.1rem 0.3rem;
      font-size: 0.97em;
    }
  `]
})
export class ChatAreaComponent {
  @Input() model: any;
  @Input() apiKey: string = '';
  messages = signal<{role: string, text: string, image?: string}[]>([]);
  input = '';
  selectedImage: string | undefined = undefined;
  loading = false;
  error: string | null = null;

  async sendMessage() {
    if (!this.input && !this.selectedImage) return;
    this.messages.update((arr: { role: string; text: string; image?: string }[]) => [
      ...arr,
      { role: 'user', text: this.input, image: this.selectedImage }
    ]);
    const currentMessages = this.messages();
    this.input = '';
    this.selectedImage = undefined;
    this.loading = true;
    this.error = null;
    try {
      if (!this.apiKey) throw new Error('Gemini API key is missing. Click settings to add it.');
      const gemini = new GeminiService(this.apiKey);
      const response = await gemini.generateContent(currentMessages);
      this.messages.update((arr: { role: string; text: string; image?: string }[]) => [
        ...arr,
        { role: 'bot', text: response }
      ]);
    } catch (err: any) {
      this.error = err.message || 'Error contacting Gemini API.';
      this.messages.update((arr: { role: string; text: string; image?: string }[]) => [
        ...arr,
        { role: 'bot', text: this.error || '' }
      ]);
    } finally {
      this.loading = false;
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  startVoiceInput() {
    // Placeholder: Implement voice input logic
    alert('Voice input coming soon!');
  }
} 