"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([["react-syntax-highlighter_languages_refractor_ignore"],{

/***/ "(app-pages-browser)/./node_modules/refractor/lang/ignore.js":
/*!***********************************************!*\
  !*** ./node_modules/refractor/lang/ignore.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval(__webpack_require__.ts("\n\nmodule.exports = ignore\nignore.displayName = 'ignore'\nignore.aliases = ['gitignore', 'hgignore', 'npmignore']\nfunction ignore(Prism) {\n  ;(function (Prism) {\n    Prism.languages.ignore = {\n      // https://git-scm.com/docs/gitignore\n      comment: /^#.*/m,\n      entry: {\n        pattern: /\\S(?:.*(?:(?:\\\\ )|\\S))?/,\n        alias: 'string',\n        inside: {\n          operator: /^!|\\*\\*?|\\?/,\n          regex: {\n            pattern: /(^|[^\\\\])\\[[^\\[\\]]*\\]/,\n            lookbehind: true\n          },\n          punctuation: /\\//\n        }\n      }\n    }\n    Prism.languages.gitignore = Prism.languages.ignore\n    Prism.languages.hgignore = Prism.languages.ignore\n    Prism.languages.npmignore = Prism.languages.ignore\n  })(Prism)\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL25vZGVfbW9kdWxlcy9yZWZyYWN0b3IvbGFuZy9pZ25vcmUuanMiLCJtYXBwaW5ncyI6IkFBQVk7O0FBRVo7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxuYXZpblxcRG93bmxvYWRzXFxBSS1Qb3dlcmVkLUludGVncmF0ZWQtQ29kZS1BbmFseXplci1mb3ItRWZmaWNpZW50LURldmVsb3Blci1Xb3JrRmxvd1xcZG9jYWlcXG5vZGVfbW9kdWxlc1xccmVmcmFjdG9yXFxsYW5nXFxpZ25vcmUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gaWdub3JlXG5pZ25vcmUuZGlzcGxheU5hbWUgPSAnaWdub3JlJ1xuaWdub3JlLmFsaWFzZXMgPSBbJ2dpdGlnbm9yZScsICdoZ2lnbm9yZScsICducG1pZ25vcmUnXVxuZnVuY3Rpb24gaWdub3JlKFByaXNtKSB7XG4gIDsoZnVuY3Rpb24gKFByaXNtKSB7XG4gICAgUHJpc20ubGFuZ3VhZ2VzLmlnbm9yZSA9IHtcbiAgICAgIC8vIGh0dHBzOi8vZ2l0LXNjbS5jb20vZG9jcy9naXRpZ25vcmVcbiAgICAgIGNvbW1lbnQ6IC9eIy4qL20sXG4gICAgICBlbnRyeToge1xuICAgICAgICBwYXR0ZXJuOiAvXFxTKD86LiooPzooPzpcXFxcICl8XFxTKSk/LyxcbiAgICAgICAgYWxpYXM6ICdzdHJpbmcnLFxuICAgICAgICBpbnNpZGU6IHtcbiAgICAgICAgICBvcGVyYXRvcjogL14hfFxcKlxcKj98XFw/LyxcbiAgICAgICAgICByZWdleDoge1xuICAgICAgICAgICAgcGF0dGVybjogLyhefFteXFxcXF0pXFxbW15cXFtcXF1dKlxcXS8sXG4gICAgICAgICAgICBsb29rYmVoaW5kOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBwdW5jdHVhdGlvbjogL1xcLy9cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBQcmlzbS5sYW5ndWFnZXMuZ2l0aWdub3JlID0gUHJpc20ubGFuZ3VhZ2VzLmlnbm9yZVxuICAgIFByaXNtLmxhbmd1YWdlcy5oZ2lnbm9yZSA9IFByaXNtLmxhbmd1YWdlcy5pZ25vcmVcbiAgICBQcmlzbS5sYW5ndWFnZXMubnBtaWdub3JlID0gUHJpc20ubGFuZ3VhZ2VzLmlnbm9yZVxuICB9KShQcmlzbSlcbn1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./node_modules/refractor/lang/ignore.js\n"));

/***/ })

}]);