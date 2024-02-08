import { BaseComponent } from 'primeng/basecomponent';
import { Directive, EventEmitter, Input, Output, ContentChildren, QueryList, signal, effect } from '@angular/core';
import { AccordionTab } from './accordion';
import { AccordionTabCloseEvent, AccordionTabOpenEvent } from './accordion.interface';
import { Subscription } from 'rxjs';

@Directive({ standalone: true })
export class BaseAccordion extends BaseComponent {
    /**
     * When enabled, multiple tabs can be activated at the same time.
     * @group Props
     */
    @Input() multiple: boolean = false;
    /**
     * Inline style of the tab header and content.
     * @group Props
     */
    @Input() style: { [klass: string]: any } | null | undefined;
    /**
     * Class of the element.
     * @group Props
     */
    @Input() styleClass: string | undefined;
    /**
     * Icon of a collapsed tab.
     * @group Props
     */
    @Input() expandIcon: string | undefined;
    /**
     * Icon of an expanded tab.
     * @group Props
     */
    @Input() collapseIcon: string | undefined;
    /**
     * Index of the active tab or an array of indexes in multiple mode.
     * @group Props
     */
    @Input() get activeIndex(): number | number[] | null | undefined {
        return this._activeIndex();
    }
    set activeIndex(val: number | number[] | any[] | null | undefined) {
        if (this._activeIndex() !== val) {
            this._activeIndex.set(val);
        }
        if (this.preventActiveIndexPropagation) {
            this.preventActiveIndexPropagation = false;
            return;
        }

        this.updateSelectionState();
    }

    _activeIndex = signal<number | number[] | any[] | null | undefined>(undefined);

    activeIndexEffect = effect(() => {
        this.activeIndexChange.emit(this._activeIndex());
    });
    /**
     * When enabled, the focused tab is activated.
     * @group Props
     */
    @Input() selectOnFocus: boolean = false;
    /**
     * The aria-level that each accordion header will have. The default value is 2 as per W3C specifications
     * @group Props
     */
    @Input() get headerAriaLevel(): number {
        return this._headerAriaLevel;
    }
    set headerAriaLevel(val: number) {
        if (typeof val === 'number' && val > 0) {
            this._headerAriaLevel = val;
        } else if (this._headerAriaLevel !== 2) {
            this._headerAriaLevel = 2;
        }
    }
    /**
     * Callback to invoke when an active tab is collapsed by clicking on the header.
     * @param {AccordionTabCloseEvent} event - Custom tab close event.
     * @group Emits
     */
    @Output() onClose: EventEmitter<AccordionTabCloseEvent> = new EventEmitter();
    /**
     * Callback to invoke when a tab gets expanded.
     * @param {AccordionTabOpenEvent} event - Custom tab open event.
     * @group Emits
     */
    @Output() onOpen: EventEmitter<AccordionTabOpenEvent> = new EventEmitter();
    /**
     * Returns the active index.
     * @param {number | number[]} value - New index.
     * @group Emits
     */
    @Output() activeIndexChange: EventEmitter<number | number[]> = new EventEmitter<number | number[]>();

    @ContentChildren(AccordionTab, { descendants: true }) tabList: QueryList<AccordionTab> | undefined;

    tabListSubscription: Subscription | null = null;

    _headerAriaLevel: number = 2;

    preventActiveIndexPropagation: boolean = false;

    tabs: AccordionTab[] = [];

    initParams() {
        return {
            props: {
                multiple: this.multiple,
                style: this.style,
                styleClass: this.styleClass,
                expandIcon: this.expandIcon,
                collapseIcon: this.collapseIcon,
                activeIndex: this.activeIndex,
                selectOnFocus: this.selectOnFocus,
                headerAriaLevel: this.headerAriaLevel,
                onClose: this.onClose,
                onOpen: this.onOpen,
                activeIndexChange: this.activeIndexChange
            }
        };
    }

    updateSelectionState() {
        if (this.tabs && this.tabs.length && this._activeIndex() != null) {
            for (let i = 0; i < this.tabs.length; i++) {
                let selected = this.multiple ? (this._activeIndex() as number[]).includes(i) : i === this._activeIndex();
                let changed = selected !== this.tabs[i].selected;

                if (changed) {
                    this.tabs[i].selected = selected;
                }
            }
        }
    }

    classes = {
        root: 'p-accordion p-component'
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
