import { CommonModule } from '@angular/common';
import { Input, Directive, NgModule, ElementRef, Renderer2, SimpleChanges } from '@angular/core';
import { ObjectUtils } from 'primeng/utils';
import { DomHandler } from 'primeng/dom';

@Directive({
    selector: '[pBind]',
    standalone: true
})
export class Bind {
    @Input('pBind') attrs: { [key: string]: any };

    host: HTMLElement;

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.host = this.el.nativeElement;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.attrs.currentValue && ObjectUtils.equals(changes.attrs.currentValue, changes.attrs.previousValue) === false) {
            this.attrs = changes.attrs.currentValue;
            this.bind();
        }
    }

    bind() {
        if (ObjectUtils.isNotEmpty(this.attrs)) {
            DomHandler.setAttributes(this.host, this.all());
        }
    }

    classes() {
        const classes = this.attrs.class ? this.attrs.class.split(' ') : [];
        const existingClasses: string[] = Array.from(this.host.classList);
        return Array.from(new Set([...classes, ...existingClasses]));
    }

    attributes() {
        const attrs: { [key: string]: string } = {};
        const existingAttrs: { [key: string]: string } = {};

        if (this.attrs) {
            Object.keys(this.attrs).forEach((key) => {
                if (key !== 'class' && key !== 'style' && !key.startsWith('on')) {
                    existingAttrs[key] = this.attrs[key];
                }
            });
        }

        Array.from(this.host.attributes).forEach((attr: Attr) => {
            if (attr.name !== 'class' && attr.name !== 'style' && !attr.name.includes('ng-reflect')) {
                attrs[attr.name] = attr.value;
            }
        });

        return { ...attrs, ...existingAttrs };
    }

    styles() {
        const styles: { [key: string]: string } = {};
        const element = this.host;

        for (const prop in element.style) {
            if (element.style.hasOwnProperty(prop)) {
                styles[prop] = element.style[prop];
            }
        }

        return { ...styles, ...this.attrs.style };
    }

    listeners() {
        const listeners: { [key: string]: Function } = {};
        const existingListeners: { [key: string]: Function } = {};
        const element = this.host;

        if (this.attrs) {
            Object.keys(this.attrs).forEach((key) => {
                if (key.startsWith('on')) {
                    existingListeners[key] = this.attrs[key];
                }
            });
        }

        for (const prop in element) {
            if (prop.startsWith('on')) {
                const eventName = prop.slice(2);
                listeners[eventName] = element[prop];
            }
        }

        return { ...listeners, ...existingListeners };
    }

    all() {
        return {
            class: this.classes(),
            style: this.styles(),
            ...this.attributes(),
            ...this.listeners()
        };
    }
}
