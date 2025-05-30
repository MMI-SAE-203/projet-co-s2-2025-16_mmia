/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2533444552")

  // add field
  collection.fields.addAt(3, new Field({
    "convertURLs": false,
    "hidden": false,
    "id": "editor999008199",
    "maxSize": 0,
    "name": "text",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "editor"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2533444552")

  // remove field
  collection.fields.removeById("editor999008199")

  return app.save(collection)
})
