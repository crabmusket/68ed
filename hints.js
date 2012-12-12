function setHintDialog(data) {
    var dialog = $("#hint-dialog");
    
    if(data.title)
        dialog.find("h1").text(data.title).toggle(true);
    else
        dialog.find("h1").toggle(false);
    
    if(data.subtitle)
        dialog.find("#desc").text(data.subtitle).toggle(true);
    else
        dialog.find("#desc").toggle(false);
    
    if(data.text)
        dialog.find("#hint").text(data.text).toggle(true);
    else
        dialog.find("#hint").toggle(false);
    
    dialog.css({
        top: data.pos.top + "px",
        left: data.pos.left + "px",
    });
    
    return dialog;
}

$(document).on("mouseenter", ".ace_function", function() {
    // The oc68hc11 file has keys in uppercase.
    var op = $(this).text().toUpperCase();
    // Check for existence.
    if(op in opcodes68HC11) {
        var hint = opcodes68HC11[op].hint;
        // Display hint in popup.
        if(hint != undefined) {
            setHintDialog({
                //title: op,
                subtitle: "Opcode",
                text: hint,
                pos: {
                    left: $(this).offset().left,
                    top: $(this).position().top + $(this).height(),
                },
            }).toggle(true);
        }
    }
});

$(document).on("mouseenter", ".ace_keyword", function() {
    var op = $(this).text().toUpperCase();
    if(op in pseudoops68HC11) {
        var hint = pseudoops68HC11[op].hint;
        if(hint != undefined) {
            setHintDialog({
                //title: op,
                subtitle: "Assembler pseudo-op",
                text: hint,
                pos: {
                    left: $(this).offset().left,
                    top: $(this).position().top + $(this).height(),
                },
            }).toggle(true);
        }
    } else {
        console.log("Could not find hint for keyword " + op);
    }
});

$(document).on("mouseenter", ".ace_constant", function() {
    var value = $(this).text();
    if(!value.length || $(this).siblings('.ace_keyword').length != 0)
        return;
    // Data to display in the hint popup.
    hint = {
        pos: {
            left: $(this).offset().left,
            top: $(this).position().top + $(this).height(),
        }
    };
    // What is the number type?
    var type = "symbolic";
    if(value.indexOf('$') != -1)
        type = "hexadecimal";
    else if(value.indexOf('%') != -1)
        type = "binary";
    else if(value.match(/[0-9]+/))
        type = "decimal";
    if(value.charAt(0) == '#') {
        // Immediate value.
        hint.subtitle = "Immediate " + type + " number";
        hint.text = "The literal value will be used.";
    } else if(value.indexOf(',') != -1) {
        // Indexed value?
        var register = 'Y';
        if(value.indexOf('x') != -1)
            register = 'X';
        hint.subtitle = "Indexed memory access"
        hint.text = "The value stored in memory at address " + register + " + " + value.substring(0, value.indexOf(',')) + " will be used.";
    } else {
        hint.subtitle = type.charAt(0).toUpperCase() + type.slice(1) + " memory address";
        hint.text = "The value in memory at this address will be used.";
    }
    setHintDialog(hint).toggle(true);
});

$(document).on("mouseleave", ".ace_keyword, .ace_function, .ace_constant", function() {
    $("#hint-dialog").toggle(false);
});
