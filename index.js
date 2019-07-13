const fs = require('fs-extra');
const co = require('co');
const pkg = require('./package.json');
class DeleteSourceMapWebpackPlugin{
    apply(compiler){
        let countMatchAssets = 0;
        compiler.hooks.afterCompile.tap(pkg.name, compilation => {
            Object.keys(compilation.assets).filter(key => /\.(?:js|css)$/.test(key)).forEach(key => {
                countMatchAssets += 1;
                const asset = compilation.assets[key];
                const source = asset.source().replace(/# sourceMappingURL=(.*\.map)/g, '# $1');
                compilation.assets[key] = Object.assign(asset, {
                    source(){
                        return source;
                    }
                });
            });
        });
        compiler.hooks.done.tapPromise(pkg.name, co.wrap(function *(stats){
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
            console.log(`⭐ ⭐ ⭐ removed source map url: ${countMatchAssets} asset(s) processed`);
            console.log(`⭐ ⭐ ⭐ deleted map file: ${countMatchMapAssets} asset(s) processed`);
        }));
    }
}

module.exports = DeleteSourceMapWebpackPlugin;
