import { Directive, ElementRef, EventEmitter, Input, Output, TemplateRef, effect, signal } from '@angular/core';
import { BaseComponent } from 'primeng/basecomponent';
import { MenuItem } from '../api/menuitem';
import { ButtonProps, MenuButtonProps } from './splitbutton.interface';
import { SplitButtonIconPosition } from './splitbutton';

@Directive({ standalone: true })
export class BaseSplitButton extends BaseComponent {
    /**
     * MenuModel instance to define the overlay items.
     * @group Props
     */
    @Input() model: MenuItem[] | undefined;
    /**
     * Name of the icon.
     * @group Props
     */
    @Input() icon: string | undefined;
    /**
     * Position of the icon.
     * @group Props
     */
    @Input() iconPos: SplitButtonIconPosition = 'left';
    /**
     * Text of the button.
     * @group Props
     */
    @Input() label: string | undefined;
    /**
     * Inline style of the element.
     * @group Props
     */
    @Input() style: { [klass: string]: any } | null | undefined;
    /**
     * Class of the element.
     * @group Props
     */
    @Input() styleClass: string | undefined;
    /**
     * Inline style of the overlay menu.
     * @group Props
     */
    @Input() menuStyle: { [klass: string]: any } | null | undefined;
    /**
     * Style class of the overlay menu.
     * @group Props
     */
    @Input() menuStyleClass: string | undefined;
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    @Input() disabled: boolean | undefined;
    /**
     * Index of the element in tabbing order.
     * @group Prop
     */
    @Input() tabindex: number | undefined;
    /**
     *  Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @group Props
     */
    @Input() appendTo: HTMLElement | ElementRef | TemplateRef<any> | string | null | undefined | any;
    /**
     * Indicates the direction of the element.
     * @group Props
     */
    @Input() dir: string | undefined;
    /**
     * Defines a string that labels the expand button for accessibility.
     * @group Props
     */
    @Input() expandAriaLabel: string | undefined;
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
     * Button Props
     */
    @Input() buttonProps: ButtonProps | undefined;
    /**
     * Menu Button Props
     */
    @Input() menuButtonProps: MenuButtonProps | undefined;
    /**
     * Callback to invoke when default command button is clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    @Output() onClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
    /**
     * Callback to invoke when dropdown button is clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    @Output() onDropdownClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

    isExpanded = signal<boolean>(false);

    isExpandedEffect = effect(() => {
        const expanded = this.isExpanded();
        this.params = { ...this.params, state: { ...this.params.state, isExpanded: expanded } };
    });

    initParams() {
        return {
            props: {
                model: this.model,
                icon: this.icon,
                iconPos: this.iconPos,
                label: this.label,
                style: this.style,
                styleClass: this.styleClass,
                menuStyle: this.menuStyle,
                menuStyleClass: this.menuStyleClass,
                disabled: this.disabled,
                tabindex: this.tabindex,
                appendTo: this.appendTo,
                dir: this.dir,
                expandAriaLabel: this.expandAriaLabel,
                showTransitionOptions: this.showTransitionOptions,
                hideTransitionOptions: this.hideTransitionOptions,
                buttonProps: this.buttonProps,
                menuButtonProps: this.menuButtonProps,
                onClick: this.onClick,
                onDropdownClick: this.onDropdownClick
            },
            state: {
                isExpanded: this.isExpanded()
            }
        };
    }

    classes = {
        root: ({ props, state }) => {
            return {
                'p-splitbutton p-component': true
            };
        },
        button: 'p-splitbutton-defaultbutton',
        menuButton: 'p-splitbutton-menubutton p-button-icon-only'
    };

    css = `
@layer primeng {
    .p-splitbutton {
        display: inline-flex;
        position: relative;
    }

    .p-splitbutton .p-splitbutton-defaultbutton,
    .p-splitbutton.p-button-rounded > .p-splitbutton-defaultbutton.p-button,
    .p-splitbutton.p-button-outlined > .p-splitbutton-defaultbutton.p-button {
        flex: 1 1 auto;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right: 0 none;
    }

    .p-splitbutton-menubutton,
    .p-splitbutton.p-button-rounded > .p-splitbutton-menubutton.p-button,
    .p-splitbutton.p-button-outlined > .p-splitbutton-menubutton.p-button {
        display: flex;
        align-items: center;
        justify-content: center;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    .p-splitbutton .p-menu {
        min-width: 100%;
    }

    .p-fluid .p-splitbutton {
        display: flex;
    }
}`;
}
