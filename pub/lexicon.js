exports.globalLexicon = {
    "let" : { "tk": 0x12, "cls": "keyword" },
    "if" : { "tk": 0x05, "cls": "keyword" },
    "then" : { "tk": 0x06, "cls": "keyword" },
    "else" : { "tk": 0x07, "cls": "keyword" },
    "case" : { "tk": 0x0F, "cls": "keyword" },
    "of" : { "tk": 0x10, "cls": "keyword" },
    "end" : { "tk": 0x11, "cls": "keyword", "length": 0 },
    "true" : { "tk": 0x14, "cls": "val", "length": 0 },
    "false" : { "tk": 0x14, "cls": "val", "length": 0 },
    "add" : { "tk": 0x01, "name": "ADD", "cls": "function", "length": 2 , "arity": 2 },    
    "style" : { "tk": 0x01, "name": "STYLE", "cls": "function", "length": 2, "arity": 2 },
    "data" : { "tk": 0x01, "name": "DATA", "cls": "function", "length": 1 , "arity": 1 },
    "width" : { "tk": 0x01, "name": "WIDTH", "cls": "function", "length": 2, "arity": 2},
    "height" : { "tk": 0x01, "name": "HEIGHT", "cls": "function", "length": 2, "arity": 2},
    "horizontal" : { "tk": 0x01, "name": "HOR", "cls": "function", "length": 1, "arity": 1},
    "vertical" : { "tk": 0x01, "name": "VER", "cls": "function", "length": 1, "arity": 1},
    "icicle" : { "tk": 0x01, "name": "ICICLE", "cls": "function", "length": 1, "arity": 1},
    "sunburst" : { "tk": 0x01, "name": "SUNBURST", "cls": "function", "length": 1, "arity": 1},
    "label" : { "tk": 0x01, "name": "LABELS", "cls": "function", "length": 2, "arity": 2},
    "color" : { "tk": 0x01, "name": "COLOR", "cls": "function", "length": 2, "arity": 2},
    "zoom" : { "tk": 0x01, "name": "ZOOM", "cls": "function", "length": 1, "arity": 1},
    "rotate" : { "tk": 0x01, "name": "ROTATE", "cls": "function", "length": 2, "arity": 2},
    "rgb" : { "tk": 0x01, "name": "RGB", "cls": "function", "length": 3, "arity": 3},
    "brewer" : { "tk": 0x01, "name": "BREWER", "cls": "function", "length": 1, "arity": 1},
    "highlight" : { "tk": 0x01, "name": "LEAF", "cls": "function", "length": 3, "arity": 3},    
}
