import { ContentChildren, Directive, EventEmitter, Input, Output, effect, signal } from '@angular/core';
import { BaseComponent } from 'primeng/basecomponent';
import { UniqueComponentId } from '../utils/uniquecomponentid';
import { FieldsetAfterToggleEvent, FieldsetBeforeToggleEvent } from './fieldset.interface';

@Directive({ standalone: true })
export class BaseFieldset extends BaseComponent {
    /**
     * Header text of the fieldset.
     * @group Props
     */
    @Input() legend: string | undefined;
    /**
     * When specified, content can toggled by clicking the legend.
     * @group Props
     * @defaultValue false
     */
    @Input() toggleable: boolean | undefined;
    /**
     * Defines the default visibility state of the content.
     * * @group Props
     */
    _collapsed = signal<boolean>(false);

    @Input() get collapsed() {
        return this._collapsed();
    }

    set collapsed(value: boolean) {
        this._collapsed.set(value);
    }

    _collapsedChange = effect(() => {
        this.collapsedChange.emit(this._collapsed());
        this.params = this.initParams();
    });
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
     * Transition options of the panel animation.
     * @group Props
     */
    @Input() transitionOptions: string = '400ms cubic-bezier(0.86, 0, 0.07, 1)';
    /**
     * Emits when the collapsed state changes.
     * @param {boolean} value - New value.
     * @group Emits
     */
    @Output() collapsedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    /**
     * Callback to invoke before panel toggle.
     * @param {PanelBeforeToggleEvent} event - Custom toggle event
     * @group Emits
     */
    @Output() onBeforeToggle: EventEmitter<FieldsetBeforeToggleEvent> = new EventEmitter<FieldsetBeforeToggleEvent>();
    /**
     * Callback to invoke after panel toggle.
     * @param {PanelAfterToggleEvent} event - Custom toggle event
     * @group Emits
     */
    @Output() onAfterToggle: EventEmitter<FieldsetAfterToggleEvent> = new EventEmitter<FieldsetAfterToggleEvent>();
    /**
     * Callback to invoke on animation end.
     * @param {Event} event - Animation event
     * @group Emits
     */
    @Output() onAnimationEnd: EventEmitter<any> = new EventEmitter();
    /**
     * Callback to invoke on animation start.
     * @param {Event} event - Animation event
     * @group Emits
     */
    @Output() onAnimationStart: EventEmitter<any> = new EventEmitter();

    animating = signal<boolean>(false);

    _animationChange = effect(() => {
        if (this.animating() === false) {
            this.onAnimationEnd.emit();
        } else {
            this.onAnimationStart.emit();
        }

        this.params = this.initParams();
    });

    initParams() {
        return {
            props: {
                legend: this.legend,
                toggleable: this.toggleable,
                collapsed: this._collapsed(),
                style: this.style,
                styleClass: this.styleClass,
                transitionOptions: this.transitionOptions,
                collapsedChange: this.collapsedChange,
                onBeforeToggle: this.onBeforeToggle,
                onAfterToggle: this.onAfterToggle,
                onAnimationEnd: this.onAnimationEnd,
                onAnimationStart: this.onAnimationStart
            },
            state: {
                animating: this.animating()
            }
        };
    }

    classes = {
        root: ({ props, state }) => {
            console.log(props, state);
            return {
                'p-fieldset p-component': true,
                'p-fieldset-toggleable': props.toggleable,
                'p-fieldset-expanded': !props.collapsed && props.toggleable
            };
        },
        legend: 'p-fieldset-legend',
        legendtitle: 'p-fieldset-legend-text',
        togglericon: 'p-fieldset-toggler',
        toggleablecontent: 'p-toggleable-content',
        content: 'p-fieldset-content'
    };

    css = `@layer primeng {
    .p-fieldset-legend > a,
    .p-fieldset-legend > span {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .p-fieldset-toggleable .p-fieldset-legend a {
        cursor: pointer;
        user-select: none;
        overflow: hidden;
        position: relative;
    }

    .p-fieldset-legend-text {
        line-height: 1;
    }

    .p-fieldset-toggleable.p-fieldset-expanded > .p-toggleable-content:not(.ng-animating) {
        overflow: visible;
    }

    .p-fieldset-toggleable .p-toggleable-content {
        overflow: hidden;
    }
} 
`;
}
