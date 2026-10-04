import os
from pathlib import Path

def fix_search_forms():
    public_dir = Path(r"C:\Users\suhan\OneDrive\Desktop\Sai reality\frontend\public")
    
    # 1. Update the search form action and method in all HTML files
    count = 0
    for html_file in public_dir.rglob("*.html"):
        with open(html_file, "r", encoding="utf-8") as f:
            content = f.read()
            
        if '<form action="/search/" method="POST">' in content:
            new_content = content.replace(
                '<form action="/search/" method="POST">',
                '<form action="/properties_all.html" method="GET">'
            )
            with open(html_file, "w", encoding="utf-8") as f:
                f.write(new_content)
            count += 1
            
    print(f"Updated search forms in {count} files.")
    
    # 2. Inject JS filtering logic into properties_all.html
    prop_all = public_dir / "properties_all.html"
    if prop_all.exists():
        with open(prop_all, "r", encoding="utf-8") as f:
            prop_content = f.read()
            
        if "id=\"search-filter-script\"" not in prop_content:
            filter_script = """
<!-- Search Filter Script -->
<script id="search-filter-script">
document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');
    if (query) {
        const q = query.toLowerCase();
        // Set the search input value
        const inputs = document.querySelectorAll('input[name="query"]');
        inputs.forEach(input => input.value = query);
        
        // Filter property boxes
        const boxes = document.querySelectorAll('.property-box');
        let matchCount = 0;
        boxes.forEach(box => {
            const container = box.closest('.col-lg-3, .col-lg-4, .col-md-6');
            if (!container) return;
            
            const title = box.querySelector('.title')?.textContent || '';
            const location = box.querySelector('.location')?.textContent || '';
            
            if (title.toLowerCase().includes(q) || location.toLowerCase().includes(q)) {
                container.style.display = 'block';
                matchCount++;
            } else {
                container.style.display = 'none';
            }
        });
        
        // Show a message if no results
        const row = document.querySelector('.property-box').closest('.row');
        if (matchCount === 0 && row) {
            const noRes = document.createElement('div');
            noRes.className = 'col-12 text-center my-5';
            noRes.innerHTML = `<h3>No properties found for "${query}"</h3><a href="/properties_all.html" class="btn btn-primary mt-3">Clear Search</a>`;
            row.appendChild(noRes);
        }
    }
});
</script>
</body>
"""
            prop_content = prop_content.replace("</body>", filter_script)
            with open(prop_all, "w", encoding="utf-8") as f:
                f.write(prop_content)
            print("Injected search filter script into properties_all.html")

if __name__ == "__main__":
    fix_search_forms()
