import { AnimationEvent, animate, style, transition, trigger } from '@angular/animations';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    NgModule,
    OnDestroy,
    OnInit,
    Output,
    PLATFORM_ID,
    QueryList,
    Renderer2,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
    ViewRef,
    effect,
    forwardRef,
    inject,
    signal
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem, OverlayService, PrimeNGConfig, PrimeTemplate, SharedModule } from 'primeng/api';
import { ConnectedOverlayScrollHandler, DomHandler } from 'primeng/dom';
import { AngleRightIcon } from 'primeng/icons/angleright';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { Nullable, VoidListener } from 'primeng/ts-helpers';
import { ObjectUtils, UniqueComponentId, ZIndexUtils } from 'primeng/utils';
import { Bind } from 'primeng/bind';
import { BaseTieredMenu } from './basetieredmenu';
import { BaseComponent } from 'primeng/basecomponent';

@Component({
    selector: 'p-tieredMenuSub',
    template: ` <ul
        #sublist
        role="menu"
        [ngClass]="root ? cx('menu') : cx('submenu')"
        [pBind]="root ? ptm('menu') : ptm('submenu')"
        [id]="menuId + '_list'"
        [tabindex]="tabindex"
        [attr.aria-label]="ariaLabel"
        [attr.aria-labelledBy]="ariaLabelledBy"
        [attr.aria-activedescendant]="focusedItemId"
        [attr.aria-orientation]="'vertical'"
        (keydown)="menuKeydown.emit($event)"
        (focus)="menuFocus.emit($event)"
        (blur)="menuBlur.emit($event)"
    >
        <ng-template ngFor let-processedItem [ngForOf]="items" let-index="index">
            <li
                *ngIf="isItemVisible(processedItem) && getItemProp(processedItem, 'separator')"
                [pBind]="ptm('separator')"
                [ngClass]="mergeClasses(cx('separator'), getSeparatorItemClass(processedItem))"
                [attr.id]="getItemId(processedItem)"
                [style]="getItemProp(processedItem, 'style')"
                role="separator"
            ></li>
            <li
                #listItem
                *ngIf="isItemVisible(processedItem) && !getItemProp(processedItem, 'separator')"
                role="menuitem"
                [pBind]="getPTOptions(processedItem, index, 'menuitem')"
                [attr.id]="getItemId(processedItem)"
                [attr.data-p-highlight]="isItemActive(processedItem)"
                [attr.data-p-focused]="isItemFocused(processedItem)"
                [attr.data-p-disabled]="isItemDisabled(processedItem)"
                [attr.aria-label]="getItemLabel(processedItem)"
                [attr.aria-disabled]="isItemDisabled(processedItem) || undefined"
                [attr.aria-haspopup]="isItemGroup(processedItem) && !getItemProp(processedItem, 'to') ? 'menu' : undefined"
                [attr.aria-expanded]="isItemGroup(processedItem) ? isItemActive(processedItem) : undefined"
                [attr.aria-level]="level + 1"
                [attr.aria-setsize]="getAriaSetSize()"
                [attr.aria-posinset]="getAriaPosInset(index)"
                [ngStyle]="getItemProp(processedItem, 'style')"
                [ngClass]="mergeClasses(cx('menuitem', {processedItem}), getItemClass(processedItem))"
                [class]="getItemProp(processedItem, 'styleClass')"
                pTooltip
                [tooltipOptions]="getItemProp(processedItem, 'tooltipOptions')"
            >
                <div [pBind]="getPTOptions(processedItem, index, 'content')" [ngClass]="cx('content')" (click)="onItemClick($event, processedItem)" (mouseenter)="onItemMouseEnter({$event, processedItem})">
                    <ng-container *ngIf="!itemTemplate">
                        <a
                            [ngClass]="mergeClasses(cx('action', {processedItem}), getItemProp(processedItem, 'styleClass'))"
                            [pBind]="getPTOptions(processedItem, index, 'action')"
                            *ngIf="!getItemProp(processedItem, 'routerLink')"
                            [attr.href]="getItemProp(processedItem, 'url')"
                            [attr.aria-hidden]="true"
                            [attr.data-automationid]="getItemProp(processedItem, 'automationId')"
                            [target]="getItemProp(processedItem, 'target')"
                            [attr.tabindex]="-1"
                            pRipple
                        >
                            <span
                                *ngIf="getItemProp(processedItem, 'icon')"
                                [pBind]="getPTOptions(processedItem, index, 'icon')"
                                [ngClass]="mergeClasses(cx('icon'), getItemProp(processedItem, 'icon'))"
                                [class]="getItemProp(processedItem, 'iconClass')"
                                [ngStyle]="getItemProp(processedItem, 'iconStyle')"
                                [attr.aria-hidden]="true"
                                [attr.tabindex]="-1"
                            >
                            </span>
                            <span *ngIf="getItemProp(processedItem, 'escape'); else htmlLabel" [pBind]="getPTOptions(processedItem, index, 'label')" [ngClass]="cx('text')">
                                {{ getItemLabel(processedItem) }}
                            </span>
                            <ng-template #htmlLabel>
                                <span [innerHTML]="getItemLabel(processedItem)" [pBind]="getPTOptions(processedItem, index, 'label')" [ngClass]="cx('text')"></span>
                            </ng-template>
                            <span *ngIf="getItemProp(processedItem, 'badge')" [pBind]="getPTOptions(processedItem, index, 'badge')" [ngClass]="mergeClasses(cx('badge'), getItemProp(processedItem, 'badgeStyleClass'))">{{
                                getItemProp(processedItem, 'badge')
                            }}</span>

                            <ng-container *ngIf="isItemGroup(processedItem)">
                                <AngleRightIcon
                                    *ngIf="!parentInstance.submenuIconTemplate"
                                    [styleClass]="mergeClasses(cx('submenuIcon'), getItemProp(processedItem, 'iconClass'))"
                                    [pBind]="getPTOptions(processedItem, index, 'submenuIcon')"
                                    [attr.aria-hidden]="true"
                                />
                                <ng-template *ngTemplateOutlet="parentInstance.submenuIconTemplate" [pBind]="getPTOptions(processedItem, index, 'submenuIcon')" [attr.aria-hidden]="true"></ng-template>
                            </ng-container>
                        </a>
                        <a
                            *ngIf="getItemProp(processedItem, 'routerLink')"
                            [ngClass]="mergeClasses(cx('action', {processedItem}), getItemProp(processedItem, 'styleClass'))"
                            [pBind]="getPTOptions(processedItem, index, 'action')"
                            [routerLink]="getItemProp(processedItem, 'routerLink')"
                            [attr.data-automationid]="getItemProp(processedItem, 'automationId')"
                            [attr.tabindex]="-1"
                            [attr.aria-hidden]="true"
                            [queryParams]="getItemProp(processedItem, 'queryParams')"
                            [routerLinkActive]="'p-menuitem-link-active'"
                            [routerLinkActiveOptions]="getItemProp(processedItem, 'routerLinkActiveOptions') || { exact: false }"
                            [target]="getItemProp(processedItem, 'target')"
                            [fragment]="getItemProp(processedItem, 'fragment')"
                            [queryParamsHandling]="getItemProp(processedItem, 'queryParamsHandling')"
                            [preserveFragment]="getItemProp(processedItem, 'preserveFragment')"
                            [skipLocationChange]="getItemProp(processedItem, 'skipLocationChange')"
                            [replaceUrl]="getItemProp(processedItem, 'replaceUrl')"
                            [state]="getItemProp(processedItem, 'state')"
                            pRipple
                        >
                            <span
                                *ngIf="getItemProp(processedItem, 'icon')"
                                [pBind]="getPTOptions(processedItem, index, 'icon')"
                                [ngClass]="mergeClasses(cx('icon'), getItemProp(processedItem, 'icon'))"
                                [class]="getItemProp(processedItem, 'iconClass')"
                                [ngStyle]="getItemProp(processedItem, 'iconStyle')"
                                [attr.aria-hidden]="true"
                                [attr.tabindex]="-1"
                            >
                            </span>
                            <span *ngIf="getItemProp(processedItem, 'escape'); else htmlLabel" [ngClass]="cx('text')" [pBind]="getPTOptions(processedItem, index, 'label')">
                                {{ getItemLabel(processedItem) }}
                            </span>
                            <ng-template #htmlLabel>
                                <span [innerHTML]="getItemLabel(processedItem)" [ngClass]="cx('text')" [pBind]="getPTOptions(processedItem, index, 'label')"></span>
                            </ng-template>
                            <span [ngClass]="mergeClasses(cx('badge'), getItemProp(processedItem, 'badgeStyleClass'))" [pBind]="getPTOptions(processedItem, index, 'badge')" *ngIf="getItemProp(processedItem, 'badge')">{{
                                getItemProp(processedItem, 'badge')
                            }}</span>
                            <ng-container *ngIf="isItemGroup(processedItem)">
                                <AngleRightIcon
                                    *ngIf="!parentInstance.submenuIconTemplate"
                                    [styleClass]="mergeClasses(cx('submenuIcon'), getItemProp(processedItem, 'iconClass'))"
                                    [pBind]="getPTOptions(processedItem, index, 'submenuIcon')"
                                    [attr.aria-hidden]="true"
                                />
                                <ng-template *ngTemplateOutlet="parentInstance.submenuIconTemplate" [pBind]="getPTOptions(processedItem, index, 'submenuIcon')" [attr.aria-hidden]="true"></ng-template>
                            </ng-container>
                        </a>
                    </ng-container>
                    <ng-container *ngIf="itemTemplate">
                        <ng-template *ngTemplateOutlet="itemTemplate; context: { $implicit: processedItem.item, hasSubmenu: getItemProp(processedItem, 'items') }"></ng-template>
                    </ng-container>
                </div>

                <p-tieredMenuSub
                    *ngIf="isItemVisible(processedItem) && isItemGroup(processedItem)"
                    [items]="processedItem.items"
                    [itemTemplate]="itemTemplate"
                    [autoDisplay]="autoDisplay"
                    [menuId]="menuId"
                    [activeItemPath]="activeItemPath"
                    [focusedItemId]="focusedItemId"
                    [ariaLabelledBy]="getItemId(processedItem)"
                    [level]="level + 1"
                    (itemClick)="itemClick.emit($event)"
                    (itemMouseEnter)="onItemMouseEnter($event)"
                ></p-tieredMenuSub>
            </li>
        </ng-template>
    </ul>`,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'p-element'
    }
})
export class TieredMenuSub extends BaseComponent {
    @Input() items: any[];

