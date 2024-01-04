import { CommonModule } from '@angular/common';
import { Input, ElementRef, Injectable, Component, ContentChild, ChangeDetectionStrategy, ViewEncapsulation, ViewContainerRef, ComponentRef, Directive } from '@angular/core';
import { ObjectUtils } from 'primeng/utils';

@Directive({ standalone: true })
export class BaseComponent {
    constructor(public el: ElementRef, public vc: ViewContainerRef) {}

    @Input() unstyled: boolean;

    @Input() pt: { [arg: string]: any } | undefined | null;

    @Input() ptOptions: { [arg: string]: any } | undefined | null;

    logValue() {
        console.log('hello world', this.unstyled);
    }

    ptm(key = '', params = {}) {
        return this._getPTValue(this.pt, key);
    }

    _getPTValue(obj = {}, key = '', params = {}, searchInDefaultPT = true) {
        const datasetPrefix = 'data-pc-';
        const searchOut = /./g.test(key) && !!params[key.split('.')[0]];
        const { mergeSections = true, mergeProps: useMergeProps = false } = this._getPropValue('ptOptions') || {};
        // const global = searchInDefaultPT ? (searchOut ? this._useGlobalPT(this._getPTClassValue, key, params) : this._useDefaultPT(this._getPTClassValue, key, params)) : undefined;
        // const self = searchOut ? undefined : this._usePT(this._getPT(obj, this.$name), this._getPTClassValue, key, { ...params, global: global || {} });
        // const datasets = key !== 'transition' && {
        //     ...(key === 'root' && { [`${datasetPrefix}name`]: ObjectUtils.toFlatCase(this.$.type.name) }),
        //     [`${datasetPrefix}section`]: ObjectUtils.toFlatCase(key)
        // };

        // return mergeSections || (!mergeSections && self) ? (useMergeProps ? mergeProps(global, self, datasets) : { ...global, ...self, ...datasets }) : { ...self, ...datasets };
    }

    _getPropValue(name) {
        return this[name] || this._getHostInstance(this)?.[name];
    }

    ngOnInit() {
        console.log(this, 'basecomp');
    }

    _getHostInstance(instance) {
        return this;
    }

    params() {
        const instance = this._getHostInstance(this);

        return {
            instance: this
        };
    }
}
