function provideSuggestions(editor, e) {
    // Current edit position given by event.
    var cursor = e.data.range.end;
    // Get the line up to the last point that was edited.
    var line = editor.getSession().getLine(cursor.row).substr(0, cursor.column);
    // If it looks like an opcode, start suggesting stuff!
    var matches = line.match(/^([a-zA-Z]+\:)?\s+([a-zA-Z]+)$/);
    if(matches) {
    console.log(matches);
        var codes = "";
        var needle = matches[matches.length - 1].toLowerCase();
        for(op in opcodes68HC11) {
            if(op.toLowerCase().indexOf(needle) == 0)
                codes += op.toLowerCase() + "\n";
        }
        setHintDialog({
            text: codes,
            pos: {
                top: 0,
                left: 0,
            }
        });
    }
    else
        setHintDialog();
}
