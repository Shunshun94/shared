var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.Editor = io.github.shunshun94.trpg.logEditor.Editor || {};

io.github.shunshun94.trpg.logEditor.PostClickedEvents = [
    {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.PARENTHESES,
        action: (self, clicked, targetPost) => {
            self.appendParentheses(targetPost);
        }
    }, {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.NAMECHANGE,
        action: (self, clicked, targetPost) => {
            self.beHostPlayer(targetPost);
        }
    }, {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.NAMECYCLE,
        action: (self, clicked, targetPost) => {
            self.changePostName(targetPost);
        }
    }, {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.DUPLICATE,
        action: (self, clicked, targetPost) => {
            self.duplicate(targetPost);
        }
    }, {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.MERGE,
        action: (self, clicked, targetPost) => {
            self.copyToTrash([targetPost, targetPost.prev()]);
            self.merge(targetPost);
        }
    }, {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.DELETE,
        action: (self, clicked, targetPost) => {
            self.copyToTrash([targetPost]);
            targetPost.remove();
        }
    }, {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.RANDOM_ID,
        action: (self, clicked, targetPost) => {
            self.setRndId(targetPost);
        }
    }, {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.TOGGLE_SUB,
        action: (self, clicked, targetPost) => {
            self.toggleSub(targetPost);
        }
    }
];

io.github.shunshun94.trpg.logEditor.GeneralClicedEvents = [
    {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.SAVE,
        action: (self, clicked) => {
            const targetBlock = clicked.parents(`.editBlock`);
            self.openBackScreen();
            self.openSaveScreen(targetBlock.attr('id'));
        }
    }, {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU,
        action: (self, clicked) => {
            io.github.shunshun94.trpg.logEditor.menu.PopupMenu.toggle();
            self.openBackScreen();
            self.openNameConfigScreen();
        }
    }, {
        class: `${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-classInsert`,
        action: (self, clicked) => {
            const tr = clicked.parents(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-tr`);
            self.insertClassToNameConfig(tr);
        }
    }, {
        class: `${io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW}-close`,
        action: (self, clicked) => {
            self.closePreview();
            return;
        }
    }, {
        class: `${io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW}-update`,
        action: (self, clicked) => {
            self.showPreview();
        }
    }, {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_EXEC,
        action: (self, clicked) => {
            self.applyNameConfig();
            self.closeTmpWindow(clicked);
        }
    }, {
        class: `${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE_MENU_WINDOW}-save`,
        action: (self, clicked) => {
            self.closeTmpWindow(clicked);
            const buttonValue = clicked.val().split(' ');
            const targetBlockType = buttonValue[0];
            const targetExporter = buttonValue[1];
            io.github.shunshun94.trpg.logEditor.export.getExporter(targetExporter).exec(
                $(`#${targetBlockType}`).find('.logList'),
                self.head,
                self.omit,
                io.github.shunshun94.trpg.logEditor.DOMS.BODY.attr('class'),
                self.originalFileName);
        }
    }, {
        class: `${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-exec`,
        action: (self, clicked) => {
            self.insertNewElement();
            self.closeTmpWindow(clicked);
        }
    }, {
        class: `${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bg-exec`,
        action: (self, clicked) => {
            self.insertUpdateBackGroundPicture();
            self.closeTmpWindow(clicked);
        }
    }, {
        class: `${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bgm-exec`,
        action: (self, clicked) => {
            self.insertUpdateBackGroundMusic();
            self.closeTmpWindow(clicked);
        }
    }, {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.STYLE_RESET_MENU,
        action: (self, clicked) => {
            io.github.shunshun94.trpg.logEditor.menu.PopupMenu.toggle();
            self.styleReset();
        }
    }, {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.ID_INSERTION_MENU,
        action: (self, clicked) => {
            io.github.shunshun94.trpg.logEditor.menu.PopupMenu.toggle();
            self.insertIdToHs();
        }
    }, {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.DARKMODE_MENU,
        action: (self, clicked) => {
            io.github.shunshun94.trpg.logEditor.DOMS.BODY.toggleClass(io.github.shunshun94.trpg.logEditor.CLASSES.DARKMODE);
        }
    }, {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.POPUP_MENU_TOGGLE,
        action: (self, clicked) => {
            io.github.shunshun94.trpg.logEditor.menu.PopupMenu.toggle();
        }
    }, {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.INSERT_RESOURCE_MODIFICATION_LOGS,
        action: (self, clicked) => {
            self.insertResourceModifyTables();
            io.github.shunshun94.trpg.logEditor.menu.PopupMenu.toggle();
        }
    }, {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.ADD_FILE_MENU,
        action: (self, clicked) => {
            io.github.shunshun94.trpg.logEditor.FileLoader.kickOneTimeSave();
            io.github.shunshun94.trpg.logEditor.menu.PopupMenu.toggle();
        }
    }, {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.SAME_MEMBER_MENU,
        action: (self, clicked) => {
            self.searchSameMemberDoublePost();
        }
    }, {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW_MENU,
        action: (self, clicked) => {
            self.showPreview();
        }
    }, {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU,
        action: (self, clicked) => {
            self.openBackScreen();
            self.showAddElementMenu();
        }
    }, {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.TRASHBOX_MENU,
        action: (self, clicked) => {
            $('#trashbox').toggle(400);
            $('#tmpEditorB').toggle(400);
        }
    }, {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.BACKSCREEN,
        action: (self, clicked) => {
            self.closeTmpWindow(clicked);
        }
    }, {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.TRASHBOX_CLOSE,
        action: (self, clicked) => {
            $('#trashbox').hide(400);
            $('#tmpEditorB').show(400);
        }
    }, {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.DELETE_ALL,
        action: (self, clicked) => {
            $('#trashbox .logList .io-github-shunshun94-trpg-logEditor-Post').remove();
        }
    }
];

io.github.shunshun94.trpg.logEditor.PostRightClickedEvents = [
    {
        class: io.github.shunshun94.trpg.logEditor.CLASSES.NAMECYCLE,
        action: (self, clicked, targetPost) => {
            self.changePostNameReversed(targetPost);
        }
    }
];

io.github.shunshun94.trpg.logEditor.kickPostClickedEvents = (self, clicked, targetPost) => {
    for(const pair of io.github.shunshun94.trpg.logEditor.PostClickedEvents) {
        if( clicked.hasClass(pair.class) ) {
            pair.action(self, clicked, targetPost);
            return;
        }
    }
};

io.github.shunshun94.trpg.logEditor.kickPostRightClickedEvents = (self, clicked, targetPost) => {
    for(const pair of io.github.shunshun94.trpg.logEditor.PostRightClickedEvents) {
        if( clicked.hasClass(pair.class) ) {
            pair.action(self, clicked, targetPost);
            return true;
        }
    }
};

io.github.shunshun94.trpg.logEditor.kickGeneralClicedEvents = (self, clicked) => {
    for(const pair of io.github.shunshun94.trpg.logEditor.GeneralClicedEvents) {
        if( clicked.hasClass(pair.class) ) {
            pair.action(self, clicked);
            return;
        }
    }
};