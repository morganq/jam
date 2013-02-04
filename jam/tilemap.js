define(["sprite", "util"], function(Sprite, Util) {
	cls = function(tileSize, tilesheetUrl, tileFunctions) {
		var self = new Sprite(0,0);	

		self.tiles = [];
		self.tileSize = tileSize;
		self.tileFunctions = tileFunctions || {};
		self.tilesheetLoaded = false;
		self.collides = false;

		// Resets the map and loads from a CSV (row-per-line,
		// comma-separated cells)
		self.loadCSV = function(text) {
			self.subSprites = [];
			self.tiles = [];

			lines = text.split("\n");

			for(var y = 0; y < lines.length; ++y)
			{
				var cells = lines[y].split(",");
				self.tiles.push([]);
				for(var x = 0; x < cells.length; ++x)
				{
					self.tiles[y].push(null);
					var index = cells[x] | 0;
					self.put(index,x,y);
				}
			}
			// It's possible for this (loadCSV) to be called before
			// the tilesheet has loaded which means updateTileGraphics will
			// be called after load instead of here.
			if(self.tilesheetLoaded) {
				self.updateTileGraphics();
			}
		}

		// Make an empty width by height grid
		self.loadEmpty = function(width, height) {
			self.tiles = [];
			for(var y = 0; y < height; y++) {
				self.tiles.push([]);
				for(var x = 0; x < width; x++) {
					self.tiles[y].push(null);
				}
			}
		}

		// place a type of tile at a given coordinate.
		self.put = function(tileIndex, x, y) {
			if(self.tiles[y][x] !== null) {
				self.remove(self.tiles[y][x]);	
				self.tiles[y][x] = null;
			}
			var tileFn = self.tileFunctions[tileIndex];
			if(tileFn !== undefined) {
				tileFn(self, x, y);
			}
			else if(tileIndex !== 0) {
				var t = new Sprite(x * self.tileSize, y * self.tileSize);
				t.immovable = true;
				t.tileIndex = tileIndex;
				self.tiles[y][x] = t;
				self.add(t);
			}
		};

		// Since the tilesheet image can be loaded async, we need a way to
		// go back through the tiles and set their 'animation' frame
		self.updateTileGraphics = function() {
			for(var y = 0; y < self.tiles.length; y++) {
				for(var x = 0; x < self.tiles[y].length; x++) {
					var t = self.tiles[y][x];
					if(t) {
						t.setImage(tilesheetUrl, self.tileSize, self.tileSize);
						t.setSingleFrame(t.tileIndex);
					}
				}
			}
		};

		Util.load(tilesheetUrl, function() {
			self.tilesheetLoaded = true;
			self.updateTileGraphics();
		});

		return self;
	};

	return cls;
});