    @Input() itemTemplate: HTMLElement | undefined;

    @Input() root: boolean | undefined = false;

    @Input() autoDisplay: boolean | undefined;

    @Input() autoZIndex: boolean = true;

    @Input() baseZIndex: number = 0;

    @Input() popup: boolean | undefined;

    @Input() menuId: string | undefined;

    @Input() ariaLabel: string | undefined;

    @Input() ariaLabelledBy: string | undefined;

    @Input() level: number = 0;

    @Input() focusedItemId: string | undefined;

    @Input() activeItemPath: any[];

    @Input() tabindex: number = 0;

    @Output() itemClick: EventEmitter<any> = new EventEmitter();

    @Output() itemMouseEnter: EventEmitter<any> = new EventEmitter();

    @Output() menuFocus: EventEmitter<any> = new EventEmitter();

    @Output() menuBlur: EventEmitter<any> = new EventEmitter();

    @Output() menuKeydown: EventEmitter<any> = new EventEmitter();

    @ViewChild('sublist', { static: true }) sublistViewChild: ElementRef;

    public parentInstance = inject(forwardRef(() => TieredMenu));

    hostName = 'TieredMenu';

    initParams() {
        return {
            props: {
                items: this.items,
                itemTemplate: this.itemTemplate,
                root: this.root,
                autoDisplay: this.autoDisplay,
                autoZIndex: this.autoZIndex,
                baseZIndex: this.baseZIndex,
                popup: this.popup,
                menuId: this.menuId,
                ariaLabel: this.ariaLabel,
                ariaLabelledBy: this.ariaLabelledBy,
                level: this.level,
                focusedItemId: this.focusedItemId,
                activeItemPath: this.activeItemPath,
                tabindex: this.tabindex,
                itemClick: this.itemClick,
                itemMouseEnter: this.itemMouseEnter,
                menuFocus: this.menuFocus,
                menuBlur: this.menuBlur,
                menuKeydown: this.menuKeydown
            },
            state: {}
        };
    }

