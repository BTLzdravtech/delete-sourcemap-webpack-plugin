class DeleteSourceMapWebpackPlugin{
    apply(compiler){
        let countMatchAssets = 0;
        compiler.plugin('after-compile', (compilation, cb) => {
            Object.keys(compilation.assets).filter(key => /\.js$/.test(key))
                .forEach(key => {
                    countMatchAssets += 1;
                    const asset = compilation.assets[key];
                    const source = asset.source().replace(/# sourceMappingURL=(.*\.map)/g, '# $1');
                    compilation.assets[key] = Object.assign(asset, {
                        source(){
                            return source;
                        }
                    });
                });
            cb();
        });
  
        compiler.plugin('done', stats => {
            const fs = require('fs');
            let countMatchMapAssets = 0;
            Object.keys(stats.compilation.assets)
                .filter(name => /\.js\.map$/.test(name))
                .forEach(name => {
                    countMatchMapAssets += 1;
                    const {existsAt} = stats.compilation.assets[name];
                    fs.unlinkSync(existsAt);
                });
            console.log(`⭐⭐⭐removed source map url: ${countMatchAssets} asset(s) processed`);
            console.log(`⭐⭐⭐deleted map file: ${countMatchMapAssets} asset(s) processed`);
        });
    }
}

module.exports = DeleteSourceMapWebpackPlugin;
