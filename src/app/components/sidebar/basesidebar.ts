import { Directive, ElementRef, EventEmitter, Input, Output, effect, signal, TemplateRef } from '@angular/core';
import { BaseComponent } from 'primeng/basecomponent';
import { SidebarPosition } from './sidebar.interface';

@Directive({ standalone: true })
export class BaseSidebar extends BaseComponent {
    /**
     *  Target element to attach the dialog, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @group Props
     */
    @Input() appendTo: HTMLElement | ElementRef | TemplateRef<any> | string | null | undefined | any;
    /**
     * Whether to block scrolling of the document when sidebar is active.
     * @group Props
     */
    @Input() blockScroll: boolean = false;
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
     * Aria label of the close icon.
     * @group Props
     */
    @Input() ariaCloseLabel: string | undefined;
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
     * Whether an overlay mask is displayed behind the sidebar.
     * @group Props
     */
    @Input() modal: boolean = true;
    /**
     * Whether to dismiss sidebar on click of the mask.
     * @group Props
     */
    @Input() dismissible: boolean = true;
    /**
     * Whether to display the close icon.
     * @group Props
     */
    @Input() showCloseIcon: boolean = true;
    /**
     * Specifies if pressing escape key should hide the sidebar.
     * @group Props
     */
    @Input() closeOnEscape: boolean = true;
    /**
     * Transition options of the animation.
     * @group Props
     */
    @Input() transitionOptions: string = '150ms cubic-bezier(0, 0, 0.2, 1)';
    /**
     * Specifies the visibility of the dialog.
     * @group Props
     */
    @Input() set visible(val: boolean) {
        if (this._visible() !== val) {
            this._visible.set(val);
        }
    }
    get visible() {
        return this._visible();
    }
    visibleEffect = effect(() => {
        this.visibleChange.emit(this._visible());
    });
    /**
     * Specifies the position of the sidebar, valid values are "left", "right", "bottom" and "top".
     * @group Props
     */
    @Input() set position(value: SidebarPosition) {
        if (this._position() !== value) {
            this._position.set(value);
        }
    }
    get position() {
        return this._position();
    }
    positionEffect = effect(() => {
        switch (this._position()) {
            case 'left':
                this.transformOptions = 'translate3d(-100%, 0px, 0px)';
                break;
            case 'right':
                this.transformOptions = 'translate3d(100%, 0px, 0px)';
                break;
            case 'bottom':
                this.transformOptions = 'translate3d(0px, 100%, 0px)';
                break;
            case 'top':
                this.transformOptions = 'translate3d(0px, -100%, 0px)';
                break;
        }
    });
    /**
     * Adds a close icon to the header to hide the dialog.
     * @group Props
     */
    @Input() set fullScreen(value: boolean) {
        if (this._fullScreen() !== value) {
            this._fullScreen.set(value);
        }
    }
    get fullScreen() {
        return this._fullScreen();
    }
    fullScreenEffect = effect(() => {
        if (this._fullScreen()) {
            this.transformOptions = 'none';
        }
        this.fullScreenChange.emit(this._fullScreen());
    });
    /**
     * Defines the header of the sidebar.
     * @group Props
     */
    @Input() header: any;
    /**
     * Callback to invoke when dialog is shown.
     * @group Emits
     */
    @Output() onShow: EventEmitter<any> = new EventEmitter<any>();
    /**
     * Callback to invoke when dialog is hidden.
     * @group Emits
     */
    @Output() onHide: EventEmitter<any> = new EventEmitter<any>();
    /**
     * Callback to invoke when dialog visibility is changed.
     * @param {boolean} value - Visible value.
     * @group Emits
     */
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    /**
     * Callback to invoke when dialog full screen change.
     * @param {boolean} value - Full screen value.
     * @group Emits
     */
    @Output() fullScreenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    _visible = signal<boolean | undefined>(undefined);

    _position = signal<SidebarPosition>('left');

    _fullScreen = signal<boolean>(false);

