module.exports = {
    presets: [
      ["@babel/preset-env", { "modules": "commonjs" }],
      '@babel/preset-react',
      '@babel/preset-flow',
    ],
    plugins: [
      'babel-plugin-styled-components',
      '@babel/plugin-proposal-class-properties',
    ]
  }