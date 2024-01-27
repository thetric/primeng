import { CommonModule } from '@angular/common';
import { BaseComponent } from 'primeng/basecomponent';

import { Directive, ElementRef, EventEmitter, Input, Output, SimpleChanges, effect, signal, computed } from '@angular/core';

@Directive({ standalone: true })
export class BaseAccordionTab extends BaseComponent {
    initParams() {
        return {
            props: {},
            state: {}
        };
    }

    classes = {};

    css = `
@layer primeng {

}`;
}
