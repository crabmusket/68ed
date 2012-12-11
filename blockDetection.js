// Is the line a label? For now, just look for a colon.
function isLabel(line) {
    return line.match(/^.*\:/);
}

// Is the line a branch? match a list of keywords.
function isBranch(line) {
    var branches = [
        'bcc', 'bcs', 'beq', 'bge', 'bgt', 'bhi', 'bhs', 'ble', 'blo', 'bls', 'blt', 
        'bmi', 'bne', 'bpl', 'bra', 'brclr', 'brset', 'bsr', 'bvc', 'bvs', 'jmp', 'jsr',
        'rts', 'rti'
    ];
    for (var i = 0; i < branches.length; i++) {
        var r = new RegExp('^[^\\*]*' + branches[i]);
        if (line.match(r))
            return true;
    }
    return false;
}

// Scan the entire document, breaking it into basic blocks.
function updateBlocks() {
    var block = 0;
    var lines = editor.getSession().getDocument().getAllLines();
    for (var i = 0; i < lines.length; i++) {
        var text = lines[i];
        // If this line is a label, start a new block.
        if (isLabel(text)) {
            block += 1;
        }
        // Highlight the gutter with the appropriate block style.
        editor.getSession().$decorations[i] = "";
        if (block > 0 && text.length > 0)
            editor.getSession().addGutterDecoration(i, "block" + (block % 10));
        // If this was a branch or jump, the next line begins a new block.
        if (isBranch(text)) {
            block += 1;
        }
    }
}
