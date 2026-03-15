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

  readonly submitted  = signal(false);
  readonly sending    = signal(false);
  readonly errorMsg   = signal('');

  readonly formData = signal({
    name:    '',
    email:   '',
    subject: '',
    message: '',
  });

  // Per-field inline validation errors
  readonly fieldErrors = signal<{
    name?:    string;
    email?:   string;
    message?: string;
  }>({});

  private readonly WEB3FORMS_KEY = '52d81049-31e9-455b-be6c-c17496e80dd7';

  updateField(field: string, value: string) {
    this.formData.update(d => ({ ...d, [field]: value }));
    // Clear the error for that field as the user types
    if (field in this.fieldErrors()) {
      this.fieldErrors.update(e => ({ ...e, [field]: undefined }));
    }
  }

  private validate(): boolean {
    const d = this.formData();
    const errors: { name?: string; email?: string; message?: string } = {};

    if (!d.name.trim()) {
      errors.name = 'Name is required.';
    }

    if (!d.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!d.message.trim()) {
      errors.message = 'Message is required.';
    } else if (d.message.trim().length < 10) {
      errors.message = 'Message is too short (min 10 characters).';
    }

    this.fieldErrors.set(errors);
    return Object.keys(errors).length === 0;
  }

  async submit() {
    this.errorMsg.set('');
    if (!this.validate()) return;

    const d = this.formData();
    this.sending.set(true);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key:  this.WEB3FORMS_KEY,
          name:        d.name.trim(),
          email:       d.email.trim(),
          subject:     d.subject.trim() || 'Portfolio Inquiry',
          message:     d.message.trim(),
          from_name:    'Portfolio Contact Form',
          replyto:      d.email.trim(),
          autoresponse: `Hi ${d.name.trim()},\n\nThank you for reaching out! I received your message and will get back to you as soon as possible.\n\nBest regards,\nJaren Kendrick`,
        }),
      });

      if (!res.ok) {
        // HTTP-level errors (4xx, 5xx)
        if (res.status === 422) {
          this.errorMsg.set('Invalid form data. Please check your inputs and try again.');
        } else if (res.status === 429) {
          this.errorMsg.set('Too many requests — please wait a moment and try again.');
        } else {
          this.errorMsg.set(`Server error (${res.status}). Please email me directly.`);
        }
        return;
      }

      const result = await res.json();

      if (result.success) {
        this.submitted.set(true);
        this.formData.set({ name: '', email: '', subject: '', message: '' });
        this.fieldErrors.set({});
        setTimeout(() => this.submitted.set(false), 6000);
      } else {
        this.errorMsg.set(
          result.message || 'Something went wrong. Please try again or email me directly.'
        );
      }
    } catch (err) {
      if (err instanceof TypeError) {
        // fetch() itself failed — likely no network
        this.errorMsg.set('No network connection. Check your internet and try again.');
      } else {
        this.errorMsg.set('An unexpected error occurred. Please email me directly.');
      }
    } finally {
      this.sending.set(false);
    }
  }
}