    positionSubmenu() {
        let sublist = this.sublistViewChild && this.sublistViewChild.nativeElement;

        if (sublist) {
            const parentItem = sublist.parentElement.parentElement;
            const containerOffset = DomHandler.getOffset(parentItem);
            const viewport = DomHandler.getViewport();
            const sublistWidth = sublist.offsetParent ? sublist.offsetWidth : DomHandler.getHiddenElementOuterWidth(sublist);
            const itemOuterWidth = DomHandler.getOuterWidth(parentItem.children[0]);

            if (parseInt(containerOffset.left, 10) + itemOuterWidth + sublistWidth > viewport.width - DomHandler.calculateScrollbarWidth()) {
                DomHandler.addClass(sublist, 'p-submenu-list-flipped');
            }
        }
    }

    getPTOptions(processedItem, index, key) {
        return this.ptm(key, {
            context: {
                item: processedItem,
                index,
                active: this.isItemActive(processedItem),
                focused: this.isItemFocused(processedItem),
                disabled: this.isItemDisabled(processedItem)
            }
        });
    }

    getItemProp(processedItem: any, name: string, params: any | null = null) {
        return processedItem && processedItem.item ? ObjectUtils.getItemValue(processedItem.item[name], params) : undefined;
    }

    getItemId(processedItem: any): string {
        return processedItem.item?.id ?? `${this.menuId}_${processedItem.key}`;
    }

    getItemKey(processedItem: any): string {
        return this.getItemId(processedItem);
    }

    getItemClass(processedItem: any) {
        return {
            ...this.getItemProp(processedItem, 'class'),
            'p-menuitem': true,
            'p-highlight': this.isItemActive(processedItem),
            'p-menuitem-active': this.isItemActive(processedItem),
            'p-focus': this.isItemFocused(processedItem),
            'p-disabled': this.isItemDisabled(processedItem)
        };
    }

