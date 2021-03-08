module.exports = {
  webpack: function(config, env) {
    if (env === "production") {

        // Disable all chunks
        config.optimization.runtimeChunk = false;
        config.optimization.splitChunks = {
            cacheGroups: {
                default: false,
            },
        };

        //JS Overrides
        config.output.filename = 'static/js/[name].js';
        config.output.chunkFilename = 'static/js/[name].chunk.js';

        //CSS Overrides
        config.plugins[5].options.filename = 'static/css/[name].css';
        config.plugins[5].options.chunkFilename = 'static/css/[name].chunk.css';

        //Media and Assets Overrides
        config.module.rules[2].oneOf[0].options.name = 'static/media/[name].[ext]';
        config.module.rules[2].oneOf[7].options.name = 'static/media/[name].[ext]';


        //console.log(JSON.stringify(config, null, 4));

    }

    return config;
  }
};