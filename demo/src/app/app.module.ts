import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {TreeOneModule} from "./treeOne/treeOne.module";
import {TreeTwoModule} from "./treeTwo/treeTwo.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    TreeOneModule,
    TreeTwoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