    getItemLabel(processedItem: any): string {
        return this.getItemProp(processedItem, 'label');
    }

    getSeparatorItemClass(processedItem: any) {
        return {
            ...this.getItemProp(processedItem, 'class'),
            'p-menuitem-separator': true
        };
    }

    getAriaSetSize() {
        return this.items.filter((processedItem) => this.isItemVisible(processedItem) && !this.getItemProp(processedItem, 'separator')).length;
    }

    getAriaPosInset(index: number) {
        return index - this.items.slice(0, index).filter((processedItem) => this.isItemVisible(processedItem) && this.getItemProp(processedItem, 'separator')).length + 1;
    }

    isItemVisible(processedItem: any): boolean {
        return this.getItemProp(processedItem, 'visible') !== false;
    }

    isItemActive(processedItem: any): boolean {
        if (this.activeItemPath) {
            return this.activeItemPath.some((path) => path.key === processedItem.key);
        }
    }

    public isItemDisabled(processedItem: any): boolean {
        return this.getItemProp(processedItem, 'disabled');
    }

    isItemFocused(processedItem: any): boolean {
        return this.focusedItemId === this.getItemId(processedItem);
    }

    isItemGroup(processedItem: any): boolean {
        return ObjectUtils.isNotEmpty(processedItem.items);
    }

    onItemMouseEnter(param: any) {
        if (this.autoDisplay) {
            const { event, processedItem } = param;
            this.itemMouseEnter.emit({ originalEvent: event, processedItem });
        }
    }

    onItemClick(event: any, processedItem: any) {
        this.getItemProp(processedItem, 'command', { originalEvent: event, item: processedItem.item });
        this.itemClick.emit({ originalEvent: event, processedItem, isFocus: true });
    }
}
/**
 * TieredMenu displays submenus in nested overlays.
 * @group Components
 */
@Component({
    selector: 'p-tieredMenu',
    template: `
        <div
            #container
            [pBind]="ptm('root')"
            [id]="id"
            [ngClass]="cx('root')"
            [class]="styleClass"
            [ngStyle]="style"
            (click)="onOverlayClick($event)"
            [@overlayAnimation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions } }"
            [@.disabled]="popup !== true"
            (@overlayAnimation.start)="onOverlayAnimationStart($event)"
            (@overlayAnimation.done)="onOverlayAnimationEnd($event)"
            *ngIf="!popup || visible()"
        >
            <p-tieredMenuSub
                #rootmenu
                [root]="true"
                [items]="processedItems"
                [itemTemplate]="itemTemplate"
                [menuId]="id"
                [tabindex]="!disabled ? tabindex : -1"
                [ariaLabel]="ariaLabel"
                [ariaLabelledBy]="ariaLabelledBy"
                [baseZIndex]="baseZIndex"
                [autoZIndex]="autoZIndex"
                [autoDisplay]="autoDisplay"
                [popup]="popup"
                [focusedItemId]="focused ? focusedItemId : undefined"
                [activeItemPath]="activeItemPath()"
                (itemClick)="onItemClick($event)"
                (menuFocus)="onMenuFocus($event)"
                (menuBlur)="onMenuBlur($event)"
                (menuKeydown)="onKeyDown($event)"
                (itemMouseEnter)="onItemMouseEnter($event)"
            ></p-tieredMenuSub>
        </div>
    `,
    animations: [trigger('overlayAnimation', [transition(':enter', [style({ opacity: 0, transform: 'scaleY(0.8)' }), animate('{{showTransitionParams}}')]), transition(':leave', [animate('{{hideTransitionParams}}', style({ opacity: 0 }))])])],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./tieredmenu.css'],
    host: {
        class: 'p-element'
    }
})
export class TieredMenu extends BaseTieredMenu implements OnInit, AfterContentInit, OnDestroy {
    @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate> | undefined;

    @ViewChild('rootmenu') rootmenu: TieredMenuSub | undefined;

    @ViewChild('container') containerViewChild: ElementRef<any> | undefined;

    submenuIconTemplate: Nullable<TemplateRef<any>>;

    itemTemplate: Nullable<TemplateRef<any>>;

    container: HTMLDivElement | undefined;

    outsideClickListener: VoidListener;

    resizeListener: VoidListener;

    scrollHandler: Nullable<ConnectedOverlayScrollHandler>;

    target: any;

    relatedTarget: any;

    relativeAlign: boolean | undefined;

    dirty: boolean = false;

    focused: boolean = false;

    activeItemPath = signal<any>([]);

    activeItemPathEffect = effect(() => {
        const path = this.activeItemPath();

        if (ObjectUtils.isNotEmpty(path)) {
            this.bindOutsideClickListener();
            this.bindResizeListener();
        } else {
            this.unbindOutsideClickListener();
            this.unbindResizeListener();
        }
    });

