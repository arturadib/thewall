
/************************************
 *
 * Error messages
 *
 */
var error = $$({
  model: {msg:''}, 
  view: { 
    format:'<div><span data-bind="msg"/> <span id="close">(Click anywhere to close)</span></div>', 
    style:'& {background:#f55; color:white; display:none; padding:5px 15px;}  & #close {float:right;}' 
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
  hide: function(){ this.view.$().hide(); }
});
$$.document.add(error);


/************************************
 *
 * Page header
 *
 */
var header = $$({}, 
  '<div class="container"> <h1>The Wall</h1> </div>',
  '& {margin-top:30px;}  & h1 {text-align:center;}'
);
$$.document.add(header);


/************************************
 *
 * Main app container
 *
 */
var app = $$({}, 
  '<div class="container"> <div id="root" class="sixteen columns omega"/> </div>',
  '& {margin-top:20px;}'
);
$$.document.add(app);


/************************************
 *
 * User profile
 *
 */
var avatars = ["alien_halloween_icon.png", "avatar_frankenstein_halloween_monster_icon.png", "avatar_gomez_halloween_head_icon.png", "bat_halloween_icon.png", "casper_halloween_icon.png", 
"chucky_icon.png", "devil_halloween_icon.png", "dracula_halloween_icon.png", "freddie_halloween_icon.png", "ghost_halloween_icon.png", "halloween_jack_skellington_icon.png", 
"halloween_jason_icon.png", "halloween_kokey_icon.png", "halloween_mike_icon.png", "halloween_mummy_icon.png", "halloween_pumpkin_icon.png", "halloween_scream_icon.png", 
"halloween_skull_icon.png", "halloween_slimer_icon.png", "halloween_squash_icon.png"];

var profile = $$({
  model: {avatar:0, avatarPath:'', name:''}, 
  view: {
    format: 
      '<div class="three columns alpha">\
        <h4>Profile</h4>\
        <hr/>\
        <div class="center"><img data-bind="src avatarPath"/></div> \
        <div id="name-input">\
          <input type="text" data-bind="name" placeholder="Enter your pseudonym"/>\
        </div>\
        <div id="name-show" class="input-like" data-title="Click to change name"><span data-bind="name"/></div>\
      </div>',
    style: 
      '& .center {text-align:center;}\
       & hr {margin-bottom:20px;}\
       & input {width:150px;}\
       & img {cursor:pointer; margin:10px 0;}\
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
    this.model.set({avatar: index});
    this.model.set({avatarPath: 'img/'+avatars[index]});    
  },
  focus: function(){
    this.view.$('input').focus();
  }
});
app.add(profile, '#root');


/************************************
 *
 * Divider and container for The Wall
 *
 */
var divider = $$({}, '<div class="one column">&nbsp</div>');
app.add(divider, '#root');

var wall = $$({}, '<div class="ten columns omega"/>');
app.add(wall, '#root');


/************************************
 *
 * The Wall - input
 *
 */
var input = $$({
  model: {msg: ''},
  view: {
    format:
      '<div>\
        <h4>Your message</h4><hr/>\
        <textarea data-bind="msg"/>\
        <button>Post message</button>\
      </div>',
    style:
      '& textarea {width:400px}'
  },
  controller: {
    'click button': function(){
      if (profile.model.get('name').length === 0 ) {
        error.show('Please enter a pseudonym');
        return;
      }
      if (this.model.get('msg').length === 0 ) {
        error.show('Message is empty');
        return;
      }
      this.save(); // creates a new record since there is no model id
    }
  }
}).persist($$.adapter.restful, {collection:'posts'});
wall.add(input);


/************************************
 *
 * The Wall - stream
 *
 */
var stream = $$({}, '<div><h4>Stream</h4><hr/></div>');
wall.add(stream);


/************************************
 *
 * Final prep
 *
 */
profile.focus();
