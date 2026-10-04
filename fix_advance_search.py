import os
from pathlib import Path

def fix_advance_search():
    public_dir = Path(r"C:\Users\suhan\OneDrive\Desktop\Sai reality\frontend\public")
    
    count = 0
    for html_file in public_dir.rglob("*.html"):
        with open(html_file, "r", encoding="utf-8") as f:
            content = f.read()
            
        modified = False
        
        # Change form action and method
        if 'action="/advanced-property-search/"' in content:
            content = content.replace(
                '<form method="post" action="/advanced-property-search/"',
                '<form method="GET" action="/properties_all.html"'
            )
            modified = True
            
        # Change 'For Sale' to 'Buy'
        if '<option value="Sale">For Sale</option>' in content:
            content = content.replace(
                '<option value="Sale">For Sale</option>',
                '<option value="Sale">Buy</option>'
            )
            modified = True
            
        if modified:
            with open(html_file, "w", encoding="utf-8") as f:
                f.write(content)
            count += 1
            
    print(f"Updated advance search forms in {count} files.")
    
    # Inject advanced JS filtering logic into properties_all.html
    prop_all = public_dir / "properties_all.html"
    if prop_all.exists():
        with open(prop_all, "r", encoding="utf-8") as f:
            prop_content = f.read()
            
        # Remove old script if it exists
        if 'id="search-filter-script"' in prop_content:
            start = prop_content.find('<!-- Search Filter Script -->')
            end = prop_content.find('</script>\n</body>') + 10
            if start != -1 and end != -1:
                prop_content = prop_content[:start] + "</body>"
        
        filter_script = """
<!-- Search Filter Script -->
<script id="search-filter-script">
document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    
    const query = params.get('query');
    const propertyType = params.get('propertyType'); // Sale, Rent, Lease
    const category = params.get('category');
    const city = params.get('city');
    const locationParams = params.getAll('location'); // multiple
    const bedroomParams = params.getAll('bedroom'); // multiple
    const furnishingParams = params.getAll('furnishing'); // multiple
    const minPrice = params.get('minPrice') ? parseInt(params.get('minPrice')) : null;
    const maxPrice = params.get('maxPrice') ? parseInt(params.get('maxPrice')) : null;
    
    // Check if any search parameter exists
    let isSearch = query || propertyType || category || city || locationParams.length || bedroomParams.length || furnishingParams.length || minPrice || maxPrice;
    
    if (isSearch) {
        // Set basic search input if exists
        if (query) {
            const inputs = document.querySelectorAll('input[name="query"]');
            inputs.forEach(input => input.value = query);
        }
        
        const boxes = document.querySelectorAll('.property-box');
        let matchCount = 0;
        
        boxes.forEach(box => {
            const container = box.closest('.col-lg-3, .col-lg-4, .col-md-6');
            if (!container) return;
            
            const title = (box.querySelector('.title')?.textContent || '').toLowerCase();
            const locText = (box.querySelector('.location')?.textContent || '').toLowerCase();
            const textContent = box.textContent.toLowerCase();
            
            // Extract price
            const priceEl = box.querySelector('.price');
            let priceVal = 0;
            if (priceEl) {
                const numStr = priceEl.textContent.replace(/[^0-9]/g, '');
                if (numStr) priceVal = parseInt(numStr);
            }
            
            let isMatch = true;
            
            // 1. Basic Query
            if (query && !title.includes(query.toLowerCase()) && !locText.includes(query.toLowerCase())) {
                isMatch = false;
            }
            
            // 2. Advance Filters
            if (propertyType) {
                if (propertyType === 'Sale' && !textContent.includes('sale') && !textContent.includes('buy')) isMatch = false;
                if (propertyType === 'Rent' && !textContent.includes('rent')) isMatch = false;
                if (propertyType === 'Lease' && !textContent.includes('lease')) isMatch = false;
            }
            
            if (category && category !== 'Nothing selected') {
                const cat = category.toLowerCase().trim();
                if (!textContent.includes(cat) && !title.includes(cat.split(' ')[0])) isMatch = false;
            }
            
            if (city && city.trim() !== '') {
                if (!locText.includes(city.toLowerCase().trim())) isMatch = false;
            }
            
            if (locationParams.length > 0) {
                let locMatch = false;
                for (let l of locationParams) {
                    if (locText.includes(l.toLowerCase())) locMatch = true;
                }
                if (!locMatch) isMatch = false;
            }
            
            if (bedroomParams.length > 0) {
                let bedMatch = false;
                for (let b of bedroomParams) {
                    if (textContent.includes(b + ' bedroom') || textContent.includes(b + 'bhk')) bedMatch = true;
                }
                if (!bedMatch) isMatch = false;
            }
            
            if (furnishingParams.length > 0) {
                let furnMatch = false;
                for (let f of furnishingParams) {
                    if (textContent.includes(f.toLowerCase())) furnMatch = true;
                }
                if (!furnMatch) isMatch = false;
            }
            
            if (minPrice && priceVal > 0 && priceVal < minPrice) isMatch = false;
            if (maxPrice && priceVal > 0 && priceVal > maxPrice) isMatch = false;
            
            if (isMatch) {
                container.style.display = 'block';
                matchCount++;
            } else {
                container.style.display = 'none';
            }
        });
        
        // Show a message if no results
        const row = document.querySelector('.property-box').closest('.row');
        if (row) {
            // clear old no-results
            const oldMsg = row.querySelector('.no-results-msg');
            if (oldMsg) oldMsg.remove();
            
            if (matchCount === 0) {
                const noRes = document.createElement('div');
                noRes.className = 'col-12 text-center my-5 no-results-msg';
                noRes.innerHTML = `<h3>No properties found matching your criteria.</h3><a href="/properties_all.html" class="btn btn-primary mt-3">Clear Search</a>`;
                row.appendChild(noRes);
            }
        }
    }
});
</script>
</body>
"""
        prop_content = prop_content.replace("</body>", filter_script)
        with open(prop_all, "w", encoding="utf-8") as f:
            f.write(prop_content)
        print("Injected advanced search filter script into properties_all.html")

if __name__ == "__main__":
    fix_advance_search()
