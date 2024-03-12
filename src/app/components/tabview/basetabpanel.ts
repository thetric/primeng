import { ContentChildren, Directive, EventEmitter, Input, Output, ViewContainerRef, effect, forwardRef, inject, signal } from '@angular/core';
import { BaseComponent } from 'primeng/basecomponent';
import { TabView } from './tabview';

@Directive({ standalone: true })
export class BaseTabPanel extends BaseComponent {
    /**
     * Defines if tab can be removed.
     * @group Props
     */
    @Input() closable: boolean | undefined = false;
    /**
     * Inline style of the tab header.
     * @group Props
     */
    @Input() get headerStyle(): { [klass: string]: any } | null | undefined {
        return this._headerStyle;
    }
    set headerStyle(headerStyle: { [klass: string]: any } | null | undefined) {
        this._headerStyle = headerStyle;
        this.tabView.cd.markForCheck();
    }
    /**
     * Style class of the tab header.
     * @group Props
     */
    @Input() get headerStyleClass(): string | undefined {
        return this._headerStyleClass;
    }
    set headerStyleClass(headerStyleClass: string | undefined) {
        this._headerStyleClass = headerStyleClass;
        this.tabView.cd.markForCheck();
    }
    /**
     * Whether a lazy loaded panel should avoid getting loaded again on reselection.
     * @group Props
     */
    @Input() cache: boolean | undefined = true;
    /**
     * Advisory information to display in a tooltip on hover.
     * @group Props
     */
    @Input() tooltip: string | undefined;
    /**
     * Position of the tooltip.
     * @group Props
     */
    @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' | undefined = 'top';
    /**
     * Type of CSS position.
     * @group Props
     */
    @Input() tooltipPositionStyle: string | undefined = 'absolute';
    /**
     * Style class of the tooltip.
     * @group Props
     */
    @Input() tooltipStyleClass: string | undefined;
    /**
     * Defines if tab is active.
     * @defaultValue false
     * @group Props
     */
    @Input() get selected(): boolean {
        return !!this._selected;
    }
    set selected(val: boolean) {
        this._selected = val;

        if (!this.loaded) {
            this.cd.detectChanges();
        }

        if (val) this.loaded = true;
    }
    /**
     * When true, tab cannot be activated.
     * @defaultValue false
     * @group Props
     */
    @Input() get disabled(): boolean {
        return !!this._disabled;
    }
    set disabled(disabled: boolean) {
        this._disabled = disabled;
        this.tabView.cd.markForCheck();
    }
    /**
     * Title of the tabPanel.
     * @group Props
     */
    @Input() get header(): string {
        return this._header;
    }
    set header(header: string) {
        this._header = header;

        // We have to wait for the rendering and then retrieve the actual size element from the DOM.
        // in future `Promise.resolve` can be changed to `queueMicrotask` (if ie11 support will be dropped)
        Promise.resolve().then(() => {
            this.tabView.updateInkBar();
            this.tabView.cd.markForCheck();
        });
    }
    /**
     * Left icon of the tabPanel.
     * @group Props
     * @deprecated since v15.4.2, use `lefticon` template instead.
     */
    @Input() get leftIcon(): string {
        return this._leftIcon;
    }
    set leftIcon(leftIcon: string) {
        this._leftIcon = leftIcon;
        this.tabView.cd.markForCheck();
    }
    /**
     * Left icon of the tabPanel.
     * @group Props
     * @deprecated since v15.4.2, use `righticon` template instead.
     */
    @Input() get rightIcon(): string | undefined {
        return this._rightIcon;
    }
    set rightIcon(rightIcon: string | undefined) {
        this._rightIcon = rightIcon;
        this.tabView.cd.markForCheck();
    }
    _headerStyle: { [klass: string]: any } | null | undefined;

    _headerStyleClass: string | undefined;

    _selected: boolean | undefined;

    _disabled: boolean | undefined;

    _header!: string;

    _leftIcon!: string;

    _rightIcon: string | undefined = undefined;

    closed: boolean = false;

    loaded: boolean = false;

    tabView = inject(forwardRef(() => TabView)) as TabView;

    viewContainer = inject(ViewContainerRef);
    initParams() {
        return {
            props: {},
            state: {}
        };
    }

    classes = {};

    css = `
`;
}
