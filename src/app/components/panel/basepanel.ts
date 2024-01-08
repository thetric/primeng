import { CommonModule } from '@angular/common';
import { BaseComponent } from 'primeng/basecomponent';
import name from './style/panelstyle';
import classes from './style/panelstyle';
import css from './style/panelstyle';

import { Directive, Input } from '@angular/core';

@Directive({ standalone: true })
export class BasePanel extends BaseComponent {
    /**
     * Defines if content of panel can be expanded and collapsed.
     * @group Props
     */
    @Input() toggleable: boolean | undefined;
    /**
     * Defines the header of the panel.
     * @group Props
     */
    @Input() header: string;
    /**
     * Defines the initial state of panel content, supports one or two-way binding as well.
     * @group Props
     */
    @Input() collapsed: boolean | undefined;

    classes = {
        root: () => ({
            'p-panel p-component': true,
            'p-panel-toggleable': this.toggleable,
            'p-panel-expanded': !this.collapsed && this.toggleable
        }),
        header: 'p-panel-header',
        title: 'p-panel-title',
        icon: 'p-panel-icons',
        toggler: 'p-panel-header-icon p-panel-toggler p-link',
        toggleablecontent: 'p-toggleable-content',
        content: 'p-panel-content',
        footer: 'p-panel-footer'
    };

    css = `
@layer primeng {
    .p-panel-header {
        background-color:red;
        display: flex;
        align-items: center;
    }

    .p-panel-title {
        line-height: 1;
        order: 1;
    }

    .p-panel-header-icon {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        text-decoration: none;
        overflow: hidden;
        position: relative;
    }

    .p-panel-toggleable.p-panel-expanded > .p-toggleable-content:not(.ng-animating) {
        overflow: visible;
    }

    .p-panel-toggleable .p-toggleable-content {
        overflow: hidden;
    }
}`;
}

// const css = `
// @layer primeng {
//     .p-panel-header {
//         background-color:red;
//         display: flex;
//         align-items: center;
//     }

//     .p-panel-title {
//         line-height: 1;
//         order: 1;
//     }

//     .p-panel-header-icon {
//         display: inline-flex;
//         justify-content: center;
//         align-items: center;
//         cursor: pointer;
//         text-decoration: none;
//         overflow: hidden;
//         position: relative;
//     }

//     .p-panel-toggleable.p-panel-expanded > .p-toggleable-content:not(.ng-animating) {
//         overflow: visible;
//     }

//     .p-panel-toggleable .p-toggleable-content {
//         overflow: hidden;
//     }
// }`;

// const classes = {
//     root: ({ props }) => ({
//         'p-panel p-component': true,
//         'p-panel-toggleable': props.toggleable,
//         'p-panel-expanded': !props.collapsed && props.toggleable
//     }),
//     header: 'p-panel-header',
//     title: 'p-panel-title',
//     icon: 'p-panel-icons',
//     toggler: 'p-panel-header-icon p-panel-toggler p-link',
//     toggleablecontent: 'p-toggleable-content',
//     content: 'p-panel-content',
//     footer: 'p-panel-footer'
// };

// const pt = {
//     panel: {
//         root: ({ props, instance, state }) => (props.toggleable ? 'hello world' : 'noooo')
//     }
// };
