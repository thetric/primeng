import { BaseComponent } from 'primeng/basecomponent';
import { Directive, EventEmitter, Input, Output, signal, forwardRef, inject, effect } from '@angular/core';
import { Accordion } from './accordion';

@Directive({ standalone: true })
export class BaseAccordionTab extends BaseComponent {
    /**
     * Current id state as a string.
     * @group Props
     */
    @Input() id: string | undefined;
    /**
     * Used to define the header of the tab.
     * @group Props
     */
    @Input() header: string | undefined;
    /**
     * Inline style of the tab header.
     * @group Props
     */
    @Input() headerStyle: { [klass: string]: any } | null | undefined;
    /**
     * Inline style of the tab.
     * @group Props
     */
    @Input() tabStyle: { [klass: string]: any } | null | undefined;
    /**
     * Inline style of the tab content.
     * @group Props
     */
    @Input() contentStyle: { [klass: string]: any } | null | undefined;
    /**
     * Style class of the tab.
     * @group Props
     */
    @Input() tabStyleClass: string | undefined;
    /**
     * Style class of the tab header.
     * @group Props
     */
    @Input() headerStyleClass: string | undefined;
    /**
     * Style class of the tab content.
     * @group Props
     */
    @Input() contentStyleClass: string | undefined;
    /**
     * Whether the tab is disabled.
     * @group Props
     */
    @Input() disabled: boolean | undefined;
    /**
     * Whether a lazy loaded panel should avoid getting loaded again on reselection.
     * @group Props
     */
    @Input() cache: boolean = true;
    /**
     * Transition options of the animation.
     * @group Props
     */
    @Input() transitionOptions: string = '400ms cubic-bezier(0.86, 0, 0.07, 1)';
    /**
     * Position of the icon.
     * @group Props
     */
    @Input() iconPos: 'end' | 'start' = 'start';
    /**
     * The value that returns the selection.
     * @group Props
     */
    get selected(): boolean {
        return this._selected();
    }
    @Input() set selected(val: boolean) {
        if (this._selected() !== val) {
            this._selected.set(val);
        }

        if (!this.loaded) {
            if (this._selected() && this.cache) {
                this.loaded.set(true);
            }
        }
    }

    _selected = signal<boolean>(false);

    selectChangeEffect = effect(() => {
        this.selectedChange.emit(this._selected());
    });
    /**
     * The aria-level that each accordion header will have. The default value is 2 as per W3C specifications
     * @group Props
     */
    @Input() headerAriaLevel: number = 2;
    /**
     * Event triggered by changing the choice.
     * @param {boolean} value - Boolean value indicates that the option is changed.
     * @group Emits
     */
    @Output() selectedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    loaded = signal<boolean>(false);

    accordion = inject(forwardRef(() => Accordion)) as Accordion;

    initParams() {
        return {
            props: {
                id: this.id,
                header: this.header,
                headerStyle: this.headerStyle,
                tabStyle: this.tabStyle,
                contentStyle: this.contentStyle,
                tabStyleClass: this.tabStyleClass,
                headerStyleClass: this.headerStyleClass,
                contentStyleClass: this.contentStyleClass,
                disabled: this.disabled,
                cache: this.cache,
                transitionOptions: this.transitionOptions,
                iconPos: this.iconPos,
                selected: this._selected(),
                headerAriaLevel: this.headerAriaLevel,
                selectedChange: this.selectedChange
            },
            state: {
                selected: this._selected(),
                loaded: this.loaded()
            }
        };
    }

    classes = {
        root: ({ props, state }) => {
            return {
                'p-accordion-tab': true,
                'p-accordion-tab-active': state.selected,
                'p-disabled': props.disabled
            };
        },
        header: ({ props, state }) => {
            return {
                'p-accordion-header': true,
                'p-highlight': state.selected,
                'asdasdasd-adasdas': true,
                'p-disabled': props.disabled
            };
        },
        headerAction: 'p-accordion-header-link p-accordion-header-action',
        headerTitle: 'p-accordion-header-text',
        headerIcon: ({ props }) => {
            return {
                'p-accordion-toggle-icon-end': props.iconPos === 'end',
                'p-accordion-toggle-icon': props.iconPos === 'start'
            };
        },
        toggleableContent: 'p-toggleable-content',
        content: 'p-accordion-content'
    };

    css = `
@layer primeng {
    .p-accordion-header-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        user-select: none;
        position: relative;
        text-decoration: none;
    }

    .p-accordion-header-link:focus {
        z-index: 1;
    }

    .p-accordion-header-text {
        line-height: 1;
    }

    .p-accordion .p-toggleable-content {
        overflow: hidden;
    }

    .p-accordion .p-accordion-tab-active > .p-toggleable-content:not(.ng-animating) {
        overflow: inherit;
    }

    .p-accordion-toggle-icon-end {
        order: 1;
        margin-left: auto;
    }

    .p-accordion-toggle-icon {
        order: 0;
    }
}`;
}
