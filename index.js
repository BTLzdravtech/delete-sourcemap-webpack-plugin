const fs = require('fs-extra');
const co = require('co');
const pkg = require('./package.json');
class DeleteSourceMapWebpackPlugin{
    constructor(){
    }
    done(stats){
        const that = this;
        return co(function *(){
            let countMatchMapAssets = 0;
            yield Promise.all(Object.keys(stats.compilation.assets)
                .filter(name => /\.(?:js|css)\.map$/.test(name))
                .map(co.wrap(function *(name){
                    const {existsAt} = stats.compilation.assets[name];
                    if (typeof existsAt === 'string' &&
                      (yield fs.pathExists(existsAt)) &&
                      (yield fs.stat(existsAt)).isFile()) {
                        countMatchMapAssets += 1;
                        yield fs.remove(existsAt);
                    }
                })));
            console.log(`⭐ ⭐ ⭐ deleted map file: ${countMatchMapAssets} asset(s) processed`);
        });
    }
    apply(compiler){
        if (compiler.hooks) {
            compiler.hooks.done.tapPromise(pkg.name, stats => this.done(stats));
        } else if (compiler.plugin) {
            compiler.plugin('done', stats => this.done(stats));
        } else {
            throw new Error('Unsupported Webpack version');
        }
    }
}

module.exports = DeleteSourceMapWebpackPlugin;
