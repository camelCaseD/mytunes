// AppView.js - Defines a backbone view class for the whole music app.
var AppView = Backbone.View.extend({

  initialize: function(params) {
    this.playerView = new PlayerView({model: this.model.get('currentSong')});
    this.libraryView = new LibraryView({collection: this.model.get('library')});
    this.songQueueView = new SongQueueView({collection: this.model.get('songQueue')});

    // change:currentSong - this is Backbone's way of allowing you to filter events to
    // ONLY receive change events for the specific property, 'currentSong'
    this.model.on('change:currentSong', function(model) {
      this.playerView.setSong(model.get('currentSong'));
    }, this);

    this.playerView.on('ended', function() {
      this.model.set('currentSong', this.model.get('songQueue').dequeue());
    }, this);

    this.playerView.on('play', function() {
      this.model.get('currentSong').play();
    }, this);

    this.playerView.on('pause', function() {
      this.model.get('currentSong').pause();
    }, this);
  },

  render: function() {
    this.$el.attr('id', 'player');
    return this.$el.html([
      this.playerView.$el,
      this.libraryView.$el,
      // this.songQueueView.$el
    ]);
  }

});
