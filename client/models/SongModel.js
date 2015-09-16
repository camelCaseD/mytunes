// SongModel.js - Defines a backbone model class for songs.
var SongModel = Backbone.Model.extend({
  defaults: {
    playCount: 0,
    paused: true
  },

  play: function() {
    this.set('paused', false);

    // Triggering an event here will also trigger the event on the collection
    this.trigger('play', this);
  },

  pause: function() {
    this.set('paused', true);

    this.trigger('pause', this);
  },

  enqueue: function() {
    this.trigger('enqueue', this);
  },

  dequeue: function() {
    this.trigger('dequeue', this);
  },

  ended: function() {
    this.set('paused', true);

    this.set('playCount', this.get('playCount') + 1);
    
    this.trigger('ended', this);
  }

});
