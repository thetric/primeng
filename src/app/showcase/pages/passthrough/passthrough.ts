import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BindModule } from 'primeng/bind';

@Component({
    standalone: true,
    selector: 'passhthrough',
    imports: [CommonModule, BindModule],
    template: ` <div class="hello world" [pBind]="{ 'aria-label': 'deneme-123', style: 'background-color: red', onclick: myconsole, class: 'text-3xl' }">hello world</div> `
})
export class Passthrough {
    myconsole() {
        console.log('clickev');
    }
}
