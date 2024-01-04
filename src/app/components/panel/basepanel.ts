import { CommonModule } from '@angular/common';
import { BaseComponent } from 'primeng/basecomponent';
import PanelStyle from './style/panelstyle';
import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewEncapsulation } from '@angular/core';

@Directive({ standalone: true })
export class BasePanel extends BaseComponent {
    /**
     * Defines if content of panel can be expanded and collapsed.
     * @group Props
     */
    @Input() toggleable: boolean | undefined;
    @Input() header: string;
    /**
     * Defines the initial state of panel content, supports one or two-way binding as well.
     * @group Props
     */
    @Input() collapsed: boolean | undefined;

    styles: PanelStyle = new PanelStyle();

    cx(section) {
        return this.styles.classes[section];
    }

    sx(section) {}
}
