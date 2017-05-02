# angular2-tree

## Installation

    npm i @rign/angular2-tree
    
## Changes

### v1.0.0

* use ngrx/store
* remove events ITreeItemEvents - use Actions and Effects
* remove NodeModel
* simplify using tree

### v0.8.1

* fix package.json

### v0.8.0

* allow to create own template for tree item (if not specify it use default) - look in demo
* input option _disableContextMenu_ to disable context menu (default: false)
* update Demo - add alternative view of tree

### v0.7.0

* remove API config service (see section _Usage_)

### v0.6.2

* change name FolderService to NodeService
* change params names from _dirId_ to _nodeId_
* now you can use in your API paths parameter _{nodeId}_ which will be replaced on _nodeId_

### v0.6.1

* expose _ConfigService_ - it allow override urls for create, edit, and delete folder

### v0.6.0

* upgrade angular/cli to version _beta.32.3_
* fix demo

### v0.5.0

* primary version with all features described below.

## Usage
    
Include _TreeModule_ in your application module and create Store

    import {TreeModule} from '@rign/angular2-tree/main';
    
    @NgModule({
      declarations: [
        ...
      ],
      imports: [
        ...
        TreeModule,
        StoreModule.provideStore({trees: treeReducer})
      ]
    })
    
In any html file put 

    <rign-tree [treeModel]="treeModel"></rign-tree>
    
Create your own loader service as it is done in example        

    @Injectable()
    export class AppNodeService extends NodeService {
      protected apiConfig = {
        addUrl: '/api/nodes',
        getUrl: '/api/nodes',
        updateUrl: '/api/nodes',
        removeUrl: '/api/nodes',
      }
    }

and use it to load data.

In component where you create tree you should register _tree store_, create _TreeModel_ and load root tree

    export class MyTreeComponent implements OnInit {
      public folders: Observable<ITreeData>;
    
      public contextMenu: IContextMenu[] = [];
    
      public treeConfiguration: IConfiguration = {
        showAddButton: true,
        disableMoveNodes: false,
        treeId: 'tree3',
        dragZone: 'tree3',
        dropZone: ['tree3']
      };
    
      public treeModel: TreeModel;
    
      public constructor(private store: Store<ITreeState>,
                         private treeActions: TreeActionsService,
                         private nodeDispatcherService: NodeDispatcherService,
                         private appNodeService: AppNodeService) {
      }
    
      public ngOnInit() {
        const treeId = this.treeConfiguration.treeId;
        this.nodeDispatcherService.register(treeId, this.appNodeService);
    
        this.store.dispatch(this.treeActions.registerTree(treeId));
    
        this.folders = this.store.select('trees')
          .map((data: ITreeState) => {
            return data[treeId];
          })
          .filter((data: ITreeData) => !!data)
        ;
        this.treeModel = new TreeModel(this.folders, this.treeConfiguration);
      }
    }


### Create own item template

Also you can use your own template to display items. You can do that when you extend _ItemComponent_

    @Component({
      selector: 'new-tree-item',
      templateUrl: './newItem.component.html',
      styleUrls: ['./newItem.component.less']
    })
    export class NewItemComponent extends ItemComponent {
    
    }
    
and _newItem.component.html_

    <div class="tree-item row"
         [ngClass]="{'tree-item-selected': isSelected}"
         ri-droppable
         ri-draggable
         [dragZone]="treeModel.configuration.dragZone"
         [dropConfig]="{dropAllowedCssClass: 'drop-enabled', dropZone: treeModel.configuration.dropZone}"
         [node]="node"
    >
      <div class="col-sm-8">
        <i *ngIf="!isExpanded" (click)="expand()" class="fa fa-plus pointer"></i>
        <i *ngIf="isExpanded" (click)="collapse()" class="fa fa-minus pointer"></i>
        <span *ngIf="!isEditMode" class="tree-item-name" (click)="onSelect()">{{node.name}}</span>
        <form name="form">
          <input #inputElement type="text" class="form-control" *ngIf="isEditMode" [formControl]="nameField"
                 name="name" (keydown)="onChange($event)" (blur)="onBlur($event)"/>
        </form>
      </div>
      <div class="col-sm-4 text-right">
          <span class="btn-group btn-group-sm">
            <button class="btn btn-primary" (click)="onEdit($event)" [disabled]="isEditMode">
              <i class="fa fa-edit"></i>
            </button>
            <button class="btn btn-danger" (click)="onDelete()" [disabled]="isEditMode">
              <i class="fa fa-trash"></i>
            </button>
          </span>
      </div>
    </div>
    <div class="tree" *ngIf="isExpanded">
      <new-tree-item  *ngFor="let child of children$ | async" [node]="child" [treeModel]="treeModel" [contextMenu]="contextMenu"></new-tree-item>
    </div>

    
Then when you create tree component in your application use such construction

    <rign-tree [treeModel]="treeModel">
      <new-tree-item *ngFor="let node of treeModel.getRootNodes() | async" [node]="node" [treeModel]="treeModel" [contextMenu]="contextMenu"></new-tree-item>
    </rign-tree>
    
and that is all. Please see Demo where is such example.

## Demo

In folder _demo_ you can find application which use _TreeModule_

To run this example run in console:
    
* frontend
    
        npm start
        
* backend (be sure that directory _demo/backend/data_ has permissions to write)

        npm run backend
