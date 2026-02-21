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

  readonly formData = signal({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  updateField(field: string, value: string) {
    this.formData.update(d => ({ ...d, [field]: value }));
  }

  submit() {
    const d = this.formData();
    if (!d.name || !d.email || !d.message) return;
    const body = encodeURIComponent(`Hi Jaren,\n\n${d.message}\n\nFrom: ${d.name}\nEmail: ${d.email}`);
    const subject = encodeURIComponent(d.subject || 'Portfolio Inquiry');
    window.location.href = `mailto:jarenkendrickyambao@gmail.com?subject=${subject}&body=${body}`;
    this.submitted.set(true);
    setTimeout(() => {
      this.submitted.set(false);
      this.formData.set({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  }
}