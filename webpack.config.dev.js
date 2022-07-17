const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: ['./src/index.tsx'],
  devtool: 'source-map',
  output: {
    filename: '[contenthash].js',
    chunkFilename: '[chunkhash].js',
    assetModuleFilename: '[contenthash][ext]',
    path: path.resolve(__dirname, './build/')
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: ['src', 'node_modules'],
    fallback: {
      url: false,
      util: false,
      buffer: require.resolve('buffer/')
    },
    alias: {
      React: path.resolve(__dirname, './node_modules/react/'),
      ReactDOM: path.resolve(__dirname, './node_modules/react-dom/')
    }
  },
  stats: {
    modules: true
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'public/pdfjs', to: 'pdfjs' }]
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.ico',
      inject: true,
      minify: false
    }),
    new MiniCssExtractPlugin({
      filename: '[contenthash].css'
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    })
  ],
  module: {
    rules: [
      {
        test: /.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript', '@babel/preset-react', '@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: /.tsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript', '@babel/preset-react', '@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: /\.(scss)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: (resourcePath) => resourcePath.endsWith('.scss'),
                localIdentName: '[name]__[local]--[hash:base64:5]'
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        dependency: { not: ['url'] },
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream'
          }
        }
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        dependency: { not: ['url'] },
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml'
          }
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        dependency: { not: ['url'] },
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[contentHash:20].[ext]'
            }
          }
        ]
      }
    ]
  },
  devServer: {
    liveReload: true,
    open: false,
    port: 5888,
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, './public'),
      publicPath: '/'
    }
  }
};
