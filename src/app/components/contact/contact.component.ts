import { Component, signal, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  @Input() active = false;
  readonly submitted = signal(false);
  readonly sending = signal(false);
  readonly errorMsg = signal('');

  readonly formData = signal({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // ──────────────────────────────────────────────────────
  // HOW TO SET UP:
  // 1. Go to https://web3forms.com
  // 2. Enter your email: jarenkendrickyambao@gmail.com
  // 3. Check your inbox for the access key
  // 4. Replace the string below with your real key
  // ──────────────────────────────────────────────────────
  private readonly WEB3FORMS_KEY = '52d81049-31e9-455b-be6c-c17496e80dd7';

  updateField(field: string, value: string) {
    this.formData.update(d => ({ ...d, [field]: value }));
  }

  async submit() {
    const d = this.formData();
    if (!d.name || !d.email || !d.message) return;

    this.sending.set(true);
    this.errorMsg.set('');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: this.WEB3FORMS_KEY,
          name: d.name,
          email: d.email,
          subject: d.subject || 'Portfolio Inquiry',
          message: d.message,
          from_name: 'Portfolio Contact Form',
        }),
      });

      const result = await res.json();

      if (result.success) {
        this.submitted.set(true);
        this.formData.set({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => this.submitted.set(false), 5000);
      } else {
        this.errorMsg.set('Something went wrong. Please try again or email me directly.');
      }
    } catch {
      this.errorMsg.set('Network error. Please try again or email me directly.');
    } finally {
      this.sending.set(false);
    }
  }
}