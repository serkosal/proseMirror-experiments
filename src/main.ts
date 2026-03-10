import './style.css'
import '../node_modules/prosemirror-menu/style/menu.css'
import '../node_modules/prosemirror-example-setup/style/style.css'

import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list"
import { exampleSetup } from "prosemirror-example-setup";

import type { EditorStateConfig } from 'prosemirror-state';

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks
});


// editor config
let editorStateConfig: EditorStateConfig = {
  plugins: exampleSetup({ schema: mySchema })
};

const initialContent = document.querySelector("#content");
if (initialContent) {
  editorStateConfig.doc = DOMParser.fromSchema(mySchema).parse(initialContent);
}

// editor state
let editorState = EditorState.create(editorStateConfig);


// editor view
new EditorView(document.querySelector<HTMLDivElement>('#editor'), {
  state: editorState
});

