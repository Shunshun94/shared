var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.export = io.github.shunshun94.trpg.logEditor.export || {};
io.github.shunshun94.trpg.logEditor.export.htmlWithCssExporter = io.github.shunshun94.trpg.logEditor.export.htmlWithCssExporter || {};

io.github.shunshun94.trpg.logEditor.export.htmlWithCssExporter.SUFFIX = `</body></html>`;

io.github.shunshun94.trpg.logEditor.export.htmlWithCssExporter.getPrefix = (mode, css) => {
	return `<!DOCTYPE html>
	<html>
	<head>
	  <meta charset="utf-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
	  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <style>
      ${css}
      </style>
	  <link rel="stylesheet" href="https://shunshun94.github.io/shared/jquery/io/github/shunshun94/trpg/logEditor/resources/default${ mode ? '-' + mode : ''}.css" type="text/css" />
	</head>
	<body>`;
};

io.github.shunshun94.trpg.logEditor.export.htmlWithCssExporter.exec = (doms, head, omit, mode, title) => {
	const array = io.github.shunshun94.trpg.logEditor.export.cssExporter.domsToJson(doms);
    const classes = io.github.shunshun94.trpg.logEditor.export.cssExporter.domJsonToCSS(array);
    const css = io.github.shunshun94.trpg.logEditor.export.cssExporter.convertClassesToText(classes);
	const body = io.github.shunshun94.trpg.logEditor.export.htmlExporter.generateBody(doms);
	const html = io.github.shunshun94.trpg.logEditor.export.htmlWithCssExporter.getPrefix(mode, css) +
				body + omit.join('\n') + io.github.shunshun94.trpg.logEditor.export.htmlExporter.SUFFIX;
	io.github.shunshun94.trpg.logEditor.export.htmlWithCssExporter.download(html, title);
};

io.github.shunshun94.trpg.logEditor.export.htmlWithCssExporter.download = io.github.shunshun94.trpg.logEditor.export.htmlExporter.download;
