import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChildren, HostListener, NgModule, OnDestroy, QueryList, TemplateRef, ViewEncapsulation } from '@angular/core';
import { BlockableUI, Header, PrimeTemplate, SharedModule } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { ChevronDownIcon } from 'primeng/icons/chevrondown';
import { ChevronRightIcon } from 'primeng/icons/chevronright';

import { Bind } from 'primeng/bind';
import { BaseAccordionTab } from './baseaccordiontab';
import { BaseAccordion } from './baseaccordion';

/**
 * AccordionTab is a helper component for Accordion.
 * @group Components
 */
@Component({
    selector: 'p-accordionTab',
    template: `
        <div [pBind]="ptm('root')" [ngClass]="cx('root')" [class]="tabStyleClass" [ngStyle]="tabStyle">
            <div [ngClass]="cx('header')" role="heading" [attr.aria-level]="headerAriaLevel" [attr.data-p-disabled]="disabled">
                <a
                    [pBind]="ptm('headerAction')"
                    [ngClass]="cx('headerAction')"
                    [class]="headerStyleClass"
                    [style]="headerStyle"
                    role="button"
                    (click)="toggle($event)"
                    (keydown)="onKeydown($event)"
                    [attr.tabindex]="disabled ? null : 0"
                    [attr.id]="getTabHeaderActionId(id)"
                    [attr.aria-controls]="getTabContentId(id)"
                    [attr.aria-expanded]="selected"
                    [attr.aria-disabled]="disabled"
                >
                    <ng-container *ngIf="!iconTemplate">
                        <ng-container *ngIf="selected">
                            <span *ngIf="accordion.collapseIcon" [pBind]="ptm('headerIcon')" [class]="accordion.collapseIcon" [ngClass]="cx('headerIcon')" [attr.aria-hidden]="true"></span>
                            <ChevronDownIcon *ngIf="!accordion.collapseIcon" [pBind]="ptm('headerIcon')" [ngClass]="cx('headerIcon')" [attr.aria-hidden]="true" />
                        </ng-container>
                        <ng-container *ngIf="!selected">
                            <span *ngIf="accordion.expandIcon" [pBind]="ptm('headerIcon')" [class]="accordion.expandIcon" [ngClass]="cx('headerIcon')" [attr.aria-hidden]="true"></span>
                            <ChevronRightIcon *ngIf="!accordion.expandIcon" [pBind]="ptm('headerIcon')" [ngClass]="cx('headerIcon')" [attr.aria-hidden]="true" />
                        </ng-container>
                    </ng-container>
                    <ng-template *ngTemplateOutlet="iconTemplate; context: { $implicit: selected }"></ng-template>
                    <span [pBind]="ptm('headerTitle')" [ngClass]="'headerTitle'" *ngIf="!hasHeaderFacet">
                        {{ header }}
                    </span>
                    <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
                    <ng-content select="p-header" *ngIf="hasHeaderFacet"></ng-content>
                </a>
            </div>
            <div
                [attr.id]="getTabContentId(id)"
                [pBind]="ptm('toggleableContent')"
                [ngClass]="cx('toggleableContent')"
                [@tabContent]="selected ? { value: 'visible', params: { transitionParams: transitionOptions } } : { value: 'hidden', params: { transitionParams: transitionOptions } }"
                role="region"
                [attr.aria-hidden]="!selected"
                [attr.aria-labelledby]="getTabHeaderActionId(id)"
            >
                <div [pBind]="ptm('content')" [ngClass]="cx('content')" [class]="contentStyleClass" [ngStyle]="contentStyle">
                    <ng-content></ng-content>
                    <ng-container *ngIf="contentTemplate && (cache ? loaded() : selected)">
                        <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
                    </ng-container>
                </div>
            </div>
        </div>
    `,
    animations: [
        trigger('tabContent', [
            state(
                'hidden',
                style({
                    height: '0',
                    visibility: 'hidden'
                })
            ),
            state(
                'visible',
                style({
                    height: '*',
                    visibility: 'visible'
                })
            ),
            transition('visible <=> hidden', [animate('{{transitionParams}}')]),
            transition('void => *', animate(0))
        ])
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./accordion.css'],
    host: {
        class: 'p-element'
    }
})
export class AccordionTab extends BaseAccordionTab implements AfterContentInit, OnDestroy {
    @ContentChildren(Header) headerFacet!: QueryList<Header>;

    @ContentChildren(PrimeTemplate) templates!: QueryList<PrimeTemplate>;

    get iconClass() {
        if (this.iconPos === 'end') {
            return 'p-accordion-toggle-icon-end';
        } else {
            return 'p-accordion-toggle-icon';
        }
    }

    contentTemplate: TemplateRef<any> | undefined;

    headerTemplate: TemplateRef<any> | undefined;

    iconTemplate: TemplateRef<any> | undefined;

    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this.contentTemplate = item.template;
                    break;

                case 'header':
                    this.headerTemplate = item.template;
                    break;

                case 'icon':
                    this.iconTemplate = item.template;
                    break;

                default:
                    this.contentTemplate = item.template;
                    break;
            }
        });
    }

    toggle(event?: MouseEvent | KeyboardEvent) {
        if (this.disabled) {
            return false;
        }

        let index = this.findTabIndex();

        if (this.selected) {
            this.selected = false;
            this.accordion.onClose.emit({ originalEvent: event, index: index });
        } else {
            if (!this.accordion.multiple) {
                for (var i = 0; i < this.accordion.tabs.length; i++) {
                    if (this.accordion.tabs[i].selected) {
                        this.accordion.tabs[i].selected = false;
                    }
                }
            }

            this.selected = true;
            this.loaded.set(true);
            this.accordion.onOpen.emit({ originalEvent: event, index: index });
        }

        this.accordion.updateActiveIndex();
        event?.preventDefault();
    }

    findTabIndex() {
        let index = -1;
        for (var i = 0; i < this.accordion.tabs.length; i++) {
            if (this.accordion.tabs[i] == this) {
                index = i;
                break;
            }
        }
        return index;
    }

    get hasHeaderFacet(): boolean {
        return (this.headerFacet as QueryList<Header>) && (this.headerFacet as QueryList<Header>).length > 0;
    }

    onKeydown(event: KeyboardEvent) {
        switch (event.code) {
            case 'Enter':
            case 'Space':
                this.toggle(event);
                event.preventDefault(); // ???
                break;
            default:
                break;
        }
    }

    getTabHeaderActionId(tabId) {
        return `${tabId}_header_action`;
    }

    getTabContentId(tabId) {
        return `${tabId}_content`;
    }

    ngOnDestroy() {
        this.accordion.tabs.splice(this.findTabIndex(), 1);
    }
}

