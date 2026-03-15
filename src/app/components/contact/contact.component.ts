import { Component, signal, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';

// ── EmailJS config ──────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'service_injp6ys';
const EMAILJS_NOTIFY_TID  = 'template_nuocdgk';
const EMAILJS_REPLY_TID   = 'template_690wboe';
const EMAILJS_PUBLIC_KEY  = 'OziQGvoCmd0TkXjg1';
// ────────────────────────────────────────────────────────────────────────────

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

  readonly fieldErrors = signal<{
    name?:    string;
    email?:   string;
    message?: string;
  }>({});

  updateField(field: string, value: string) {
    this.formData.update(d => ({ ...d, [field]: value }));
    if (field in this.fieldErrors()) {
      this.fieldErrors.update(e => ({ ...e, [field]: undefined }));
    }
  }

  private validate(): boolean {
    const d = this.formData();
    const errors: { name?: string; email?: string; message?: string } = {};

    if (!d.name.trim())    errors.name    = 'Name is required.';

    if (!d.email.trim())   errors.email   = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim()))
                           errors.email   = 'Please enter a valid email address.';

    if (!d.message.trim()) errors.message = 'Message is required.';
    else if (d.message.trim().length < 10)
                           errors.message = 'Message is too short (min 10 characters).';

    this.fieldErrors.set(errors);
    return Object.keys(errors).length === 0;
  }

  async submit() {
    this.errorMsg.set('');
    if (!this.validate()) return;

    const d = this.formData();
    this.sending.set(true);

    const params = {
      name:    d.name.trim(),
      email:   d.email.trim(),
      title:   d.subject.trim() || 'Portfolio Inquiry',
      message: d.message.trim(),
    };

    try {
      // Send notification to you
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_NOTIFY_TID, params, { publicKey: EMAILJS_PUBLIC_KEY });
      // Send auto-reply to the sender
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_REPLY_TID,  params, { publicKey: EMAILJS_PUBLIC_KEY });

      this.submitted.set(true);
      this.formData.set({ name: '', email: '', subject: '', message: '' });
      this.fieldErrors.set({});
      setTimeout(() => this.submitted.set(false), 6000);
    } catch (err: any) {
      console.error('EmailJS error:', err?.status, err?.text ?? err);
      if (!navigator.onLine) {
        this.errorMsg.set('No network connection. Check your internet and try again.');
      } else if (err?.status === 429) {
        this.errorMsg.set('Too many requests — please wait a moment and try again.');
      } else {
        this.errorMsg.set('Something went wrong. Please email me directly.');
      }
    } finally {
      this.sending.set(false);
    }
  }
}
