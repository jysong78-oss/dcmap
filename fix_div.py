import codecs

for filename in ['index.html', 'Unified_DC_Power_Map.html']:
    with codecs.open(filename, 'r', 'utf-8') as f:
        content = f.read()
    
    # We want to replace the specific sequence that has the extra div
    target = "</div></div>\n    </div>\n\n    <div id=\"info-pane\">"
    replacement = "</div>\n    </div>\n\n    <div id=\"info-pane\">"
    
    content = content.replace(target, replacement)
    
    with codecs.open(filename, 'w', 'utf-8') as f:
        f.write(content)
