import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, Component, NgModule, TemplateRef, ViewEncapsulation } from '@angular/core';
import { BlockableUI, SharedModule } from 'primeng/api';
import { MinusIcon } from 'primeng/icons/minus';
import { PlusIcon } from 'primeng/icons/plus';
import { RippleModule } from 'primeng/ripple';
import { Nullable } from 'primeng/ts-helpers';
import { UniqueComponentId } from 'primeng/utils';
import { BaseFieldset } from './basefieldset';
import { Bind } from 'primeng/bind';

/**
 * Fieldset is a grouping component with the optional content toggle feature.
 * @group Components
 */
@Component({
    selector: 'p-fieldset',
    template: `
        <fieldset [attr.id]="id" [pBind]="ptm('root')" [ngClass]="cx('root')" [class]="styleClass" [ngStyle]="style">
            <legend [pBind]="ptm('legend')" [ngClass]="cx('legend')">
                <ng-container *ngIf="toggleable; else legendContent">
                    <a
                        [pBind]="ptm('legendtitle')"
                        [ngClass]="cx('legendtitle')"
                        [attr.id]="id + '_header'"
                        pRipple
                        tabindex="0"
                        role="button"
                        [attr.aria-controls]="id + '_content'"
                        [attr.aria-expanded]="!collapsed"
                        [attr.aria-label]="buttonAriaLabel"
                        (click)="toggle($event)"
                        (keydown)="onKeyDown($event)"
                    >
                        <ng-container *ngIf="collapsed">
                            <PlusIcon [pBind]="ptm('togglericon')" [styleClass]="cx('togglericon')" *ngIf="!expandIconTemplate" [attr.aria-hidden]="true" />
                            <span *ngIf="expandIconTemplate" [pBind]="ptm('togglericon')" [ngClass]="cx('togglericon')" [attr.aria-hidden]="true">
                                <ng-container *ngTemplateOutlet="expandIconTemplate"></ng-container>
                            </span>
                        </ng-container>
                        <ng-container *ngIf="!collapsed">
                            <MinusIcon *ngIf="!collapseIconTemplate" [pBind]="ptm('togglericon')" [styleClass]="cx('togglericon')" [attr.aria-hidden]="true" />
                            <span *ngIf="collapseIconTemplate" [pBind]="ptm('togglericon')" [ngClass]="cx('togglericon')" [attr.aria-hidden]="true">
                                <ng-container *ngTemplateOutlet="collapseIconTemplate"></ng-container>
                            </span>
                        </ng-container>
                        <ng-container *ngTemplateOutlet="legendContent"></ng-container>
                    </a>
                </ng-container>
                <ng-template #legendContent>
                    <span [pBind]="ptm('legendtitle')" [ngClass]="cx('legendtitle')">{{ legend }}</span>
                    <ng-content select="p-header"></ng-content>
                    <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
                </ng-template>
            </legend>
            <div
                [attr.id]="id + '_content'"
                role="region"
                [pBind]="ptm('toggleablecontent')"
                [ngClass]="cx('toggleablecontent')"
                [@fieldsetContent]="collapsed ? { value: 'hidden', params: { transitionParams: transitionOptions, height: '0' } } : { value: 'visible', params: { transitionParams: animating() ? transitionOptions : '0ms', height: '*' } }"
                [attr.aria-labelledby]="id + '_header'"
                [attr.aria-hidden]="collapsed"
                (@fieldsetContent.done)="onToggleDone()"
            >
                <div [pBind]="ptm('content')" [ngClass]="cx('content')">
                    <ng-content></ng-content>
                    <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
                </div>
            </div>
        </fieldset>
    `,
    animations: [
        trigger('fieldsetContent', [
            state(
                'hidden',
                style({
                    height: '0'
                })
            ),
            state(
                'visible',
                style({
                    height: '*'
                })
            ),
            transition('visible <=> hidden', [animate('{{transitionParams}}')]),
            transition('void => *', animate(0))
        ])
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./fieldset.css'],
    host: {
        class: 'p-element'
    },
    inputs: ['legend', 'toggleable', 'collapsed', 'style', 'styleClass', 'transitionOptions'],
    outputs: ['collapsedChange', 'onBeforeToggle', 'onAfterToggle']
})
export class Fieldset extends BaseFieldset implements AfterContentInit, BlockableUI {
    id: string = UniqueComponentId();

    get buttonAriaLabel() {
        return this.legend;
    }

    headerTemplate: Nullable<TemplateRef<any>>;

    contentTemplate: Nullable<TemplateRef<any>>;

    collapseIconTemplate: Nullable<TemplateRef<any>>;

    expandIconTemplate: Nullable<TemplateRef<any>>;

    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'header':
                    this.headerTemplate = item.template;
                    break;

                case 'expandicon':
                    this.expandIconTemplate = item.template;
                    break;

                case 'collapseicon':
                    this.collapseIconTemplate = item.template;
                    break;

                case 'content':
                    this.contentTemplate = item.template;
                    break;
            }
        });
    }

    toggle(event: MouseEvent) {
        if (this.animating()) {
            return false;
        }

        this.animating.set(true);
        this.onBeforeToggle.emit({ originalEvent: event, collapsed: this.collapsed });

        if (this.collapsed) this.expand();
        else this.collapse();

        this.onAfterToggle.emit({ originalEvent: event, collapsed: this.collapsed });
        event.preventDefault();
    }

    onKeyDown(event) {
        if (event.code === 'Enter' || event.code === 'Space') {
            this.toggle(event);
            event.preventDefault();
        }
    }

    expand() {
        this.collapsed = false;
    }

    collapse() {
        this.collapsed = true;
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }

    onToggleDone() {
        this.animating.set(false);
    }
}

@NgModule({
    imports: [CommonModule, BaseFieldset, RippleModule, Bind, MinusIcon, PlusIcon],
    exports: [Fieldset, SharedModule],
    declarations: [Fieldset]
})
export class FieldsetModule {}
