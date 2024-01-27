import { Component, Injectable } from '@angular/core';
import { Panel } from 'primeng/panel';

const css = `
@layer primeng {
    .p-panel-header {
        background-color:red;
        display: flex;
        align-items: center;
    }

    .p-panel-title {
        line-height: 1;
        order: 1;
    }

    .p-panel-header-icon {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        text-decoration: none;
        overflow: hidden;
        position: relative;
    }

    .p-panel-toggleable.p-panel-expanded > .p-toggleable-content:not(.ng-animating) {
        overflow: visible;
    }

    .p-panel-toggleable .p-toggleable-content {
        overflow: hidden;
    }
}`;

export default {
    name: 'accoridon',
    css
};
