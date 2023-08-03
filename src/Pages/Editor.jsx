import React from "react";
import {
  HtmlEditor,
  Image,
  Inject,
  Link,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar
} from "@syncfusion/ej2-react-richtexteditor";

import { Header } from "../Components";

const Editor = () => {
  return (
    <div className="m-2 md:m-8 mt-24 p-2 md:p-8 bg-white rounded-2xl ">
      <Header category="App" title="Editor" />
      <RichTextEditorComponent>
        <Inject
          services={[HtmlEditor, Toolbar, Image, Link, QuickToolbar]}
        />
      </RichTextEditorComponent>
    </div>
  );
};

export default Editor;
