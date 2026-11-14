import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ICONS, IconName, IconShape } from './icons';

/**
 * Displays a Lucide icon drawn with SVG.
 *
 *   <app-icon name="ticket" />                      decorative (hidden from screen readers)
 *   <app-icon name="trash-2" [size]="16" />         smaller
 *   <app-icon name="circle-alert" label="Erreur" /> meaningful: read by screen readers
 *
 * The icon takes the text color of its parent (stroke="currentColor"),
 * so it is automatically white in a primary button and red in an error message.
 */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'icon' },
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      [attr.width]="size()"
      [attr.height]="size()"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth()"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.role]="label() ? 'img' : null"
      [attr.aria-label]="label() ?? null"
      [attr.aria-hidden]="label() ? null : 'true'"
      focusable="false"
    >
      @for (shape of shapes(); track $index) {
        @switch (shape[0]) {
          @case ('path') {
            <svg:path [attr.d]="shape[1]['d']" />
          }
          @case ('circle') {
            <svg:circle [attr.cx]="shape[1]['cx']" [attr.cy]="shape[1]['cy']" [attr.r]="shape[1]['r']" />
          }
          @case ('rect') {
            <svg:rect
              [attr.x]="shape[1]['x']"
              [attr.y]="shape[1]['y']"
              [attr.width]="shape[1]['width']"
              [attr.height]="shape[1]['height']"
              [attr.rx]="shape[1]['rx']"
              [attr.ry]="shape[1]['ry']"
            />
          }
          @case ('line') {
            <svg:line [attr.x1]="shape[1]['x1']" [attr.y1]="shape[1]['y1']" [attr.x2]="shape[1]['x2']" [attr.y2]="shape[1]['y2']" />
          }
          @case ('polyline') {
            <svg:polyline [attr.points]="shape[1]['points']" />
          }
          @case ('ellipse') {
            <svg:ellipse [attr.cx]="shape[1]['cx']" [attr.cy]="shape[1]['cy']" [attr.rx]="shape[1]['rx']" [attr.ry]="shape[1]['ry']" />
          }
        }
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex-shrink: 0;
      line-height: 0;
    }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(18);
  readonly strokeWidth = input(2);
  /** Set it only when the icon carries meaning without visible text next to it. */
  readonly label = input<string>();

  /** Missing attributes (e.g. no rx) are undefined: Angular then leaves them out. */
  protected readonly shapes = computed<readonly IconShape[]>(() => ICONS[this.name()]);
}
