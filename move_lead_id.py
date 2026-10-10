import re

jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. We need to move the Lead ID td to before the Action td.
# First, find the exact block for Lead ID td.
lead_id_start = content.find('{/* Lead ID */}')
if lead_id_start != -1:
    lead_id_end = content.find('</td>', lead_id_start) + 5
    lead_id_td_block = content[lead_id_start:lead_id_end]
    
    # Remove it from its current position
    content = content[:lead_id_start] + content[lead_id_end:]
    
    # Find the Action td. It is right after Next Followup td.
    # The Action td has a delete button.
    # Let's search for "title=\"Delete Lead\"" or similar, or just find the end of Next Followup td.
    # Next Followup ends with `See Followups <i className="ri-arrow-down-s-line"></i>\n                      </button>\n                    </td>`
    
    next_followup_end = content.find('See Followups <i className="ri-arrow-down-s-line"></i>')
    if next_followup_end != -1:
        action_td_start = content.find('<td', next_followup_end)
        if action_td_start != -1:
            # Insert the lead_id_td_block here
            content = content[:action_td_start] + '  ' + lead_id_td_block + '\n\n                    ' + content[action_td_start:]
            
with open(jsx_file, 'w', encoding='utf-8') as f:
    f.write(content)
print("Moved Lead ID td!")
