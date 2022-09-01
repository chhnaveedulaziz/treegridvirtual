## Plugins

The tree grid component merges qualities of the data grid component and the tree component. Essentially, the tree grid is a data grid that has a tree as one of its columns. Every tree node has a grid row, but grid rows are visible only for visible tree nodes. You might want to use a tree grid instead of a data grid if your data grid contains nested, tree-like data, and you want to allow the user to collapse and expand the data in the grid. You might want to use a tree grid instead of a tree if you want to include more information in each tree node than simply a label and icon.

# syncfusion Treegrid

[(https://ej2.syncfusion.com/angular/documentation/treegrid/virtual/)]
## Features

- Loading data dynamically from json file using nodeJS and socket.io
- Serialising data in json file
- Getting an object using taskID
- Add new rows in file
- Adding new children in existing rows
- Editing existing rows
- Deleting rows from json file
- Copying one row to another
- Loading tree grid from Apis
- Using proper colour coding as described in requirement document
- Multilevel Sorting
- Column selection
- CRUD operations for UI
## Tech

- [AngularJS] - HTML enhanced for web apps!
- [node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework 

## Installation

Install the dependencies and devDependencies and start the server.

Setup Backend (NodeJS)
- `npm install `

 Setup Angular 

- `cd client`
- `npm install`
## Development

Node Js:
- `npm start`

Angular:

- `cd client`
- `ng serve`

Dev : `set API_URL in environment.ts `
Prod : `set API_URL in environment.prod.ts `

# Tree Grid Data
- `All data store in treeGridData.json file`