    number = signal<number>(0);

    focusedItemInfo = signal<any>({ index: -1, level: 0, parentKey: '', item: null });

    searchValue: string = '';

    searchTimeout: any;

    get visibleItems() {
        const processedItem = this.activeItemPath().find((p) => p.key === this.focusedItemInfo().parentKey);
        return processedItem ? processedItem.items : this.processedItems;
    }

    get processedItems() {
        if (!this._processedItems || !this._processedItems.length) {
            this._processedItems = this.createProcessedItems(this.model || []);
        }
        return this._processedItems;
    }

    get focusedItemId() {
        const focusedItemInfo = this.focusedItemInfo();
        return focusedItemInfo.item?.id ? focusedItemInfo.item.id : focusedItemInfo.index !== -1 ? `${this.id}${ObjectUtils.isNotEmpty(focusedItemInfo.parentKey) ? '_' + focusedItemInfo.parentKey : ''}_${focusedItemInfo.index}` : null;
    }

    overlayService = inject(OverlayService);

    ngOnInit() {
        this.id = this.id || UniqueComponentId();
    }

    ngAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'submenuicon':
                    this.submenuIconTemplate = item.template;
                    break;
                case 'item':
                    this.itemTemplate = item.template;
                    break;
                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }

    getItemProp(item: any, name: string) {
        return item ? ObjectUtils.getItemValue(item[name]) : undefined;
    }

    getProccessedItemLabel(processedItem: any) {
        return processedItem ? this.getItemLabel(processedItem.item) : undefined;
    }

    getItemLabel(item: any) {
        return this.getItemProp(item, 'label');
    }

    isProcessedItemGroup(processedItem: any): boolean {
        return processedItem && ObjectUtils.isNotEmpty(processedItem.items);
    }

    isSelected(processedItem: any): boolean {
        return this.activeItemPath().some((p) => p.key === processedItem.key);
    }

    isValidSelectedItem(processedItem: any): boolean {
        return this.isValidItem(processedItem) && this.isSelected(processedItem);
    }

    isValidItem(processedItem: any): boolean {
        return !!processedItem && !this.isItemDisabled(processedItem.item) && !this.isItemSeparator(processedItem.item);
    }

    isItemDisabled(item: any): boolean {
        return this.getItemProp(item, 'disabled');
    }

    isItemSeparator(item: any): boolean {
        return this.getItemProp(item, 'separator');
    }

    isItemMatched(processedItem: any): boolean {
        return this.isValidItem(processedItem) && this.getProccessedItemLabel(processedItem).toLocaleLowerCase().startsWith(this.searchValue.toLocaleLowerCase());
    }

    isProccessedItemGroup(processedItem: any): boolean {
        return processedItem && ObjectUtils.isNotEmpty(processedItem.items);
    }

    onOverlayClick(event: MouseEvent) {
        if (this.popup) {
            this.overlayService.add({
                originalEvent: event,
                target: this.el.nativeElement
            });
        }
    }

    onItemClick(event: any) {
        const { originalEvent, processedItem } = event;
        const grouped = this.isProcessedItemGroup(processedItem);
        const root = ObjectUtils.isEmpty(processedItem.parent);
        const selected = this.isSelected(processedItem);

        if (selected) {
            const { index, key, level, parentKey, item } = processedItem;

            this.activeItemPath.set(this.activeItemPath().filter((p) => key !== p.key && key.startsWith(p.key)));
            this.focusedItemInfo.set({ index, level, parentKey, item });

            this.dirty = true;
            DomHandler.focus(this.rootmenu.sublistViewChild.nativeElement);
        } else {
            if (grouped) {
                this.onItemChange(event);
            } else {
                const rootProcessedItem = root ? processedItem : this.activeItemPath().find((p) => p.parentKey === '');
                this.hide(originalEvent);
                this.changeFocusedItemIndex(originalEvent, rootProcessedItem ? rootProcessedItem.index : -1);

                DomHandler.focus(this.rootmenu.sublistViewChild.nativeElement);
            }
        }
    }

    onItemMouseEnter(event: any) {
        if (!DomHandler.isTouchDevice()) {
            if (this.dirty) {
                this.onItemChange(event);
            }
        } else {
            this.onItemChange({ event, processedItem: event.processedItem, focus: this.autoDisplay });
        }
    }

    onKeyDown(event: KeyboardEvent) {
        const metaKey = event.metaKey || event.ctrlKey;

        switch (event.code) {
            case 'ArrowDown':
                this.onArrowDownKey(event);
                break;

            case 'ArrowUp':
                this.onArrowUpKey(event);
                break;

            case 'ArrowLeft':
                this.onArrowLeftKey(event);
                break;

            case 'ArrowRight':
                this.onArrowRightKey(event);
                break;

            case 'Home':
                this.onHomeKey(event);
                break;

            case 'End':
                this.onEndKey(event);
                break;

            case 'Space':
                this.onSpaceKey(event);
                break;

            case 'Enter':
                this.onEnterKey(event);
                break;

            case 'Escape':
                this.onEscapeKey(event);
                break;

            case 'Tab':
                this.onTabKey(event);
                break;

            case 'PageDown':
            case 'PageUp':
            case 'Backspace':
            case 'ShiftLeft':
            case 'ShiftRight':
                //NOOP
                break;

            default:
                if (!metaKey && ObjectUtils.isPrintableCharacter(event.key)) {
                    this.searchItems(event, event.key);
                }

                break;
        }
    }

    onArrowDownKey(event: KeyboardEvent) {
        const itemIndex = this.focusedItemInfo().index !== -1 ? this.findNextItemIndex(this.focusedItemInfo().index) : this.findFirstFocusedItemIndex();

        this.changeFocusedItemIndex(event, itemIndex);
        event.preventDefault();
    }

    onArrowRightKey(event: KeyboardEvent) {
        const processedItem = this.visibleItems[this.focusedItemInfo().index];
        const grouped = this.isProccessedItemGroup(processedItem);
        const item = processedItem.item;

        if (grouped) {
            this.onItemChange({ originalEvent: event, processedItem });
            this.focusedItemInfo.set({ index: -1, parentKey: processedItem.key, item });
            this.searchValue = '';
            this.onArrowDownKey(event);
        }

        event.preventDefault();
    }

    onArrowUpKey(event: KeyboardEvent) {
        if (event.altKey) {
            if (this.focusedItemInfo().index !== -1) {
                const processedItem = this.visibleItems[this.focusedItemInfo().index];
                const grouped = this.isProccessedItemGroup(processedItem);

                !grouped && this.onItemChange({ originalEvent: event, processedItem });
            }

            this.popup && this.hide(event, true);
            event.preventDefault();
        } else {
            const itemIndex = this.focusedItemInfo().index !== -1 ? this.findPrevItemIndex(this.focusedItemInfo().index) : this.findLastFocusedItemIndex();

            this.changeFocusedItemIndex(event, itemIndex);
            event.preventDefault();
        }
    }

    onArrowLeftKey(event: KeyboardEvent) {
        const processedItem = this.visibleItems[this.focusedItemInfo().index];
        const parentItem = this.activeItemPath().find((p) => p.key === processedItem.parentKey);
        const root = ObjectUtils.isEmpty(processedItem.parent);

        if (!root) {
            this.focusedItemInfo.set({ index: -1, parentKey: parentItem ? parentItem.parentKey : '', item: processedItem.item });
            this.searchValue = '';
            this.onArrowDownKey(event);
        }

        const activeItemPath = this.activeItemPath().filter((p) => p.parentKey !== this.focusedItemInfo().parentKey);
        this.activeItemPath.set(activeItemPath);

        event.preventDefault();
    }

    onHomeKey(event: KeyboardEvent) {
        this.changeFocusedItemIndex(event, this.findFirstItemIndex());
        event.preventDefault();
    }

    onEndKey(event: KeyboardEvent) {
        this.changeFocusedItemIndex(event, this.findLastItemIndex());
        event.preventDefault();
    }

    onSpaceKey(event: KeyboardEvent) {
        this.onEnterKey(event);
    }

    onEscapeKey(event: KeyboardEvent) {
        this.hide(event, true);
        this.focusedItemInfo().index = this.findFirstFocusedItemIndex();

        event.preventDefault();
    }

    onTabKey(event: KeyboardEvent) {
        if (this.focusedItemInfo().index !== -1) {
            const processedItem = this.visibleItems[this.focusedItemInfo().index];
            const grouped = this.isProccessedItemGroup(processedItem);

            !grouped && this.onItemChange({ originalEvent: event, processedItem });
        }

        this.hide();
    }

    onEnterKey(event: KeyboardEvent) {
        if (this.focusedItemInfo().index !== -1) {
            const element = DomHandler.findSingle(this.rootmenu.el.nativeElement, `li[id="${`${this.focusedItemId}`}"]`);
            const anchorElement = element && DomHandler.findSingle(element, 'a[data-pc-section="action"]');

            anchorElement ? anchorElement.click() : element && element.click();

            const processedItem = this.visibleItems[this.focusedItemInfo().index];
            if (!this.popup) {
                const processedItem = this.visibleItems[this.focusedItemInfo().index];
                const grouped = this.isProccessedItemGroup(processedItem);

                !grouped && (this.focusedItemInfo().index = this.findFirstFocusedItemIndex());
            }
        }

        event.preventDefault();
    }

    onItemChange(event: any) {
        const { processedItem, isFocus } = event;

        if (ObjectUtils.isEmpty(processedItem)) return;

        const { index, key, level, parentKey, items, item } = processedItem;
        const grouped = ObjectUtils.isNotEmpty(items);
        const activeItemPath = this.activeItemPath().filter((p) => p.parentKey !== parentKey && p.parentKey !== key);

        grouped && activeItemPath.push(processedItem);
        this.focusedItemInfo.set({ index, level, parentKey, item });
        this.activeItemPath.set(activeItemPath);

        grouped && (this.dirty = true);
        isFocus && DomHandler.focus(this.rootmenu.sublistViewChild.nativeElement);
    }

    onMenuFocus(event: any) {
        this.focused = true;
        const focusedItemInfo = this.focusedItemInfo().index !== -1 ? this.focusedItemInfo() : { index: this.findFirstFocusedItemIndex(), level: 0, parentKey: '', item: this.visibleItems[this.findFirstFocusedItemIndex()]?.item };
        this.focusedItemInfo.set(focusedItemInfo);
    }

    onMenuBlur(event: any) {
        this.focused = false;
        this.focusedItemInfo.set({ index: -1, level: 0, parentKey: '', item: null });
        this.searchValue = '';
        this.dirty = false;
    }

    onOverlayAnimationStart(event: AnimationEvent) {
        switch (event.toState) {
            case 'visible':
                if (this.popup) {
                    this.container = event.element;
                    this.moveOnTop();
                    this.onShow.emit({});
                    this.appendOverlay();
                    this.alignOverlay();
                    this.bindOutsideClickListener();
                    this.bindResizeListener();
                    this.bindScrollListener();
                    DomHandler.focus(this.rootmenu.sublistViewChild.nativeElement);
                    this.scrollInView();
                }
                break;

            case 'void':
                this.onOverlayHide();
                this.onHide.emit({});
                break;
        }
    }

    alignOverlay() {
        if (this.relativeAlign) DomHandler.relativePosition(this.container, this.target);
        else DomHandler.absolutePosition(this.container, this.target);
    }

    onOverlayAnimationEnd(event: AnimationEvent) {
        switch (event.toState) {
            case 'void':
                ZIndexUtils.clear(event.element);
                break;
        }
    }

    appendOverlay() {
        if (this.appendTo) {
            if (this.appendTo === 'body') this.renderer.appendChild(this.document.body, this.container);
            else DomHandler.appendChild(this.container, this.appendTo);
        }
    }

    restoreOverlayAppend() {
        if (this.container && this.appendTo) {
            this.renderer.appendChild(this.el.nativeElement, this.container);
        }
    }

    moveOnTop() {
        if (this.autoZIndex) {
            ZIndexUtils.set('menu', this.container, this.baseZIndex + this.config.zIndex.menu);
        }
    }

    /**
     * Hides the popup menu.
     * @group Method
     */
    hide(event?, isFocus?: boolean) {
        if (this.popup) {
            this.onHide.emit({});
            this.visible.set(false);
        }
        this.activeItemPath.set([]);
        this.focusedItemInfo.set({ index: -1, level: 0, parentKey: '' });

        isFocus && DomHandler.focus(this.relatedTarget || this.target || this.rootmenu.sublistViewChild.nativeElement);
        this.dirty = false;
    }

    /**
     * Toggles the visibility of the popup menu.
     * @param {Event} event - Browser event.
     * @group Method
     */
    toggle(event: any) {
        this.visible() ? this.hide(event, true) : this.show(event);
    }

    /**
     * Displays the popup menu.
     * @param {Event} even - Browser event.
     * @group Method
     */
    show(event: any, isFocus?) {
        if (this.popup) {
            this.visible.set(true);
            this.target = this.target || event.currentTarget;
            this.relatedTarget = event.relatedTarget || null;
            this.relativeAlign = event?.relativeAlign || null;
        }

        this.focusedItemInfo.set({ index: this.findFirstFocusedItemIndex(), level: 0, parentKey: '' });

        isFocus && DomHandler.focus(this.rootmenu.sublistViewChild.nativeElement);

        this.cd.markForCheck();
    }

    searchItems(event: any, char: string) {
        this.searchValue = (this.searchValue || '') + char;

        let itemIndex = -1;
        let matched = false;

        if (this.focusedItemInfo().index !== -1) {
            itemIndex = this.visibleItems.slice(this.focusedItemInfo().index).findIndex((processedItem) => this.isItemMatched(processedItem));
            itemIndex = itemIndex === -1 ? this.visibleItems.slice(0, this.focusedItemInfo().index).findIndex((processedItem) => this.isItemMatched(processedItem)) : itemIndex + this.focusedItemInfo().index;
        } else {
            itemIndex = this.visibleItems.findIndex((processedItem) => this.isItemMatched(processedItem));
        }

        if (itemIndex !== -1) {
            matched = true;
        }

        if (itemIndex === -1 && this.focusedItemInfo().index === -1) {
            itemIndex = this.findFirstFocusedItemIndex();
        }

        if (itemIndex !== -1) {
            this.changeFocusedItemIndex(event, itemIndex);
        }

        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        this.searchTimeout = setTimeout(() => {
            this.searchValue = '';
            this.searchTimeout = null;
        }, 500);

        return matched;
    }

    findLastFocusedItemIndex() {
        const selectedIndex = this.findSelectedItemIndex();
        return selectedIndex < 0 ? this.findLastItemIndex() : selectedIndex;
    }

    findLastItemIndex() {
        return ObjectUtils.findLastIndex(this.visibleItems, (processedItem) => this.isValidItem(processedItem));
    }

    findPrevItemIndex(index: number) {
        const matchedItemIndex = index > 0 ? ObjectUtils.findLastIndex(this.visibleItems.slice(0, index), (processedItem) => this.isValidItem(processedItem)) : -1;

        return matchedItemIndex > -1 ? matchedItemIndex : index;
    }

    findNextItemIndex(index: number) {
        const matchedItemIndex = index < this.visibleItems.length - 1 ? this.visibleItems.slice(index + 1).findIndex((processedItem) => this.isValidItem(processedItem)) : -1;

        return matchedItemIndex > -1 ? matchedItemIndex + index + 1 : index;
    }

    findFirstFocusedItemIndex() {
        const selectedIndex = this.findSelectedItemIndex();

        return selectedIndex < 0 ? this.findFirstItemIndex() : selectedIndex;
    }

    findFirstItemIndex() {
        return this.visibleItems.findIndex((processedItem) => this.isValidItem(processedItem));
    }

    findSelectedItemIndex() {
        return this.visibleItems.findIndex((processedItem) => this.isValidSelectedItem(processedItem));
    }

    changeFocusedItemIndex(event: any, index: number) {
        if (this.focusedItemInfo().index !== index) {
            const focusedItemInfo = this.focusedItemInfo();
            this.focusedItemInfo.set({ ...focusedItemInfo, item: this.visibleItems[index].item, index });
            this.scrollInView();
        }
    }

    scrollInView(index: number = -1) {
        const id = index !== -1 ? `${this.id}_${index}` : this.focusedItemId;
        const element = DomHandler.findSingle(this.rootmenu.el.nativeElement, `li[id="${id}"]`);

        if (element) {
            element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
    }

    bindScrollListener() {
        if (!this.scrollHandler) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.target, (event) => {
                if (this.visible()) {
                    this.hide(event, true);
                }
            });
        }

        this.scrollHandler.bindScrollListener();
    }

    unbindScrollListener() {
        if (this.scrollHandler) {
            this.scrollHandler.unbindScrollListener();
            this.scrollHandler = null;
        }
    }

    bindResizeListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.resizeListener) {
                this.resizeListener = this.renderer.listen(this.document.defaultView, 'resize', (event) => {
                    if (!DomHandler.isTouchDevice()) {
                        this.hide(event, true);
                    }
                });
            }
        }
    }

    bindOutsideClickListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.outsideClickListener) {
                this.outsideClickListener = this.renderer.listen(this.document, 'click', (event) => {
                    const isOutsideContainer = this.containerViewChild && !this.containerViewChild.nativeElement.contains(event.target);
                    const isOutsideTarget = this.popup ? !(this.target && (this.target === event.target || this.target.contains(event.target))) : true;
                    if (isOutsideContainer && isOutsideTarget) {
                        this.hide();
                    }
                });
            }
        }
    }

    unbindOutsideClickListener() {
        if (this.outsideClickListener) {
            document.removeEventListener('click', this.outsideClickListener);
            this.outsideClickListener = null;
        }
    }

    unbindResizeListener() {
        if (this.resizeListener) {
            this.resizeListener();
            this.resizeListener = null;
        }
    }

    onOverlayHide() {
        this.unbindOutsideClickListener();
        this.unbindResizeListener();
        this.unbindScrollListener();

        if (!(this.cd as ViewRef).destroyed) {
            this.target = null;
        }
    }

    ngOnDestroy() {
        if (this.popup) {
            if (this.scrollHandler) {
                this.scrollHandler.destroy();
                this.scrollHandler = null;
            }

            if (this.container && this.autoZIndex) {
                ZIndexUtils.clear(this.container);
            }

            this.restoreOverlayAppend();
            this.onOverlayHide();
        }
    }
}

@NgModule({
    imports: [CommonModule, Bind, BaseComponent, BaseTieredMenu, RouterModule, RippleModule, TooltipModule, AngleRightIcon, SharedModule],
    exports: [TieredMenu, RouterModule, TooltipModule, SharedModule],
    declarations: [TieredMenu, TieredMenuSub]
})
export class TieredMenuModule {}
