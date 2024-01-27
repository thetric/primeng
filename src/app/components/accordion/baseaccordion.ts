import { CommonModule } from '@angular/common';
import { BaseComponent } from 'primeng/basecomponent';
import name from './style/accordionstyle';
import css from './style/accordionstyle';

import { Directive, ElementRef, EventEmitter, Input, Output, SimpleChanges, effect, signal, computed, ChangeDetectorRef } from '@angular/core';

@Directive({ standalone: true })
export class BaseAccordion extends BaseComponent {
    initParams() {
        return {
            props: {},
            state: {}
        };
    }

    constructor(public el: ElementRef, public changeDetector: ChangeDetectorRef) {
        super(el);
    }

    classes = {};

    css = `
@layer primeng {

}`;
}
