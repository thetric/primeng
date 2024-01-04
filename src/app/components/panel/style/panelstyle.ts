import { Component, Injectable } from '@angular/core';
@Injectable()
class PanelStyle {
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

    public get baseStyle() {
        return this.css;
    }

    classes = {
        root: ({ props }) => ({
            'p-panel p-component': true,
            'p-panel-toggleable': props.toggleable,
            'p-panel-expanded': !props.collapsed && props.toggleable
        }),
        header: 'p-panel-header',
        title: 'p-panel-title',
        icon: 'p-panel-icons',
        toggler: 'p-panel-header-icon p-panel-toggler p-link',
        toggleablecontent: 'p-toggleable-content',
        content: 'p-panel-content',
        footer: 'p-panel-footer'
    };
}
export default PanelStyle;
