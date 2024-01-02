import { CommonModule } from '@angular/common';
import { Input, Directive, NgModule, ElementRef, Renderer2 } from '@angular/core';
import { ObjectUtils } from 'primeng/utils';
import { DomHandler } from 'primeng/dom';

@Directive({
    selector: '[pBind]'
})
export class Bind {
    @Input('pBind') attrs: { [key: string]: string };

    host: HTMLElement;

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.host = this.el.nativeElement;
    }

    ngOnInit() {
        this.bind();
    }

    bind() {
        if (ObjectUtils.isNotEmpty(this.attrs)) {
            DomHandler.setAttributes(this.host, this.attrs);
            const classes = this.classes();
            const styles = this.styles();
            const attributes = this.attributes();
            const listeners = this.listeners();

            console.log('classes', classes);
            console.log('styles', styles);
            console.log('attributes', attributes);
            console.log('listeners', listeners);
        }
    }

    classes() {
        const classes: string[] = [];

        Array.from(this.host.classList).forEach((className: string) => {
            classes.push(className);
        });
        return classes;
    }

    attributes() {
        const attrs: { [key: string]: string } = {};
        Array.from(this.host.attributes).forEach((attr: Attr) => {
            if (attr.name !== 'class' && attr.name !== 'style' && !attr.name.includes('ng-reflect')) {
                attrs[attr.name] = attr.value;
            }
        });

        return attrs;
    }

    styles() {
        const styles: { [key: string]: string } = {};
        const element = this.host;

        for (const prop in element.style) {
            if (element.style.hasOwnProperty(prop)) {
                styles[prop] = element.style[prop];
            }
        }

        return styles;
    }

    listeners() {
        const listeners: { [key: string]: Function } = {};
        const element = this.host;

        for (const prop in element) {
            if (prop.startsWith('on')) {
                const eventName = prop.slice(2);
                listeners[eventName] = element[prop];
            }
        }

        return listeners;
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [Bind],
    declarations: [Bind]
})
export class BindModule {}
