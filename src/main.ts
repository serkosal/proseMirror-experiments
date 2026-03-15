// import './style.css';
import '../node_modules/prosemirror-menu/style/menu.css';
import '../node_modules/prosemirror-view/style/prosemirror.css';
import '../node_modules/prosemirror-gapcursor/style/gapcursor.css';
import '../node_modules/prosemirror-example-setup/style/style.css';

import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser } from "prosemirror-model";
import type { NodeSpec } from 'prosemirror-model';
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list"
import { exampleSetup } from "prosemirror-example-setup";

import {MenuItem} from "prosemirror-menu"
import {buildMenuItems} from "prosemirror-example-setup"

import type { EditorStateConfig } from 'prosemirror-state';

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.



const lolNodeSpec = {
  attrs: {type: {default: "lol"}},
  inline: true,
  group: "inline",
  draggable: true,

  toDOM: node => ["span", { class: "lol" }, "lol"],
  parseDOM: [{
    tag: "span.lol",
    getAttrs: dom => ({ type: "lol" })
  }]
} satisfies NodeSpec;

const mySchema = new Schema({
  // nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block").addToEnd(
  //   "lol", lolNodeSpec
  // ),
  nodes: schema.spec.nodes.addBefore("image", "lol", lolNodeSpec),
  marks: schema.spec.marks
});

let lolType = mySchema.nodes.lol;

function insertLol(state: EditorState, dispatch?: (tr: Transaction) => void) {
  let {$from} = state.selection, index = $from.index();

  console.log('insert lol');

  if (!$from.parent.canReplaceWith(index, index, lolType))
    return false;
  if (dispatch) {
    dispatch(state.tr.replaceSelectionWith(lolType.create({type: "lol"})))
  }

  return true;
}



let menu = buildMenuItems(mySchema);

menu.insertMenu.content.push(new MenuItem({
  title: "Insert lol",
  label: "lol",
  enable(state) { return insertLol(state) },
  run: insertLol
}))


// editor config
const editorStateConfig: EditorStateConfig = {
  plugins: exampleSetup({ 
    schema: mySchema,
    menuContent: menu.fullMenu 
  })
};

// populate document with initial state
const initialContent = document.querySelector("#content");
if (initialContent) {
  editorStateConfig.doc = DOMParser.fromSchema(mySchema).parse(initialContent);
}

// editor state
const editorState = EditorState.create(editorStateConfig);


// editor view
new EditorView(document.querySelector<HTMLDivElement>('#editor'), {
  state: editorState
});

