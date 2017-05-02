import {Directive, ElementRef, Input, OnChanges, OnInit, Renderer} from '@angular/core';
import {DragAndDrop} from './dragAndDrop.service';
import {IOuterNode} from '../interfaces/IOuterNode';

@Directive({
  selector: '[ri-draggable]'
})
export class Draggable implements OnChanges, OnInit {
  @Input() node: IOuterNode;
  @Input() dragZone: string | null = null;

  public dragEnabled = true;

  public constructor(protected el: ElementRef, private renderer: Renderer, protected dragAndDrop: DragAndDrop) {
    renderer.listen(el.nativeElement, 'dragstart', ($event) => {
      if (this.dragEnabled) {
        this.onDragStart($event);
      }
    });

    renderer.listen(el.nativeElement, 'dragend', () => {
      // on drag end we reset last drag element (this event is fired after drop)
      this.dragAndDrop.dragStart(null);
    });
  }

  private onDragStart($event) {
    $event.dataTransfer.setData('node', this.node.id.toString());
    this.dragAndDrop.dragStart({zoneId: this.dragZone, node: this.node});

    $event.dataTransfer.effectAllowed = 'copy';
    $event.dataTransfer.dropEffect = 'copy';
  }

  public ngOnChanges() {
    // this.dragEnabled = !this.node.tree.configuration.disableMoveNodes;
    this.el.nativeElement.draggable = this.dragEnabled;
  }

  public ngOnInit() {
    if (!this.node) {
      throw 'Draggable needs node';
    }
  }
}
