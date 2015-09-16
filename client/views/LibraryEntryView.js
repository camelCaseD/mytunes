// LibraryEntryView.js - Defines a backbone view class for the entries that will appear within the library views. These will be inserted using the "subview" pattern.
var LibraryEntryView = Backbone.View.extend({

  initialize: function() {
    // this.model.on('change:playCount', this.render, this);

    this.model.on('play', this.rotate, this);
    this.model.on('pause', this.stopRotation, this);
    this.model.on('ended', this.stopRotation, this);
  },

  tagName: 'li',

  template: _.template('<img class="record mdl-shadow--3dp" src="img/camel.jpg" /><div class="title"><%= title %></div><div class="author">(<%= artist %>)</div>'),

  events: {
    'click': function() {
      this.model.enqueue();
    }
  },

  rotating: false,

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
    if (!this.rotating) {
      this.rotating = true;
      var animate = function(el) {
        el.velocity({rotateZ: ['366deg', '6deg']}, {queue: false, duration: 5000, easing: 'linear', complete: (function(elements) {
          this.rotating = true;
          animate($(elements[0]));
        }).bind(this)});
      };

      animate(this.$el.children('img'));
    }
  },

  stopRotation: function() {
    if (this.model.get('paused')) {
      this.$el.children('img').velocity('stop');

      this.rotating = false;

      // Get the images current rotation from it's css attr
      var style = this.$el.children('img').attr('style');

      if (style) {
        var rotation = parseFloat(style.split('transform: ')[1].match(/\((.+)\)/)[1]);
        this.$el.children('img').velocity({rotateZ: ['366deg', 360 / 180 + rotation + 'deg']}, {queue: false, duration: 500, easing: 'linear'});
      }
    }
  }

});
