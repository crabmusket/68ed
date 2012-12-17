function provideSuggestions(editor, e) {
    // Current edit position given by event.
    var cursor = e.data.range.end;
    // Get the line up to the last point that was edited.
    var line = editor.getSession().getLine(cursor.row).substr(0, cursor.column);
    // If it looks like an opcode, start suggesting stuff!
    var matches = line.match(/^([a-zA-Z]+\:)?\s+([a-zA-Z]+)$/);
    if(matches) {
        var codes = [];
        // Last group in the match is what they're currently typing.
        var needle = matches[matches.length - 1].toLowerCase();
        // Find opcodes that start with the needle.
        for(op in opcodes68HC11) {
            if(op.toLowerCase().indexOf(needle) == 0) {
                var text = '<span class="suggestion">' + op.toLowerCase() + '</span>';
                if(opcodes68HC11[op].hint != undefined) {
                    text += '<span class="suggestion-desc">' + opcodes68HC11[op].hint + '</span>';
                }
                codes.push(text);
            }
        }
        if(codes.length < 2) {
            setHintDialog();
            return;
        }
        // Display matches in hint dialog for now.
        var coords = editor.renderer.textToScreenCoordinates(cursor.row, cursor.column);
        setHintDialog({
            text: '<ul><li>' + codes.join('</li><li>') + '</li></ul>',
            pos: {
                top: coords.pageY,
                left: coords.pageX,
            }
        });
    }
    else
        // Hide hint dialog when editing normally.
        setHintDialog();
}
