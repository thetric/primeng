import { DOCUMENT } from '@angular/common';
import { Input, ElementRef, Directive, SimpleChanges, effect, inject, ChangeDetectorRef, Renderer2, PLATFORM_ID, NgZone } from '@angular/core';
import { ObjectUtils, UniqueComponentId } from 'primeng/utils';
import { PrimeNGConfig } from '../api/primengconfig';
import { platformBrowser } from '@angular/platform-browser';

@Directive({ standalone: true })
export class BaseComponent {
    public el: ElementRef = inject(ElementRef);

    public renderer: Renderer2 = inject(Renderer2);

    public cd: ChangeDetectorRef = inject(ChangeDetectorRef);

    public config: PrimeNGConfig = inject(PrimeNGConfig);

    public document: Document = inject(DOCUMENT);

    public platformId: any = inject(PLATFORM_ID);

    public componentId: string = UniqueComponentId();

    public zone: NgZone = inject(NgZone);

    public isPlatformBrowser() {
        return platformBrowser(this.platformId);
    }

    public parentEl: ElementRef | undefined;

    @Input() unstyled: boolean = false;

    _pt: { [arg: string]: any } | undefined | null;

    @Input() get pt(): { [arg: string]: any } | undefined | null {
        return this._pt;
    }

    set pt(value: { [arg: string]: any } | undefined | null) {
        this._pt = value;
    }

    @Input() ptOptions: { [arg: string]: any } | undefined | null;

    params: any = {
        props: {},
        state: {}
    };

    constructor() {
        effect(() => {
            this.params = this.initParams();
        });
    }

    ngOnInit() {
        this.params = this.initParams();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes) {
            Object.keys(changes).forEach((key) => {
                if (key !== 'pt') {
                    this.params['props'][key] = changes[key].currentValue;
                }
            });
        }
    }

    initParams() {}

    ptm(key = '', params = {}) {
        return this._getPTValue(this.pt, key, { ...this._params(), ...params }, false);
    }

    _getPTValue(obj = {}, key = '', params = {}, searchInDefaultPT = true) {
        const datasetPrefix = 'data-pc-';
        const searchOut = /./g.test(key) && !!params[key.split('.')[0]];
        const mergeSections = true;
        const mergeProps = true;

        const self = searchOut ? undefined : this._usePT(this._getPT(obj, this.name), this._getPTClassValue.bind(this), key, { ...params, global: {} });
        const datasets = {
            ...(key === 'root' && { [`${datasetPrefix}name`]: ObjectUtils.toFlatCase(this.name) }),
            [`${datasetPrefix}section`]: ObjectUtils.toFlatCase(key)
        };
        return { ...self, ...datasets };
    }

    _getPT(pt, key = '', callback?) {
        const getValue = (value, checkSameKey = false) => {
            const computedValue = callback ? callback(value) : value;
            const _key = ObjectUtils.toFlatCase(key);
            const _cKey = ObjectUtils.toFlatCase(this.name);

            return (checkSameKey ? (_key !== _cKey ? computedValue?.[_key] : undefined) : computedValue?.[_key]) ?? computedValue;
        };

        return pt?.hasOwnProperty('_usept')
            ? {
                  _usept: pt['_usept'],
                  originalValue: getValue(pt.originalValue),
                  value: getValue(pt.value)
              }
            : getValue(pt, true);
    }

    _usePT(pt, callback, key, params) {
        const fn = (value: any) => callback(value, key, params);

        if (pt?.hasOwnProperty('_usept')) {
            const { mergeSections = true, mergeProps: useMergeProps = false } = pt['_usept'] || {};
            const originalValue = fn(pt.originalValue);
            const value = fn(pt.value);

            if (originalValue === undefined && value === undefined) return undefined;
            else if (ObjectUtils.isString(value)) return value;
            else if (ObjectUtils.isString(originalValue)) return originalValue;

            return mergeSections || (!mergeSections && value) ? (useMergeProps ? ObjectUtils.mergeProps(originalValue, value) : { ...originalValue, ...value }) : value;
        }

        return fn(pt);
    }

    _getPTClassValue(...args: any[]) {
        const value = this._getOptionValue(...args);
        return ObjectUtils.isString(value) || ObjectUtils.isArray(value) ? { class: value } : value;
    }

    _getOptionValue(...args) {
        const [options, key = '', params = {}] = args;
        const fKeys = ObjectUtils.toFlatCase(key).split('.');
        const fKey = fKeys.shift();

        return fKey
            ? ObjectUtils.isObject(options)
                ? this._getOptionValue(ObjectUtils.getItemValue(options[Object.keys(options).find((k) => ObjectUtils.toFlatCase(k) === fKey) || ''], params), fKeys.join('.'), params)
                : undefined
            : ObjectUtils.getItemValue(options, params);
    }

    _getPropValue(name) {
        return this[name] || this._getHostInstance(this)?.[name];
    }

    _getHostInstance(instance) {
        return this;
    }

    _params() {
        const instance = this._getHostInstance(this);

        // TODO: add props etc.
        return {
            instance: instance,
            props: instance['params']['props'],
            state: instance['params']['state']
        };
    }

    get name() {
        return this.constructor.name.replace(/^_/, '').toLowerCase();
    }

    cx(key = '', params = {}) {
        const classes = this['classes'];

        if (!this.unstyled) {
            return this._getOptionValue(classes, key, { ...this._params(), ...params });
        } else {
            return undefined;
        }
    }

    isUnstyled() {
        return this.unstyled;
    }
}
