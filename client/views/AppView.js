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

    this.songQueueView.$el.on('mouseenter', (function() {
      if (this.model.get('songQueue').length > 0) {
        this.playerView.$el.velocity({bottom: ['60px', '0px']}, {duration: 500, queue: false});
        this.songQueueView.$el.velocity({bottom: ['-338px', '-388px']}, {duration: 500, queue: false});
        this.songQueueView.$el.css('cursor', 'pointer');
        this.songQueueView.$el.on('click', (function(){
          this.playerView.$el.velocity({bottom: ['398px', '60px']}, {duration: 1000, queue: false});
          this.songQueueView.$el.velocity({bottom: ['0px', '-338px']}, {duration: 1000, queue: false});
          this.songQueueView.$el.css('cursor', 'default');
        }).bind(this));
      }
    }).bind(this));

    this.songQueueView.$el.on('mouseleave', (function() {
      if (this.model.get('songQueue').length > 0) {
        this.playerView.$el.velocity({bottom: ['0px', this.playerView.$el.css('bottom')]}, {duration: 500, queue: false});
        this.songQueueView.$el.velocity({bottom: ['-388px', this.songQueueView.$el.css('bottom')]}, {duration: 500, queue: false});
      }
    }).bind(this));

    return this.$el.html([
      this.libraryView.$el,
      this.playerView.$el,
      this.songQueueView.$el
    ]);
  }

});
