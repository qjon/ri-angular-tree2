import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {TreeModule} from '../../../../main';
import {TreeTwoComponent} from './treeTwo.component';
import {NewItemComponent} from './newItem.component';
import {TreeTwoNodeService} from './treeTwoNode.service';

@NgModule({
  declarations: [
    TreeTwoComponent,
    NewItemComponent
  ],
  exports: [TreeTwoComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    TreeModule
  ],
  providers: [TreeTwoNodeService]
})
export class TreeTwoModule {
}
