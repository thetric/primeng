import { Directive, ElementRef, EventEmitter, Input, Output, TemplateRef, inject, signal } from '@angular/core';
import { BaseComponent } from 'primeng/basecomponent';
import { MenuItem } from '../api/menuitem';

@Directive({ standalone: true })
export class BaseTieredMenu extends BaseComponent {
    /**
     * An array of menuitems.
     * @group Props
     */
    @Input() set model(value: MenuItem[] | undefined) {
        this._model = value;
        this._processedItems = this.createProcessedItems(this._model || []);
    }
    get model(): MenuItem[] | undefined {
        return this._model;
    }
    /**
     * Defines if menu would displayed as a popup.
     * @group Props
     */
    @Input() popup: boolean | undefined;
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
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element.
     * @group Props
     */
    @Input() appendTo: HTMLElement | ElementRef | TemplateRef<any> | string | null | undefined | any;
    /**
     * Whether to automatically manage layering.
     * @group Props
     */
    @Input() autoZIndex: boolean = true;
    /**
     * Base zIndex value to use in layering.
     * @group Props
     */
    @Input() baseZIndex: number = 0;
    /**
     * Whether to show a root submenu on mouse over.
     * @defaultValue true
     * @group Props
     */
    @Input() autoDisplay: boolean | undefined = true;
    /**
     * Transition options of the show animation.
     * @group Props
     */
    @Input() showTransitionOptions: string = '.12s cubic-bezier(0, 0, 0.2, 1)';
    /**
     * Transition options of the hide animation.
     * @group Props
     */
    @Input() hideTransitionOptions: string = '.1s linear';
    /**
     * Current id state as a string.
     * @group Props
     */
    @Input() id: string | undefined;
    /**
     * Defines a string value that labels an interactive element.
     * @group Props
     */
    @Input() ariaLabel: string | undefined;
    /**
     * Identifier of the underlying input element.
     * @group Props
     */
    @Input() ariaLabelledBy: string | undefined;
    /**
     * When present, it specifies that the component should be disabled.
     * @group Props
     */
    @Input() disabled: boolean = false;
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    @Input() tabindex: number = 0;
    /**
     * Callback to invoke when overlay menu is shown.
     * @group Emits
     */
    @Output() onShow: EventEmitter<any> = new EventEmitter<any>();
    /**
     * Callback to invoke when overlay menu is hidden.
     * @group Emits
     */
    @Output() onHide: EventEmitter<any> = new EventEmitter<any>();

    _model: MenuItem[] | undefined;

    _processedItems: any[];

    visible = signal<boolean>(false);

    createProcessedItems(items: any, level: number = 0, parent: any = {}, parentKey: any = '') {
        const processedItems = [];

        items &&
            items.forEach((item, index) => {
                const key = (parentKey !== '' ? parentKey + '_' : '') + index;
                const newItem = {
                    item,
                    index,
                    level,
                    key,
                    parent,
                    parentKey
                };

                newItem['items'] = this.createProcessedItems(item.items, level + 1, newItem, key);
                processedItems.push(newItem);
            });

        return processedItems;
    }

    initParams() {
        return {
            props: {
                model: this.model,
                popup: this.popup,
                style: this.style,
                styleClass: this.styleClass,
                appendTo: this.appendTo,
                autoZIndex: this.autoZIndex,
                baseZIndex: this.baseZIndex,
                autoDisplay: this.autoDisplay,
                showTransitionOptions: this.showTransitionOptions,
                hideTransitionOptions: this.hideTransitionOptions,
                id: this.id,
                ariaLabel: this.ariaLabel,
                ariaLabelledBy: this.ariaLabelledBy,
                disabled: this.disabled,
                tabindex: this.tabindex,
                onShow: this.onShow,
                onHide: this.onHide
            },
            state: {
                visible: this.visible()
            }
        };
    }

    classes = {
        root: ({ props }) => {
            return {
                'p-tieredmenu p-component': true,
                'p-tieredmenu-overlay': props.popup
            };
        },
        menu: 'p-tieredmenu-root-list',
        menuitem: ({ instance, processedItem }) => {
            return {
                'p-menuitem': true,
                'p-menuitem-active p-highlight': instance.isItemActive(processedItem),
                'p-focus': instance?.isItemFocused(processedItem),
                'p-disabled': instance?.isItemDisabled(processedItem)
            };
        },
        content: 'p-menuitem-content',
        action: ({ instance, processedItem }) => {
            return {
                'p-menuitem-link': true,
                'p-disabled': instance.isItemDisabled(processedItem)
            };
        },
        icon: 'p-menuitem-icon',
        text: 'p-menuitem-text',
        submenuIcon: 'p-submenu-icon',
        badge: 'p-menuitem-badge',
        submenu: 'p-submenu-list',
        separator: 'p-menuitem-separator'
    };

    css = `
@layer primeng {
    .p-tieredmenu-overlay {
        position: absolute;
        top: 0;
        left: 0;
    }

    .p-tieredmenu ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .p-tieredmenu .p-submenu-list {
        position: absolute;
        min-width: 100%;
        z-index: 1;
        display: none;
    }

    .p-tieredmenu .p-menuitem-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
    }

    .p-tieredmenu .p-menuitem-text {
        line-height: 1;
    }

    .p-tieredmenu .p-menuitem {
        position: relative;
    }

    .p-tieredmenu .p-menuitem-link .p-submenu-icon:not(svg) {
        margin-left: auto;
    }

    .p-tieredmenu .p-menuitem-link .p-icon-wrapper {
        margin-left: auto;
    }

    .p-tieredmenu .p-menuitem-active > p-tieredmenusub > .p-submenu-list {
        display: block;
        left: 100%;
        top: 0;
    }

    .p-tieredmenu .p-menuitem-active > p-tieredmenusub > .p-submenu-list.p-submenu-list-flipped {
        left: -100%;
    }
}`;
}
