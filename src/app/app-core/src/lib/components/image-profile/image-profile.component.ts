import { Component } from '@angular/core';
import {UsuarioService} from "../../services/usuario.service";
import {Router} from "@angular/router";

@Component({
  selector: 'lib-image-profile',
  templateUrl: './image-profile.component.html',
  styleUrls: ['./image-profile.component.scss']
})

export class ImageProfileComponent {

  name: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.name = this.usuarioService.getNomeLogado();
  }

  getInitial(name: string): string {
    if (!name) return '';
    return name.trim().charAt(0).toUpperCase();
  }

  getAvatarColor(name: string): string {
    const colors = [
      '#F44336', '#E91E63', '#9C27B0',
      '#3F51B5', '#2196F3', '#03A9F4',
      '#009688', '#4CAF50', '#FFC107',
      '#FF9800', '#795548'
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  }

}
