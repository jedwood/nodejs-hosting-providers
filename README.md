nodejs-hosting-providers
========================

A comparison of node.js hosting providers as of May 2013


### Nodejitsu
- Deploy via custom command-line tool
- Kind of weird to get dumped onto a Github page when signing up
- requires a "subdomain" property in the package.json, but friendly prompt to add it
- auto-increments the "version" in package.json on each deploy
- plans start at $3 a month
- mongoHQ or mongolab
- IrisRedis
- keep it running "Nodejitsu's cloud services watch your programs for you! You shouldn't have to do anything special to keep your apps running"
- doesn't matter what you set the port to, as long as it's either 80 or greater than 1024. Things get proxied through 80 of course.