/**
 * Accordion groups a collection of contents in tabs.
 * @group Components
 */
@Component({
    selector: 'p-accordion',
    template: `
        <div [pBind]="ptm('root')" [ngClass]="cx('root')" [ngStyle]="style" [class]="styleClass">
            <ng-content></ng-content>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'p-element'
    }
})
export class Accordion extends BaseAccordion implements BlockableUI, AfterContentInit, OnDestroy {
    @HostListener('keydown', ['$event'])
    onKeydown(event) {
        switch (event.code) {
            case 'ArrowDown':
                this.onTabArrowDownKey(event);
                break;

            case 'ArrowUp':
                this.onTabArrowUpKey(event);
                break;

            case 'Home':
                if (!event.shiftKey) {
                    this.onTabHomeKey(event);
                }
                break;

            case 'End':
                if (!event.shiftKey) {
                    this.onTabEndKey(event);
                }
                break;
        }
    }

    isInput(event): boolean {
        const { tagName } = event.target;
        return tagName?.toLowerCase() === 'input';
    }

    isTextArea(event): boolean {
        const { tagName } = event.target;
        return tagName?.toLowerCase() === 'textarea';
    }

    onTabArrowDownKey(event) {
        if (!this.isInput(event) && !this.isTextArea(event)) {
            const nextHeaderAction = this.findNextHeaderAction(event.target.parentElement.parentElement.parentElement);
            nextHeaderAction ? this.changeFocusedTab(nextHeaderAction) : this.onTabHomeKey(event);

            event.preventDefault();
        }
    }

    onTabArrowUpKey(event) {
        if (!this.isInput(event) && !this.isTextArea(event)) {
            const prevHeaderAction = this.findPrevHeaderAction(event.target.parentElement.parentElement.parentElement);
            prevHeaderAction ? this.changeFocusedTab(prevHeaderAction) : this.onTabEndKey(event);

            event.preventDefault();
        }
    }

    onTabHomeKey(event) {
        const firstHeaderAction = this.findFirstHeaderAction();
        this.changeFocusedTab(firstHeaderAction);
        event.preventDefault();
    }

    changeFocusedTab(element) {
        if (element) {
            DomHandler.focus(element);
            let activeIndex = this.activeIndex;

            if (this.selectOnFocus) {
                this.tabs.forEach((tab, i) => {
                    let selected = this.multiple ? (<number[]>activeIndex).includes(i) : i === activeIndex;

                    if (this.multiple) {
                        if (!activeIndex) {
                            activeIndex = [];
                        }
                        if (tab.id == element.id) {
                            tab.selected = !tab.selected;
                            if (!(<number[]>activeIndex).includes(i)) {
                                (<number[]>activeIndex).push(i);
                            } else {
                                activeIndex = (<number[]>activeIndex).filter((ind) => ind !== i);
                            }
                        }
                    } else {
                        if (tab.id == element.id) {
                            tab.selected = !tab.selected;
                            activeIndex = i;
                        } else {
                            tab.selected = false;
                        }
                    }
                    this.activeIndex = this.activeIndex;
                });
            }
        }
    }

    findNextHeaderAction(tabElement, selfCheck = false) {
        const nextTabElement = selfCheck ? tabElement : tabElement.nextElementSibling;
        const headerElement = DomHandler.findSingle(nextTabElement, '[data-pc-section="header"]');

        return headerElement ? (DomHandler.getAttribute(headerElement, 'data-p-disabled') ? this.findNextHeaderAction(headerElement.parentElement.parentElement) : DomHandler.findSingle(headerElement, '[data-pc-section="headeraction"]')) : null;
    }

    findPrevHeaderAction(tabElement, selfCheck = false) {
        const prevTabElement = selfCheck ? tabElement : tabElement.previousElementSibling;
        const headerElement = DomHandler.findSingle(prevTabElement, '[data-pc-section="header"]');

        return headerElement ? (DomHandler.getAttribute(headerElement, 'data-p-disabled') ? this.findPrevHeaderAction(headerElement.parentElement.parentElement) : DomHandler.findSingle(headerElement, '[data-pc-section="headeraction"]')) : null;
    }

    findFirstHeaderAction() {
        const firstEl = this.el.nativeElement.firstElementChild.childNodes[0];
        return this.findNextHeaderAction(firstEl, true);
    }

    findLastHeaderAction() {
        const childNodes = this.el.nativeElement.firstElementChild.childNodes;
        const lastEl = childNodes[childNodes.length - 1];

        return this.findPrevHeaderAction(lastEl, true);
    }

    onTabEndKey(event) {
        const lastHeaderAction = this.findLastHeaderAction();
        this.changeFocusedTab(lastHeaderAction);
        event.preventDefault();
    }

    ngAfterContentInit() {
        this.initTabs();

        this.tabListSubscription = (this.tabList as QueryList<AccordionTab>).changes.subscribe((_) => {
            this.initTabs();
        });
    }

    initTabs() {
        this.tabs = (this.tabList as QueryList<AccordionTab>).toArray();

        this.tabs.forEach((tab) => {
            tab.headerAriaLevel = this._headerAriaLevel;
        });

        this.updateSelectionState();
        this.cd.markForCheck();
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }

    isTabActive(index) {
        return this.multiple ? this.activeIndex && (<number[]>this.activeIndex).includes(index) : this.activeIndex === index;
    }

    getTabProp(tab, name) {
        return tab.props ? tab.props[name] : undefined;
    }

    updateActiveIndex() {
        let index: number | number[] | null = this.multiple ? [] : null;
        this.tabs.forEach((tab, i) => {
            if (tab.selected) {
                if (this.multiple) {
                    (index as number[]).push(i);
                } else {
                    index = i;
                    return;
                }
            }
        });
        this.preventActiveIndexPropagation = true;
        this.activeIndex = index;
    }

    ngOnDestroy() {
        if (this.tabListSubscription) {
            this.tabListSubscription.unsubscribe();
        }
    }
}

@NgModule({
    imports: [BaseAccordion, BaseAccordionTab, SharedModule, CommonModule, ChevronRightIcon, ChevronDownIcon, Bind],
    exports: [Accordion, AccordionTab, SharedModule],
    declarations: [Accordion, AccordionTab]
})
export class AccordionModule {}
