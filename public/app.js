
/************************************
 *
 * Error messages
 *
 * (red bar, overlays at top)
 *
 */
var error = $$({
  model: {msg:''}, 
  view: { 
    format:'<div><span data-bind="msg"/> <span id="close">(Click anywhere to close)</span></div>', 
    style:'& {position:fixed; top:0; left:0; right:0; z-index:1000; background:#f55; color:white; display:none; padding:5px 15px;}  & #close {float:right;}' 
  },
  controller: {},  
  // User-defined
  show: function(s){ 
    var self = this;
    this.model.set({msg:s}); 
    this.view.$().slideDown(200, function(){
      $(document).one('click', function(){ self.hide(); }); 
    }); 
  },
  hide: function(){ this.view.$().slideUp(100); }
});
$$.document.append(error);


/************************************
 *
 * Page header
 *
 */
var header = $$({}, 
  '<div>\
    <div class="container">\
      <div class="four columns alpha">&nbsp;</div>\
      <div class="twelve columns omega">\
        <img src="img/logo.png"/>\
        <div id="tagline">An <a href="http://agilityjs.com">agility.js</a> demo project</div>\
      </div>\
    </div>\
   </div>',
  '& {height:50px; background:#447; border-bottom:1px solid #113; margin-bottom:50px;}\
   & img {float:left; margin-top:15px;}\
   & #tagline {float:left; font-weight:bold; font-size:15px; margin-top:55px; margin-left:50px;}'
);
$$.document.append(header);


/************************************
 *
 * Main app container
 *
 */
var app = $$({}, 
  '<div class="container"> <div id="root" class="sixteen columns omega"/> </div>',
  '& {margin-top:20px;}'
);
$$.document.append(app);


/************************************
 *
 * User profile 
 *
 * (left area)
 *
 */
var avatars = ["alien_halloween_icon.png", "avatar_frankenstein_halloween_monster_icon.png", "avatar_gomez_halloween_head_icon.png", "bat_halloween_icon.png", "casper_halloween_icon.png", 
"chucky_icon.png", "devil_halloween_icon.png", "dracula_halloween_icon.png", "freddie_halloween_icon.png", "ghost_halloween_icon.png", "halloween_jack_skellington_icon.png", 
"halloween_jason_icon.png", "halloween_kokey_icon.png", "halloween_mike_icon.png", "halloween_mummy_icon.png", "halloween_pumpkin_icon.png", "halloween_scream_icon.png", 
"halloween_skull_icon.png", "halloween_slimer_icon.png", "halloween_squash_icon.png"];

var profile = $$({
  model: {avatarPath:'', name:''}, 
  view: {
    format: 
      '<div class="three columns alpha">\
        <h4>Profile</h4>\
        <hr/>\
        <div>Avatar:</div>\
        <div class="center"><img data-bind="src avatarPath"/></div> \
        <div>Pseudonym:</div>\
        <div id="name-input">\
          <input type="text" data-bind="name" placeholder="Enter your pseudonym" maxlength="12"/>\
        </div>\
        <div id="name-show" class="input-like" data-title="Click to change name"><span data-bind="name"/></div>\
      </div>',
    style: 
      '& .center {text-align:center;}\
       & hr {margin-bottom:20px;}\
       & input {width:150px;}\
       & img {cursor:pointer;;}\
       & div#name-show {display:none; font-weight:bold; cursor:pointer;}'
  },
  controller: {
    'create': function(){
      this.randomizeAvatar();
    },
    'click img': function(){
      this.randomizeAvatar();
    },
    'keyup input': function(event){
      if (event.which === 13) {
        this.trigger('change:name');
      }
    },
    'blur input': function(){
      this.trigger('change:name');
    },
    'change:name': function(){
      if (this.model.get('name')) {
        this.view.$('#name-input').hide();
        this.view.$('#name-show').show();
      }
    },
    'click #name-show': function(){
      this.view.$('#name-show').hide();
      this.view.$('#name-input').show();
    }
  },
  // User-defined functions
  randomizeAvatar: function(){
    var index = Math.floor(avatars.length * Math.random());
    this.model.set({avatarPath: 'img/'+avatars[index]});    
  },
  focus: function(){
    this.view.$('input').focus();
  }
});
app.append(profile, '#root');


/****************************************************
 *
 * Divider and container for The Wall 
 *
 * (right area)
 *
 */
var divider = $$({}, '<div class="one column">&nbsp</div>');
app.append(divider, '#root');

var wall = $$({}, '<div class="twelve columns omega"/>', '& {margin-bottom:30px;}');
app.append(wall, '#root');


/*****************************************
 *
 * The Wall - Post Input
 *
 * (right area, top)
 *
 */
