/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function (config) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';

	config.contentsCss = ["body {font-size: 20px;}"];
	config.removePlugins = 'elementspath';
	config.resize_dir = 'both';
	config.resize_enabled = false;
	config.font_names = 'Arial/Arial, Helvetica, sans-serif;Comic Sans MS/Comic Sans MS, cursive;Courier New/Courier New, Courier, monospace;Georgia/Georgia, serif;Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;Tahoma/Tahoma, Geneva, sans-serif;Times New Roman/Times New Roman, Times, serif;Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;Verdana/Verdana, Geneva, sans-serif;新細明體;標楷體;微軟正黑體'; // 為加入額外字體  
	config.toolbarGroups = [{
			name: 'styles',
			groups: ['styles']
		},
		{
			name: 'colors',
			groups: ['colors']
		},
		{
			name: 'paragraph',
			groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']
		},
		{
			name: 'basicstyles',
			groups: ['basicstyles', 'cleanup']
		},
		{
			name: 'clipboard',
			groups: ['clipboard', 'undo']
		},
		{
			name: 'editing',
			groups: ['find', 'selection', 'spellchecker', 'editing']
		},
		{
			name: 'document',
			groups: ['mode', 'document', 'doctools']
		},
		{
			name: 'forms',
			groups: ['forms']
		},
		{
			name: 'links',
			groups: ['links']
		},
		{
			name: 'insert',
			groups: ['insert']
		},
		{
			name: 'tools',
			groups: ['tools']
		},
		{
			name: 'others',
			groups: ['others']
		},
		{
			name: 'about',
			groups: ['about']
		}
	];
	config.removeButtons = 'Source,Save,Templates,NewPage,Preview,Print,Cut,Copy,Paste,PasteFromWord,PasteText,Redo,Undo,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Button,ImageButton,HiddenField,Select,Underline,Strike,Subscript,Superscript,CopyFormatting,RemoveFormat,Styles,Format,About,Maximize,ShowBlocks,BGColor,Outdent,Indent,CreateDiv,Blockquote,BidiLtr,BidiRtl,Anchor,Unlink,Link,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,NumberedList,BulletedList,Language,JustifyBlock';
};