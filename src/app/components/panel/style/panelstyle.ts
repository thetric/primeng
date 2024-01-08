import { Component, Injectable } from '@angular/core';
import { Panel } from 'primeng/panel';
// @Injectable()
// export class PanelStyle {
//     _props: any;
//     get props() {
//         return this._props;
//     }
//     set props(value) {
//         this._props = value;
//     }

//     constructor(public panel: Panel) {}

//     get toggleable() {
//         return this.panel.toggleable;
//     }

//     css = `
//     @layer primeng {
//         .p-panel-header {
//             background-color:red;
//             display: flex;
//             align-items: center;
//         }

//         .p-panel-title {
//             line-height: 1;
//             order: 1;
//         }

//         .p-panel-header-icon {
//             display: inline-flex;
//             justify-content: center;
//             align-items: center;
//             cursor: pointer;
//             text-decoration: none;
//             overflow: hidden;
//             position: relative;
//         }

//         .p-panel-toggleable.p-panel-expanded > .p-toggleable-content:not(.ng-animating) {
//             overflow: visible;
//         }

//         .p-panel-toggleable .p-toggleable-content {
//             overflow: hidden;
//         }
//     }`;

//     public get baseStyle() {
//         return this.css;
//     }

//     classes = {
//         root: () => ({
//             'p-panel p-component': true,
//             'p-panel-toggleable': this.props.toggleable,
//             'p-panel-expanded': !this.props.collapsed && this.props.toggleable
//         }),
//         header: 'p-panel-header',
//         title: 'p-panel-title',
//         icon: 'p-panel-icons',
//         toggler: 'p-panel-header-icon p-panel-toggler p-link',
//         toggleablecontent: 'p-toggleable-content',
//         content: 'p-panel-content',
//         footer: 'p-panel-footer'
//     };
// }

const css = `
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

const classes = {
    root: (props) =>
        props && {
            'p-panel p-component': true,
            'p-panel-toggleable': props.toggleable,
            'p-panel-expanded': !props.collapsed && props.toggleable
        },
    header: 'p-panel-header',
    title: 'p-panel-title',
    icon: 'p-panel-icons',
    toggler: 'p-panel-header-icon p-panel-toggler p-link',
    toggleablecontent: 'p-toggleable-content',
    content: 'p-panel-content',
    footer: 'p-panel-footer'
};

export default {
    name: 'panel',
    css,
    classes
};
