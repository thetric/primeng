import { Directive, EventEmitter, Input, Output, signal } from '@angular/core';
import { BaseComponent } from 'primeng/basecomponent';
import { PanelBeforeToggleEvent, PanelAfterToggleEvent } from './panel.interface';

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
    _collapsed = signal<boolean>(false);
    @Input() set collapsed(value: boolean | undefined) {
        if (this._collapsed() !== value) {
            this._collapsed.set(value);
        }
    }
    /**
     * Inline style of the component.
     * @group Props
     */
    @Input() style: { [klass: string]: any } | null | undefined;
    /**
     * Style class of the component.
     * @group Props
     */
    @Input() styleClass: string | undefined;
    /**
     * Position of the icons.
     * @group Props
     */
    @Input() iconPos: 'start' | 'end' | 'center' = 'end';
    /**
     * Expand icon of the toggle button.
     * @group Props
     * @deprecated since v15.4.2, use `headericons` template instead.
     */
    @Input() expandIcon: string | undefined;
    /**
     * Collapse icon of the toggle button.
     * @group Props
     * @deprecated since v15.4.2, use `headericons` template instead.
     */
    @Input() collapseIcon: string | undefined;
    /**
     * Specifies if header of panel cannot be displayed.
     * @group Props
     * @deprecated since v15.4.2, use `headericons` template instead.
     */
    @Input() showHeader: boolean = true;
    /**
     * Specifies the toggler element to toggle the panel content.
     * @group Props
     */
    @Input() toggler: 'icon' | 'header' = 'icon';
    /**
     * Transition options of the animation.
     * @group Props
     */
    @Input() transitionOptions: string = '400ms cubic-bezier(0.86, 0, 0.07, 1)';
    /**
     * Emitted when the collapsed changes.
     * @param {boolean} value - New Value.
     * @group Emits
     */
    @Output() collapsedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    /**
     * Callback to invoke before panel toggle.
     * @param {PanelBeforeToggleEvent} event - Custom panel toggle event
     * @group Emits
     */
    @Output() onBeforeToggle: EventEmitter<PanelBeforeToggleEvent> = new EventEmitter<PanelBeforeToggleEvent>();
    /**
     * Callback to invoke after panel toggle.
     * @param {PanelAfterToggleEvent} event - Custom panel toggle event
     * @group Emits
     */
    @Output() onAfterToggle: EventEmitter<PanelAfterToggleEvent> = new EventEmitter<PanelAfterToggleEvent>();

    animating = signal<boolean>(false);

    initParams() {
        return {
            props: {
                toggler: this.toggler,
                style: this.style,
                styleClass: this.styleClass,
                iconPos: this.iconPos,
                expandIcon: this.expandIcon,
                collapseIcon: this.collapseIcon,
                showHeader: this.showHeader,
                transitionOptions: this.transitionOptions,
                header: this.header,
                toggleable: this.toggleable,
                collapsed: this._collapsed(),
                collapsedChange: this.collapsedChange,
                onBeforeToggle: this.onBeforeToggle,
                onAfterToggle: this.onAfterToggle
            },
            state: {
                animating: this.animating
            }
        };
    }

    classes = {
        root: ({ props }) => {
            return {
                'p-panel p-component': true,
                'p-panel-toggleable': props.toggleable,
                'p-panel-expanded': !props.collapsed && props.toggleable
            };
        },
        header: 'p-panel-header',
        title: 'p-panel-title',
        icon: ({ props }) => ({
            'p-panel-icons': true,
            'p-panel-icons-start': props.iconPos === 'start',
            'p-panel-icons-end': props.iconPos === 'end',
            'p-panel-icons-center': props.iconPos === 'center'
        }),
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
