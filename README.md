# Red Tetris

### React-Redux Project: Play Tetris online in multiplayer!
*Ecole 42 Project*

##### Instructions: 

- Use the arrow keys to rotate, move and drop.
- Hit space for a hard drop.
- Hold a piece with 0.

<img src="https://github.com/JanWalsh91/red_tetris/blob/master/media/GIF%201.gif" alt="drawing" width="600"/>

Play against others in multiplayer!

<img src="https://github.com/JanWalsh91/red_tetris/blob/master/media/GIF%202.gif" alt="drawing" width="600"/>

View other's boards in real time.

<img src="https://github.com/JanWalsh91/red_tetris/blob/master/media/GIF%203.gif" alt="drawing" width="600"/>

Destroying more than one line at once gives you extra points and a debuf to all other players!

<img src="https://github.com/JanWalsh91/red_tetris/blob/master/media/GIF%204.gif" alt="drawing" width="600"/>

Last one standing wins!

<img src="https://github.com/JanWalsh91/red_tetris/blob/master/media/GIF%205.gif" alt="drawing" width="600"/>

### Install

Install [node](https://nodejs.org/en/) first. After that:

```
$ npm install
```

Edit `params.js` for your needs.


### Development Mode

#### Launch Server

```
$ npm run  srv-dev
> red_tetris@1.0.0 srv-dev /home/eric/JS/red_tetris
> DEBUG=tetris:* babel-watch -w src src/server/main.js
```

It launches a node.js server listening for socket.io connexions, that is wired to receive `ping` messages and answered to … `pong`.

#### Launch Client

```
$ npm run client-dev
> red_tetris@1.0.0 client-dev /home/eric/JS/red_tetris
> webpack-dev-server --colors --hot --inline --host 127.0.0.1 --port 8080

http://127.0.0.1:8080/
webpack result is served from /
content is served from /home/eric/JS/red_tetris
…
webpack: bundle is now VALID.
```

URL is not yet editable in `params.js`, change it directly inside `package.json`.

As you can guess we are using webpack `hot reload` module, try to update any file under `src/client` and your browser should reload your code.

```
[WDS] App updated. Recompiling...
```


#### Test

Stop server, or use an other setup
```
$ npm run test
```

Tests are installed under `test` folder.

#### Coverage

```
npm run coverage

> red_tetris@1.0.0 coverage /home/eric/JS/red_tetris
> NODE_ENV=test nyc -r lcov -r text mocha --require babel-core/register

```

Check results …. of this command, and launch your browser to `./coverage/lcov-report/index.html`


### Production Mode

It’s not a production recipe to run your Tetris over billions of players, but just 2 commands to run it without live reload.

```
$ npm run srv-dist

> red_tetris@1.0.0 srv-dist /home/eric/JS/red_tetris
> DEBUG=tetris:* babel src --out-dir dist

$ npm run client-dist

> red_tetris@1.0.0 client-dist /home/eric/JS/red_tetris
> NODE_ENV=production webpack --progress --colors

Hash: 6841f78bfe6867fb2913  
Version: webpack 1.13.0
Time: 1923ms
    Asset    Size  Chunks             Chunk Names
bundle.js  754 kB       0  [emitted]  main
    + 197 hidden modules

$  DEBUG=tetris:* node dist/server/main.js
  tetris:info tetris listen on http://0.0.0.0:3004 +0ms
  not yet ready to play tetris with U ...
```

In production mode, node.js server serves `index.html` and `bundle.js`, so you have to point to url set up in `params.js`
