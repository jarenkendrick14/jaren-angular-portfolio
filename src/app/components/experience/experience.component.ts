import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css',
})
export class ExperienceComponent {
  @Input() active = false;
  readonly entries = [
    {
      period: 'Apr 2025 — Present',
      org: 'VirtuIntelligence · Part-time · Remote',
      title: 'Game Developer',
      desc: 'Building VR applications using Unreal Engine 5.5 Blueprints. Shipped PathFinder (VR journaling app) in Unity. Currently developing an action title, <em>\'Robots vs Aliens\'</em>, in Unity. Writing complex game systems in C# has heavily sharpened my backend logic, object-oriented design, and ability to architect scalable features.',
      tags: ['Unreal 5.5', 'Blueprints', 'Unity', 'C#', 'Backend Logic'],
    },
    {
      period: 'Jun 2023 — 2027',
      org: 'Holy Angel University · Pampanga, PH',
      title: 'BS Information Technology',
      desc: 'Specialization in Web Development. Coursework spanning full-stack architecture, database systems, software engineering principles, and deployment workflows.',
      tags: [],
    },
  ];
}