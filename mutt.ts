/*
TODO:
- have entities be much more flexible - can have draw, transform, ...
  but not necessary
- add MultiIndex and friends
*/


// something like
var r1 = new Rectangle({blah});
var r2 = new Rectangle({blah});
mutt.add(r1);
mutt.add(r2);
mutt.update();
mutt.remove(r2);
mutt.update();