    transformOptions: string = 'translate3d(-100%, 0px, 0px)';

    initParams() {
        return {
            props: {
                appendTo: this.appendTo,
                blockScroll: this.blockScroll,
                style: this.style,
                styleClass: this.styleClass,
                ariaCloseLabel: this.ariaCloseLabel,
                autoZIndex: this.autoZIndex,
                baseZIndex: this.baseZIndex,
                modal: this.modal,
                dismissible: this.dismissible,
                showCloseIcon: this.showCloseIcon,
                closeOnEscape: this.closeOnEscape,
                transitionOptions: this.transitionOptions,
                visible: this.visible,
                position: this.position,
                fullScreen: this.fullScreen,
                onShow: this.onShow,
                onHide: this.onHide,
                visibleChange: this.visibleChange,
                fullScreenChange: this.fullScreenChange
            },
            state: {
                visible: this.visible,
                position: this.position,
                fullScreen: this.fullScreen
            }
        };
    }

    classes = {
        root: ({ props }) => {
            return {
                'p-sidebar': true,
                'p-sidebar-active': props.visible,
                'p-sidebar-left': props.position === 'left' && !props.fullScreen,
                'p-sidebar-right': props.position === 'right' && !props.fullScreen,
                'p-sidebar-top': props.position === 'top' && !props.fullScreen,
                'p-sidebar-bottom': props.position === 'bottom' && !props.fullScreen,
                'p-sidebar-full': props.fullScreen
            };
        },
        header: 'p-sidebar-header',
        title: 'p-sidebar-header-content',
        closeButton: 'p-sidebar-close p-sidebar-icon p-link',
        closeIcon: 'p-sidebar-close-icon',
        content: 'p-sidebar-content',
        footer: 'p-sidebar-footer'
    };

    css = `
@layer primeng {
    .p-sidebar {
        position: fixed;
        transition: transform 0.3s;
        display: flex;
        flex-direction: column;
    }

    .p-sidebar-content {
        position: relative;
        overflow-y: auto;
        flex-grow: 1;
    }

    .p-sidebar-header {
        display: flex;
        align-items: center;
    }

    .p-sidebar-footer {
        margin-top: auto;
    }

    .p-sidebar-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: auto;
    }

    .p-sidebar-left {
        top: 0;
        left: 0;
        width: 20rem;
        height: 100%;
    }

    .p-sidebar-right {
        top: 0;
        right: 0;
        width: 20rem;
        height: 100%;
    }

    .p-sidebar-top {
        top: 0;
        left: 0;
        width: 100%;
        height: 10rem;
    }

    .p-sidebar-bottom {
        bottom: 0;
        left: 0;
        width: 100%;
        height: 10rem;
    }

    .p-sidebar-full {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        -webkit-transition: none;
        transition: none;
    }

    .p-sidebar-left.p-sidebar-sm,
    .p-sidebar-right.p-sidebar-sm {
        width: 20rem;
    }

    .p-sidebar-left.p-sidebar-md,
    .p-sidebar-right.p-sidebar-md {
        width: 40rem;
    }

    .p-sidebar-left.p-sidebar-lg,
    .p-sidebar-right.p-sidebar-lg {
        width: 60rem;
    }

    .p-sidebar-top.p-sidebar-sm,
    .p-sidebar-bottom.p-sidebar-sm {
        height: 10rem;
    }

    .p-sidebar-top.p-sidebar-md,
    .p-sidebar-bottom.p-sidebar-md {
        height: 20rem;
    }

    .p-sidebar-top.p-sidebar-lg,
    .p-sidebar-bottom.p-sidebar-lg {
        height: 30rem;
    }

    @media screen and (max-width: 64em) {
        .p-sidebar-left.p-sidebar-lg,
        .p-sidebar-left.p-sidebar-md,
        .p-sidebar-right.p-sidebar-lg,
        .p-sidebar-right.p-sidebar-md {
            width: 20rem;
        }
    }
}
    `;
}
