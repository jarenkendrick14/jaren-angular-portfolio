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
      title: 'Game/App Developer',
      desc: 'Shipped PathFinder, a VR self-discovery app, to the Meta Quest store using Unreal Engine 5.5 Blueprints and Unity. Currently developing <em>Robots vs Aliens</em>, a tower defense mobile game in Unity (C#). Built Symposium, a real-time AI-mediated chat platform using Angular, Ionic, Node.js, and PostgreSQL. Working across diverse tech stacks has strengthened my full-stack architecture and problem-solving skills.',
      tags: ['Unreal 5.5', 'Blueprints', 'Unity', 'C#', 'Angular', 'Ionic', 'Node.js', 'PostgreSQL'],
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