import os
from pathlib import Path

def patch_script():
    prop_all = Path(r"C:\Users\suhan\OneDrive\Desktop\Sai reality\frontend\public\properties_all.html")
    if not prop_all.exists():
        print("File not found")
        return
        
    with open(prop_all, "r", encoding="utf-8") as f:
        content = f.read()
        
    start = content.find('<!-- Search Filter Script -->')
    end = content.find('</script>\n</body>') + 10
    
    if start == -1 or end == -1:
        print("Could not find script block")
        return
        
    new_script = """
<!-- Search Filter Script -->
<script id="search-filter-script">
document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    
    const query = params.get('query');
    const propertyType = params.get('propertyType'); // Sale, Rent, Lease
    let category = params.get('category');
    if (category === 'Nothing selected') category = null;
    const city = params.get('city');
    let locationParams = params.getAll('location'); 
    locationParams = locationParams.filter(l => l !== 'Nothing selected');
    let bedroomParams = params.getAll('bedroom'); 
    bedroomParams = bedroomParams.filter(b => b !== 'Nothing selected');
    let furnishingParams = params.getAll('furnishing'); 
    furnishingParams = furnishingParams.filter(f => f !== 'Nothing selected');
    
    const minPrice = params.get('minPrice') ? parseInt(params.get('minPrice')) : null;
    const maxPrice = params.get('maxPrice') ? parseInt(params.get('maxPrice')) : null;
    
    let isSearch = query || propertyType || category || city || locationParams.length || bedroomParams.length || furnishingParams.length || minPrice || maxPrice;
    
    if (isSearch) {
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
            
            const priceEl = box.querySelector('.price');
            let priceVal = 0;
            if (priceEl) {
                let textVal = priceEl.textContent.toLowerCase();
                // extract number, allowing decimals
                let numStr = textVal.replace(/[^0-9\\.]/g, '');
                if (numStr) {
                    priceVal = parseFloat(numStr);
                    // Handle Lacs and Cr which are common in Indian Real Estate
                    if (textVal.includes('lac') || textVal.includes('lakh')) {
                        priceVal *= 100000;
                    } else if (textVal.includes('cr')) {
                        priceVal *= 10000000;
                    }
                }
            }
            
            let isMatch = true;
            
            if (query && !title.includes(query.toLowerCase()) && !locText.includes(query.toLowerCase())) {
                isMatch = false;
            }
            
            if (propertyType && propertyType !== 'Nothing selected') {
                if (propertyType === 'Sale' && !textContent.includes('sale') && !textContent.includes('buy')) isMatch = false;
                if (propertyType === 'Rent' && !textContent.includes('rent')) isMatch = false;
                if (propertyType === 'Lease' && !textContent.includes('lease')) isMatch = false;
            }
            
            if (category) {
                const cat = category.toLowerCase().trim();
                let catMatch = false;
                if (textContent.includes(cat)) catMatch = true;
                if (cat.includes('residential') && (textContent.includes('bhk') || textContent.includes('flat') || textContent.includes('apartment') || textContent.includes('villa'))) catMatch = true;
                if (cat.includes('commercial') && (textContent.includes('shop') || textContent.includes('office') || textContent.includes('space') || textContent.includes('showroom'))) catMatch = true;
                if (cat.includes('banglow') && (textContent.includes('banglow') || textContent.includes('bungalow') || textContent.includes('villa'))) catMatch = true;
                if (cat.includes('plot') && (textContent.includes('plot') || textContent.includes('land'))) catMatch = true;
                if (!catMatch) isMatch = false;
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
                    if (textContent.includes(b + ' bedroom') || textContent.includes(b + 'bhk') || textContent.includes(b + ' bhk')) bedMatch = true;
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
        
        const row = document.querySelector('.property-box').closest('.row');
        if (row) {
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
    
    new_content = content[:start] + new_script
    with open(prop_all, "w", encoding="utf-8") as f:
        f.write(new_content)
        
    print("Patched properties_all.html with better search script")

if __name__ == "__main__":
    patch_script()
