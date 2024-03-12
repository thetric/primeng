import { ContentChildren, Directive, EventEmitter, Input, Output, QueryList, effect, signal } from '@angular/core';
import { BaseComponent } from 'primeng/basecomponent';
import { TabPanel } from './tabview';
import { TabViewChangeEvent, TabViewCloseEvent } from './tabview.interface';

@Directive({ standalone: true })
export class BaseTabView extends BaseComponent {
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
     * Whether tab close is controlled at onClose event or not.
     * @defaultValue false
     * @group Props
     */
    @Input() controlClose: boolean | undefined;
    /**
     * When enabled displays buttons at each side of the tab headers to scroll the tab list.
     * @defaultValue false
     * @group Props
     */
    @Input() scrollable: boolean | undefined;
    /**
     * Index of the active tab to change selected tab programmatically.
     * @group Props
     */
    // _activeIndex!: number;
    _activeIndex = signal<number | undefined>(undefined);
    @Input() get activeIndex(): number {
        return this._activeIndex();
    }
    set activeIndex(val: number) {
        this._activeIndex.set(val);
        if (this.preventActiveIndexPropagation) {
            this.preventActiveIndexPropagation = false;
            return;
        }

        if (this.tabs && this.tabs.length && this._activeIndex() != null && this.tabs.length > this._activeIndex()) {
            (this['findSelectedTab']() as TabPanel).selected = false;
            this.tabs[this._activeIndex()].selected = true;
            this.tabChanged = true;

            this['updateScrollBar'](val);
        }
    }

    _activeIndexChange = effect(() => {
        this.activeIndexChange.emit(this._activeIndex());
    });
    /**
     * When enabled, the focused tab is activated.
     * @group Props
     */
    @Input() selectOnFocus: boolean = false;
    /**
     * Used to define a string aria label attribute the forward navigation button.
     * @group Props
     */
    @Input() nextButtonAriaLabel: string | undefined;
    /**
     * Used to define a string aria label attribute the backward navigation button.
     * @group Props
     */
    @Input() prevButtonAriaLabel: string | undefined;
    /**
     * When activated, navigation buttons will automatically hide or show based on the available space within the container.
     * @group Props
     */
    @Input() autoHideButtons: boolean = true;
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    @Input() tabindex: number = 0;
    /**
     * Callback to invoke on tab change.
     * @param {TabViewChangeEvent} event - Custom tab change event
     * @group Emits
     */
    @Output() onChange: EventEmitter<TabViewChangeEvent> = new EventEmitter<TabViewChangeEvent>();
    /**
     * Callback to invoke on tab close.
     * @param {TabViewCloseEvent} event - Custom tab close event
     * @group Emits
     */
    @Output() onClose: EventEmitter<TabViewCloseEvent> = new EventEmitter<TabViewCloseEvent>();
    /**
     * Callback to invoke on the active tab change.
     * @param {number} index - New active index
     * @group Emits
     */
    @Output() activeIndexChange: EventEmitter<number> = new EventEmitter<number>();

    @ContentChildren(TabPanel) tabPanels: QueryList<TabPanel> | undefined;

    tabs!: TabPanel[];

    tabChanged: boolean | undefined;

    preventActiveIndexPropagation!: boolean;

    initParams() {
        return {
            props: {
                style: this.style,
                styleClass: this.styleClass,
                controlClose: this.controlClose,
                scrollable: this.scrollable,
                activeIndex: this.activeIndex,
                selectOnFocus: this.selectOnFocus,
                nextButtonAriaLabel: this.nextButtonAriaLabel,
                prevButtonAriaLabel: this.prevButtonAriaLabel,
                autoHideButtons: this.autoHideButtons,
                tabindex: this.tabindex,
                onChange: this.onChange,
                onClose: this.onClose,
                activeIndexChange: this.activeIndexChange
            },
            state: {}
        };
    }

    classes = {
        root: ({ props }) => {
            return {
                'p-tabview p-component': true,
                'p-tabview-scrollable': props.scrollable
            };
        },
        navContainer: 'p-tabview-nav-container',
        navContent: 'p-tabview-nav-content',
        nav: 'p-tabview-nav',
        tab: {
            header: ({ instance, tab, index }) => {
                return {
                    'p-tabview-header': true,
                    [instance.getTabProp(tab, 'headerClass')]: true,
                    'p-highlight': instance._activeIndex() === index,
                    'p-disabled': instance.getTabProp(tab, 'disabled')
                };
            },
            headerAction: 'p-tabview-nav-link p-tabview-header-action',
            headerTitle: 'p-tabview-title',
            content: ({ instance, tab }) => {
                return {
                    'p-tabview-panel': true,
                    [instance.getTabProp(tab, 'contentClass')]: true
                };
            }
        },
        inkbar: 'p-tabview-ink-bar',
        panelContainer: 'p-tabview-panels',
        previousButton: 'p-tabview-nav-prev p-tabview-nav-btn p-link',
        nextButton: 'p-tabview-nav-next p-tabview-nav-btn p-link',
        closeIcon: 'p-tabview-close'
    };

    css = `@layer primeng {
    .p-tabview-nav-container {
        position: relative;
    }

    .p-tabview-scrollable .p-tabview-nav-container {
        overflow: hidden;
    }

    .p-tabview-nav-content {
        overflow-x: auto;
        overflow-y: hidden;
        scroll-behavior: smooth;
        scrollbar-width: none;
        overscroll-behavior: contain auto;
    }

    .p-tabview-nav {
        display: inline-flex;
        min-width: 100%;
        margin: 0;
        padding: 0;
        list-style-type: none;
        flex: 1 1 auto;
    }

    .p-tabview-nav-link {
        cursor: pointer;
        user-select: none;
        display: flex;
        align-items: center;
        position: relative;
        text-decoration: none;
        overflow: hidden;
    }

    .p-tabview-ink-bar {
        display: none;
        z-index: 1;
    }

    .p-tabview-nav-link:focus {
        z-index: 1;
    }

    .p-tabview-title {
        line-height: 1;
        white-space: nowrap;
    }

    .p-tabview-nav-btn {
        position: absolute;
        top: 0;
        z-index: 2;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .p-tabview-nav-prev {
        left: 0;
    }

    .p-tabview-nav-next {
        right: 0;
    }

    .p-tabview-nav-content::-webkit-scrollbar {
        display: none;
    }

    .p-tabview-close {
        z-index: 1;
    }
}`;
}
