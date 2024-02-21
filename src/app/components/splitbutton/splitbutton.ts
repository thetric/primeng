import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, ElementRef, EventEmitter, Input, NgModule, Output, QueryList, TemplateRef, ViewChild, ViewEncapsulation, effect, signal } from '@angular/core';
import { MenuItem, PrimeTemplate } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChevronDownIcon } from 'primeng/icons/chevrondown';
import { TieredMenu, TieredMenuModule } from 'primeng/tieredmenu';
import { UniqueComponentId } from 'primeng/utils';
import { ButtonProps, MenuButtonProps } from './splitbutton.interface';
import { Bind } from 'primeng/bind';
import { BaseSplitButton } from './basesplitbutton';

export type SplitButtonIconPosition = 'left' | 'right';
/**
 * SplitButton groups a set of commands in an overlay with a default command.
 * @group Components
 */
@Component({
    selector: 'p-splitButton',
    template: `
        <div #container [pBind]="ptm('root')" [ngClass]="cx('root')" [ngStyle]="style" [class]="styleClass">
            <ng-container *ngIf="contentTemplate; else defaultButton">
                <button
                    [pBind]="ptm('button')"
                    [ngClass]="cx('button')"
                    type="button"
                    pButton
                    [icon]="icon"
                    [iconPos]="iconPos"
                    (click)="onDefaultButtonClick($event)"
                    [disabled]="disabled"
                    [attr.tabindex]="tabindex"
                    [attr.aria-label]="buttonProps?.['aria-label'] || label"
                >
                    <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
                </button>
            </ng-container>
            <ng-template #defaultButton>
                <button
                    #defaultbtn
                    [pBind]="ptm('button')"
                    [ngClass]="cx('button')"
                    type="button"
                    pButton
                    [icon]="icon"
                    [iconPos]="iconPos"
                    [label]="label"
                    (click)="onDefaultButtonClick($event)"
                    [disabled]="disabled"
                    [attr.tabindex]="tabindex"
                    [attr.aria-label]="buttonProps?.['aria-label']"
                ></button>
            </ng-template>
            <button
                type="button"
                pButton
                [pBind]="ptm('menuButton')"
                [ngClass]="cx('menuButton')"
                (click)="onDropdownButtonClick($event)"
                (keydown)="onDropdownButtonKeydown($event)"
                [disabled]="disabled"
                [attr.aria-label]="menuButtonProps?.['aria-label'] || expandAriaLabel"
                [attr.aria-haspopup]="menuButtonProps?.['aria-haspopup'] || true"
                [attr.aria-expanded]="menuButtonProps?.['aria-expanded'] || isExpanded()"
                [attr.aria-controls]="menuButtonProps?.['aria-controls'] || ariaId"
            >
                <ChevronDownIcon *ngIf="!dropdownIconTemplate" [pBind]="ptm('menuButtonIcon')" />
                <ng-template *ngTemplateOutlet="dropdownIconTemplate"></ng-template>
            </button>
            <p-tieredMenu
                [pt]="ptm('menu')"
                [id]="ariaId"
                #menu
                [popup]="true"
                [model]="model"
                [style]="menuStyle"
                [styleClass]="menuStyleClass"
                [appendTo]="appendTo"
                [showTransitionOptions]="showTransitionOptions"
                [hideTransitionOptions]="hideTransitionOptions"
            ></p-tieredMenu>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./splitbutton.css'],
    host: {
        class: 'p-element'
    }
})
export class SplitButton extends BaseSplitButton {
    @ViewChild('container') containerViewChild: ElementRef | undefined;

    @ViewChild('defaultbtn') buttonViewChild: ElementRef | undefined;

    @ViewChild('menu') menu: TieredMenu | undefined;

    @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate> | undefined;

    contentTemplate: TemplateRef<any> | undefined;

    dropdownIconTemplate: TemplateRef<any> | undefined;

    ariaId: string | undefined;

    ngOnInit() {
        this.ariaId = UniqueComponentId();
    }

    ngAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this.contentTemplate = item.template;
                    break;

                case 'dropdownicon':
                    this.dropdownIconTemplate = item.template;
                    break;

                default:
                    this.contentTemplate = item.template;
                    break;
            }
        });
    }

    onDefaultButtonClick(event: MouseEvent) {
        this.onClick.emit(event);
        this.menu.hide();
    }

    onDropdownButtonClick(event?: MouseEvent) {
        this.onDropdownClick.emit(event);
        this.menu?.toggle({ currentTarget: this.containerViewChild?.nativeElement, relativeAlign: this.appendTo == null });
        this.isExpanded.set(this.menu.visible());
    }

    onDropdownButtonKeydown(event: KeyboardEvent) {
        if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
            this.onDropdownButtonClick();
            event.preventDefault();
        }
    }
}

@NgModule({
    imports: [CommonModule, BaseSplitButton, Bind, ButtonModule, TieredMenuModule, ChevronDownIcon],
    exports: [SplitButton, ButtonModule, TieredMenuModule],
    declarations: [SplitButton]
})
export class SplitButtonModule {}
