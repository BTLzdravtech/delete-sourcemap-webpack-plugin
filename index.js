const fs = require('fs-extra');
const co = require('co');
const pkg = require('./package.json');
class DeleteSourceMapWebpackPlugin{
    constructor(){
        this.countMatchAssets = 0;
    }
    afterCompile(compilation){
        Object.keys(compilation.assets).filter(key => /\.(?:js|css)$/.test(key)).forEach(key => {
            this.countMatchAssets += 1;
            const asset = compilation.assets[key];
            let source = asset.source();
            const isBuffer = Buffer.isBuffer(source);
            if (isBuffer) {
                source = source.toString();
            }
            source = source.replace(/# sourceMappingURL=(.*\.map)/g, '# $1');
            compilation.assets[key] = Object.assign(asset, {
                source(){
                    if (isBuffer) {
                        return Buffer.from(source);
                    }
                    return source;
                }
            });
        });
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
            console.log(`\n⭐ ⭐ ⭐ removed source map url: ${that.countMatchAssets} asset(s) processed`);
            console.log(`⭐ ⭐ ⭐ deleted map file: ${countMatchMapAssets} asset(s) processed`);
        });
    }
    apply(compiler){
        if (compiler.hooks) {
            compiler.hooks.afterCompile.tap(pkg.name, compilation => this.afterCompile(compilation));
            compiler.hooks.done.tapPromise(pkg.name, stats => this.done(stats));
        } else if (compiler.plugin) {
            compiler.plugin('after-compile', (compilation, cb) => {
                this.afterCompile(compilation);
                cb();
            });
            compiler.plugin('done', stats => this.done(stats));
        } else {
            throw new Error('不被支持的 webpack 版本');
        }
    }
}

module.exports = DeleteSourceMapWebpackPlugin;
