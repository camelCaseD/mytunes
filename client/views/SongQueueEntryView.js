// SongQueueEntryView.js - Defines a backbone view class for the song queue entries.
var SongQueueEntryView = Backbone.View.extend({
  initialize: function() {
    this.model.on('change:playCount', this.render, this);
  },

  tagName: 'li',

  template: _.template('<img class="record mdl-shadow--3dp" src="img/brighterAlbumArt.jpg" /><div class="title"><%= title %></div><div class="author">(<%= artist %>)</div><div class="play-count"><%= playCount %></div>'),

  render: function(){
    this.$el.on('mouseenter', this.animate.bind(this));
    this.$el.on('mouseleave', this.stopAnimation.bind(this));
    return this.$el.html(this.template(this.model.attributes));
  },

  animate: function() {
    this.grow();
    this.rotate();
  },

  stopAnimation: function() {
    this.shrink();
    this.stopRotation();
  },

  grow: function() {
    this.$el.velocity({height: ['225px', '150px'], paddingTop: ['70px', '0px']}, {queue: false, duration: 500});
  },

  shrink: function() {
    this.$el.velocity({height: ['150px', '225px'], paddingTop: ['0px', '70px']}, {queue: false, duration: 500});
  },

  rotate: function() {
    var animate = function(el) {
      el.velocity({rotateZ: ['366deg', '6deg']}, {queue: false, duration: 5000, easing: 'linear', complete: function(elements) {
        animate($(elements[0]));
      }});
    };

    animate(this.$el.children('img'));
  },

  stopRotation: function() {
    this.$el.children('img').velocity('stop');

    // Get the images current rotation from it's css attr
    var rotation = parseFloat(this.$el.children('img').attr('style').split('transform: ')[1].match(/\((.+)\)/)[1]);
    this.$el.children('img').velocity({rotateZ: ['366deg', 360 / 180 + rotation + 'deg']}, {queue: false, duration: 500, easing: 'linear'});
  }
});
