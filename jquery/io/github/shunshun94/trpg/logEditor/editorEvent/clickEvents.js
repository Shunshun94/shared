var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.Editor = io.github.shunshun94.trpg.logEditor.Editor || {};

io.github.shunshun94.trpg.logEditor.PostClickedEvents = [
    {
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

io.github.shunshun94.trpg.logEditor.kickPostClickedEvents = (self, clicked, targetPost) => {
    for(const pair of io.github.shunshun94.trpg.logEditor.PostClickedEvents) {
        if( clicked.hasClass(pair.class) ) {
            pair.action(self, clicked, targetPost);
            return;
        }
    }
};

io.github.shunshun94.trpg.logEditor.kickGeneralClicedEvents = (self, clicked) => {
    if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.SAVE)) {
        const targetBlock = clicked.parents(`.editBlock`);
        self.openBackScreen();
        self.openSaveScreen(targetBlock.attr('id'));
    }
    if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU) ) {
        io.github.shunshun94.trpg.logEditor.menu.PopupMenu.toggle();
        self.openBackScreen();
        self.openNameConfigScreen();
    }
    if( clicked.hasClass(`${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-classInsert`) ) {
        const tr = clicked.parents(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-tr`);
        self.insertClassToNameConfig(tr);
    }
    if( clicked.hasClass(`${io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW}-close`) ) {
        self.closePreview();
        return;
    }
    if( clicked.hasClass(`${io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW}-update`) ) {
        self.showPreview();
        return;
    }
    if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_EXEC) ) {
        self.applyNameConfig();
        self.closeTmpWindow(clicked);
        return;
    }
    if( clicked.hasClass(`${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE_MENU_WINDOW}-save`) ) {
        self.closeTmpWindow(clicked);
        const buttonValue = clicked.val().split(' ');
        const targetBlockType = buttonValue[0];
        const targetExporter = buttonValue[1];
        io.github.shunshun94.trpg.logEditor.export.getExporter(targetExporter).exec(
            $(`#${targetBlockType}`).find('.logList'),
            self.head,
            self.omit,
            io.github.shunshun94.trpg.logEditor.DOMS.BODY.attr('class'));
        return;
    }
    if( clicked.hasClass(`${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-exec`)) {
        self.insertNewElement();
        self.closeTmpWindow(clicked);
        return;
    }
    if( clicked.hasClass(`${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bg-exec`)) {
        self.insertUpdateBackGroundPicture();
        self.closeTmpWindow(clicked);
        return;
    }
    if( clicked.hasClass(`${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bgm-exec`)) {
        self.insertUpdateBackGroundMusic();
        self.closeTmpWindow(clicked);
        return;
    }
    if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.STYLE_RESET_MENU) ) {
        io.github.shunshun94.trpg.logEditor.menu.PopupMenu.toggle();
        self.styleReset();
        return;
    }
    if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.ID_INSERTION_MENU) ) {
        io.github.shunshun94.trpg.logEditor.menu.PopupMenu.toggle();
        self.insertIdToHs();
        return;
    }
    if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.DARKMODE_MENU) ) {
        io.github.shunshun94.trpg.logEditor.DOMS.BODY.toggleClass(io.github.shunshun94.trpg.logEditor.CLASSES.DARKMODE);
    }
    if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.POPUP_MENU_TOGGLE) ) {
        io.github.shunshun94.trpg.logEditor.menu.PopupMenu.toggle();
        return;
    }
    if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.SYSTEM_TO_POST_MENU) ) {
        self.convertSystemToPost();
        io.github.shunshun94.trpg.logEditor.menu.PopupMenu.toggle();
        return;
    }
    if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.ADD_FILE_MENU) ) {
        io.github.shunshun94.trpg.logEditor.FileLoader.kickOneTimeSave();
        io.github.shunshun94.trpg.logEditor.menu.PopupMenu.toggle();
        return;
    }
    if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.SAME_MEMBER_MENU) ) {
        self.searchSameMemberDoublePost();
        return;
    }
    if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW_MENU) ) {
        self.showPreview();
        return;
    }
    if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU) ) {
        self.openBackScreen();
        self.showAddElementMenu();
        return;
    }
    if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.TRASHBOX_MENU)) {
        $('#trashbox').toggle(400);
        $('#tmpEditorB').toggle(400);
        return;
    }
    if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.BACKSCREEN) ) {
        self.closeTmpWindow(clicked);
        return;
    }
    if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.TRASHBOX_CLOSE)) {
        $('#trashbox').hide(400);
        $('#tmpEditorB').show(400);
        return;
    }
    if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.DELETE_ALL) ) {
        $('#trashbox .logList .io-github-shunshun94-trpg-logEditor-Post').remove();
    }
};