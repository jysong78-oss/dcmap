import codecs
import re

for filename in ['index.html', 'Unified_DC_Power_Map.html']:
    with codecs.open(filename, 'r', 'utf-8') as f:
        content = f.read()
    
    # We want to replace </div></div> with </div> right before <div id="info-pane">
    content = re.sub(r'</div>\s*</div>\s*</div>\s*<div id="info-pane">', '</div>\n      </div>\n    </div>\n\n    <div id="info-pane">', content)
    
    with codecs.open(filename, 'w', 'utf-8') as f:
        f.write(content)
