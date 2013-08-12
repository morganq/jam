define(["sprite", "util"], function(Sprite, Util) {
  var tilemap = function(tileSize, tilesheetUrl, tileFunctions) {
	Sprite.call(this,0,0);

	this.tiles = [];
	this.tileSize = tileSize;
	this.tileFunctions = tileFunctions || {};
	this.tilesheetLoaded = false;
	this.collides = false;

    this.tilesheetUrl = tilesheetUrl;

	// Resets the map and loads from a CSV (row-per-line,
	// comma-separated cells)
	this.loadCSV = function(text) {
	  this.subSprites = [];
	  this.tiles = [];

	  lines = text.split("\n");

	  for(var y = 0; y < lines.length; ++y){
		var cells = lines[y].split(",");
		this.tiles.push([]);
		for(var x = 0; x < cells.length; ++x){
		  this.tiles[y].push(null);
		  var index = cells[x] | 0;
		  this.put(index,x,y);
		}
	  }
	  // It's possible for this (loadCSV) to be called before
	  // the tilesheet has loaded which means updateTileGraphics will
	  // be called after load instead of here.
	  if(this.tilesheetLoaded) {
		this.updateTileGraphics();
	  }
	}.bind(this);

	Util.load(this.tilesheetUrl, function() {
	  this.tilesheetLoaded = true;
	  this.updateTileGraphics();
	}.bind(this));

  };

  tilemap.prototype = new Sprite(0, 0);

  // Make an empty width by height grid.
  tilemap.prototype.loadEmpty = function(width, height) {
	this.tiles = [];
    for(var y = 0; y < height; y++) {
      this.tiles.push([]);
      for(var x = 0; x < width; x++) {
        this.tiles[y].push(null);
      }
    }
  }

  // Place a type of tile at a given coordinate.
  tilemap.prototype.put = function(tileIndex, x, y) {
	if(this.tiles[y][x] !== null) {
	  this.remove(this.tiles[y][x]);
	  this.tiles[y][x] = null;
	}
	var tileFn = this.tileFunctions[tileIndex];
	if(tileFn !== undefined) {
	  tileFn(this, x, y);
	}
	else if(tileIndex !== 0) {
	  var t = new Sprite(x * this.tileSize, y * this.tileSize);
	  t.immovable = true;
	  t.tileIndex = tileIndex;
	  this.tiles[y][x] = t;
	  this.add(t);
	}
  };

  // Since the tilesheet image can be loaded async, we need a way to
  // go back through the tiles and set their 'animation' frame.
  tilemap.prototype.updateTileGraphics = function() {
	for(var y = 0; y < this.tiles.length; y++) {
	  for(var x = 0; x < this.tiles[y].length; x++) {
		var t = this.tiles[y][x];
		if(t) {
		  t.setImage(this.tilesheetUrl, this.tileSize, this.tileSize);
		  t.setSingleFrame(t.tileIndex);
		}
	  }
	}
  };

  return tilemap;
});
