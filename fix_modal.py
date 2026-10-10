import re

jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    content = f.read()

pattern_modal_content = r'(<h4 style={{ margin: \'0 0 20px 0\', fontSize: \'16px\', color: \'#1e293b\' }}>About Customer</h4>)'
repl_modal_content = r'''{showLeadDetailModal.loadingDetails && <div style={{padding: '20px', textAlign: 'center', color: '#64748b'}}>Loading full details from live server...</div>}
                {!showLeadDetailModal.loadingDetails && (
                  <>
                    \1'''
content = content.replace("<h4 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#1e293b' }}>About Customer</h4>", repl_modal_content.replace("\\1", "<h4 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#1e293b' }}>About Customer</h4>"))

pattern_modal_close = r'</div>\s*</div>\s*</div>\s*</div>\s*)}'
repl_modal_close = r'''</>
                )}
            </div>
          </div>
        </div>
      )}'''
content = re.sub(pattern_modal_close, repl_modal_close, content)

with open(jsx_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed modal")