var postInput = $$({
  model: {msg: ''},
  view: {
    format:
      '<div>\
        <div>What do you wanna tell the world, in 140 characters?</div>\
        <textarea maxlength="140" data-bind="msg" placeholder="Be kind! :)"/>\
        <button id="post">Post message</button>\
        <div style="clear:both">\
      </div>',
    style:
      '& textarea {float:left; width:400px; min-height:40px; resize:none;}\
       & button {float left; margin-left:20px;}'
  },
  controller: {
    'click #post': function(){
      if (profile.model.get('name').length === 0 ) {
        error.show('Please enter a pseudonym');
        return;
      }
      if (this.model.get('msg').length === 0 ) {
        error.show('Message is empty');
        return;
      }
      if (this.model.get('msg').length > 140 ) {
        error.show('Message is longer than 140 characters');
        return;
      }
      this.model.set(profile.model.get());
      this.model.set({time:(new Date()).getTime()});
      this.save(); // creates a new record since there is no model id      
    },
    'persist:save:success': function(){
      // reset model to initial state
      this.model.reset();
      this.view.$('textarea').focus();
    },
    'persist:error': function(){
      error.show('Error communicating with the server. Please try again soon.');
    }
  }
}).persist($$.adapter.restful, {collection:'posts', id:'_id', cache:false});
wall.append(postInput);


/******************************************************
 *
 * The Wall - Post Stream 
 * 
 * (below post input, right area)
 *
 */

// Post prototype
var post = $$({
  model:{},
  view:{
    format:
      '<div>\
        <div id="mini-profile">\
          <img data-bind="src avatarPath"><br/>\
          <span id="name" data-bind="name"/>\
        </div>\
        <div id="content">\
          <div id="quote">&ldquo;</div>\
          <div id="msg" data-bind="msg"/>\
          <div id="time"/>\
        </div>\
        <div style="clear:both"/>\
        <button id="erase">Erase it!</button>\
      </div>',
    style:
      '& {position:relative; background:#fff; border:1px solid #ddd; -moz-border-radius:5px; -webkit-border-radius:5px; border-radius:5px; margin-bottom:15px; padding:10px 20px;}\
       & #mini-profile {text-align:center; width:80px; float:left;}\
       & #mini-profile img {width:64px;}\
       & #mini-profile #name {font-weight:bold;}\
       & #content {margin-left:120px; position:relative;}\
       & #content #quote {position:absolute; top:10px; left:-10px; font-family:Georgia, serif; font-size:60px; color:#ccc;}\
       & #content #msg {font-weight:bold; font-size:16px; margin-left:20px; margin-top:10px; margin-bottom:10px;}\
       & #content #time {color:#888;}\
       & button#erase {display:none; position:absolute; bottom:-5px; right:10px;}'
  },
  controller:{
    'create': function(){
      var timeago = 'millennia ago';
      if (this.model.get('time')) {
        var theTime = parseInt(this.model.get('time'));
        timeago = $.timeago(new Date(theTime));
      }
      this.view.$('#time').text(timeago);
    },
    'mouseenter &': function(){
      this.view.$('button#erase').show();
    },
    'mouseleave &': function(){
      this.view.$('button#erase').hide();
    },
    'click button#erase': function(){
      var answer = confirm("Is this post offensive? If so, it's OK - go ahead and erase it!");
      if (answer) {
        this.destroy();
        this.erase();
      }
    }
  }
}).persist($$.adapter.restful, {collection:'posts', id:'_id', cache:false});

// Actual stream, container of posts
var stream = $$({
  model:{}, 
  view:{
    format: 
      '<div>\
        <div id="check"><a href="#">Check for new posts</a></div>\
        <div id="ajax"><img src="img/ajax.gif"/></div>\
        <div id="posts"/>\
      </div>',
    style: 
      '& #check {text-align:center; background:#FFFFD3; border:1px solid #E3DF7C; -moz-border-radius:5px; -webkit-border-radius:5px; border-radius:5px; margin-bottom:15px; padding:5px;}\
       & #ajax {text-align:center; margin-top:-10px; height:25px; overflow:hidden;}\
       & #ajax img {margin-top:-15px; display:none;}'
  },
  controller:{
    'create': function(){
      this.lastTime = 1;
    },
    'click a': function(){
      this.refresh();
    },
    'persist:start': function(){
      this.view.$('#ajax img').show();
    },
    'persist:stop': function(){
      this.view.$('#ajax img').hide();
    },
    'persist:error': function(){
      error.show('Error communicating with the server. Please try again soon.');
    },
    'persist:gather:success': function(){
      var self = this;
      // Loops over gathered posts to get latest time signature
      this.each(function(){
        if (parseInt(this.model.get('time')) > self.lastTime) {
          self.lastTime = parseInt(this.model.get('time'));
        }
      });
    }
  },
  // User-defined
  refresh: function(){
    this.gather(post, 'prepend', '#posts', {since: stream.lastTime});
  }
}).persist($$.adapter.restful, {cache:false});
wall.append(stream);


/************************************
 *
 * Inter-object glues
 *
 */

// Glue postInput to stream
postInput.bind('persist:save:success', function(){
  stream.refresh();
});


/************************************
 *
 * "Doc ready"
 *
 */

stream.refresh();
profile.focus();
