import { Component } from '@angular/core';
import { Code } from '../../domain/code';

@Component({
    selector: 'full-screen-doc',
    template: `
        <app-docsectiontext>
            <p>Sidebar can cover the whole page when <i>fullScreen</i> property is enabled.</p>
        </app-docsectiontext>
        <div class="card flex justify-content-center">
            <p-sidebar [(visible)]="sidebarVisible" [fullScreen]="true" header="Full Screen Sidebar" />
            <p-button (click)="sidebarVisible = true" icon="pi pi-th-large" />
        </div>
        <app-code [code]="code" selector="sidebar-full-screen-demo"></app-code>
    `
})
export class FullScreenDoc {
    sidebarVisible: boolean = false;

    code: Code = {
        basic: `<p-sidebar [(visible)]="sidebarVisible" [fullScreen]="true" header="Full Screen Sidebar"/>
<p-button (click)="sidebarVisible = true" icon="pi pi-th-large"/>`,

        html: `<div class="card flex justify-content-center">
    <p-sidebar [(visible)]="sidebarVisible" [fullScreen]="true" header="Full Screen Sidebar"/>
    <p-button (click)="sidebarVisible = true" icon="pi pi-th-large"/>
</div>`,

        typescript: `import { Component } from '@angular/core';

@Component({
    selector: 'sidebar-full-screen-demo',
    templateUrl: './sidebar-full-screen-demo.html'
})
export class SidebarFullScreenDemo {
    sidebarVisible: boolean = false;
}`
    };
}
