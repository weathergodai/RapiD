// Way
// wiki: http://wiki.openstreetmap.org/wiki/Way
//
// Ways can either be open or closed. A closed way is such that the
// last node is the first node.
//
// If a a way is _closed_, it is assumed to be an area unless it has a
// `highway` or `barrier` tag and is not also tagged `area`.
iD.Way = function(id, nodes, tags, loaded) {
    // summary:		An OSM way.
    this.type = 'way';
    this.id = id;
    this._id = iD.Util.id();
    this.deleted = false;
    this.entity = new iD.Entity();
    this.tags = tags || {};
    this.loaded = (loaded === undefined) ? true : loaded;
    this.modified = this.id < 0;
    this.nodes = [];
    this.extent = {};

    if (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            this.addNode(nodes[i]);
        }
    }
};

iD.Way.prototype = {

    addNode: function(node) {
        node.entity.addParent(this);
        this.nodes.push(node);
        this._bounds = null;
        return this;
    },

    // JOSM: http://josm.openstreetmap.de/browser/josm/trunk/src/org/openstreetmap/josm/data/osm/Way.java#L466
    isClosed: function() {
        // summary:	Is this a closed way (first and last nodes the same)?
        if (!this.nodes.length) return true;
        return this.nodes[this.nodes.length - 1] === this.nodes[0];
    },

    isType: function(type) {
        // summary:	Is this a 'way' (always true), an 'area' (closed) or a 'line' (unclosed)?
        if (type === 'way') return true;
        if (type === 'area') return this.isClosed();
        if (type === 'line') return !(this.isClosed());
        return false;	// Boolean
    },

    updateBounds: function() {
        this._bounds = d3.geo.bounds(iD.GeoJSON.mapping(this));
    },

    bounds: function() {
        // TODO: cache
        if (!this._bounds) this.updateBounds();
        return this._bounds;
    },

    // ---------------------
    // Bounding-box handling
    intersects: function(extent) {
        // No-node ways are inside of nothing.
        if (!this.nodes.length) return false;
        var bounds = this.bounds();
        // left
        return !(
            // the bottom right is to the top-left
            // of the top-left
            bounds[1][0] < extent[0][0] &&
            bounds[1][1] < extent[0][1] ||
            // The top left is to the bottom-right
            // of the top-left
            bounds[0][0] > extent[1][0] &&
            bounds[0][1] > extent[1][1]);
    }
};
