import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {TreeActionsService} from './treeActions.service';
import {IOuterNode} from '../interfaces/IOuterNode';
import {Observable} from 'rxjs/Observable';
import {ITreeAction, ITreeActionPayload} from './ITreeState';
import {NodeDispatcherService} from '../service/nodesDispatcher.service';
import {DragAndDrop} from '../dragAndDrop/dragAndDrop.service';
import {catchError, filter, map, mergeMap, switchMap} from 'rxjs/operators';
import 'rxjs/add/observable/of';

@Injectable()
export class TreeEffectsService {

  @Effect() register$ = this.actions$
    .ofType(TreeActionsService.TREE_REGISTER)
    .pipe(
      map((action: ITreeAction): ITreeAction => this.treeActions.loadTree(action.payload.treeId, null))
    );

  @Effect() load$ = this.actions$
    .ofType(TreeActionsService.TREE_LOAD)
    .pipe(
      mergeMap((action: ITreeAction) => this.loadNodes(action.payload.treeId, action.payload.id)
        .pipe(
          map((nodesData: IOuterNode[]): ITreeAction => this.treeActions.loadTreeSuccess(action.payload.treeId, action.payload.id, nodesData)),
          catchError(() => Observable.of(this.treeActions.loadTreeError(action.payload.treeId, action.payload.id)))
        )
      )
    );


  @Effect() delete$ = this.actions$
    .ofType(TreeActionsService.TREE_DELETE_NODE)
    .pipe(
      switchMap((action: ITreeAction) => this.deleteNode(action.payload.treeId, action.payload.node)
        .pipe(
          map((): ITreeAction => this.treeActions.deleteNodeSuccess(action.payload.treeId, action.payload.node)),
          catchError((): Observable<ITreeAction> => Observable.of(this.treeActions.deleteNodeError(action.payload.treeId, action.payload.node)))
        )
      )
    );


  @Effect() save$ = this.actions$
    .ofType(TreeActionsService.TREE_SAVE_NODE)
    .pipe(
      switchMap((action: ITreeAction) => this.saveNode(action.payload.treeId, action.payload.node)
        .pipe(
          map((node: IOuterNode): ITreeAction => this.treeActions.saveNodeSuccess(action.payload.treeId, action.payload.node, node)),
          catchError(() => Observable.of(this.treeActions.saveNodeError(action.payload.treeId, action.payload.node)))
        )
      )
    );

  @Effect() move$ = this.actions$
    .ofType(TreeActionsService.TREE_MOVE_NODE)
    .pipe(
      filter((action: ITreeAction) => {
        return action.payload.sourceOfDroppedData === DragAndDrop.DROP_DATA_TYPE;
      }),
      switchMap((action: ITreeAction) => this.moveNode(action.payload.treeId, action.payload.oldNode, action.payload.node)
        .pipe(
          map((node: IOuterNode): ITreeActionPayload => {
            return {
              treeId: action.payload.treeId,
              oldNode: action.payload.oldNode,
              node: node
            };
          }),
          catchError(() => {
            this.treeActions.moveNodeError(action.payload.treeId, action.payload.oldNode, action.payload.node);

            return Observable.of(action.payload);
          })
        )
      ),
      mergeMap((data: ITreeActionPayload) => {
        return [
          this.treeActions.moveNodeSuccess(data.treeId, data.oldNode, data.node),
          this.treeActions.loadTree(data.treeId, data.node.parentId)
        ];
      })
    );

  constructor(private actions$: Actions,
              private treeActions: TreeActionsService,
              private nodeDispatcherService: NodeDispatcherService) {
  }

  protected deleteNode(treeId: string, node: IOuterNode): Observable<IOuterNode> {
    const nodeService = this.nodeDispatcherService.get(treeId);

    return node.id ? nodeService.remove(node.id) : Observable.of(node);
  }

  protected loadNodes(treeId: string, id: string | null) {
    const nodeService = this.nodeDispatcherService.get(treeId);

    return nodeService.load(id);
  }

  protected saveNode(treeId: string, node: IOuterNode): Observable<IOuterNode> {
    const nodeService = this.nodeDispatcherService.get(treeId);

    if (node.id) {
      return nodeService.update(node);
    } else {
      return nodeService.add(node, node.parentId);
    }
  }

  protected moveNode(treeId: string, source: IOuterNode, target: IOuterNode): Observable<IOuterNode> {
    const nodeService = this.nodeDispatcherService.get(treeId);

    return nodeService.move(source, target);
  }
}