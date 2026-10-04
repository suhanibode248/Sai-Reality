import os
from pathlib import Path

def patch_script_v2():
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
    
    let minPrice = params.get('minPrice') ? parseInt(params.get('minPrice')) : null;
    let maxPrice = params.get('maxPrice') ? parseInt(params.get('maxPrice')) : null;
    
    // Auto-correct prices if user selected Buy/Sale but entered low rent-like numbers (e.g. 45000 -> 4500000)
    if (propertyType === 'Sale') {
        if (minPrice && minPrice >= 1000 && minPrice <= 99999) minPrice *= 100;
        if (maxPrice && maxPrice >= 1000 && maxPrice <= 99999) maxPrice *= 100;
        if (minPrice && minPrice > 0 && minPrice <= 999) minPrice *= 100000;
        if (maxPrice && maxPrice > 0 && maxPrice <= 999) maxPrice *= 100000;
    }
    
    let isSearch = query || propertyType || category || city || locationParams.length || bedroomParams.length || furnishingParams.length || minPrice || maxPrice;
    
    if (isSearch) {
        if (query) {
            const inputs = document.querySelectorAll('input[name="query"]');
            inputs.forEach(input => input.value = query);
        }
        
        const boxes = document.querySelectorAll('.property-box');
        
        function runSearch(ignorePrice = false, ignoreCategory = false) {
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
                    let numStr = textVal.replace(/[^0-9\\.]/g, '');
                    if (numStr) {
                        priceVal = parseFloat(numStr);
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
                
                if (propertyType && propertyType !== 'Nothing selected' && !ignoreCategory) {
                    if (propertyType === 'Sale' && !textContent.includes('sale') && !textContent.includes('buy')) isMatch = false;
                    if (propertyType === 'Rent' && !textContent.includes('rent')) isMatch = false;
                    if (propertyType === 'Lease' && !textContent.includes('lease')) isMatch = false;
                }
                
                if (category && !ignoreCategory) {
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
                
                if (!ignorePrice) {
                    if (minPrice && priceVal > 0 && priceVal < minPrice) isMatch = false;
                    if (maxPrice && priceVal > 0 && priceVal > maxPrice) isMatch = false;
                }
                
                if (isMatch) {
                    container.style.display = 'block';
                    matchCount++;
                } else {
                    container.style.display = 'none';
                }
            });
            return matchCount;
        }
        
        let matchCount = runSearch(false, false); // Strict search
        let fallbackLevel = 0;
        
        // Fallback 1: Ignore Prices
        if (matchCount === 0 && (minPrice || maxPrice)) {
            matchCount = runSearch(true, false);
            fallbackLevel = 1;
        }
        
        // Fallback 2: Ignore Category & Property Type & Prices
        if (matchCount === 0) {
            matchCount = runSearch(true, true);
            fallbackLevel = 2;
        }
        
        const row = document.querySelector('.property-box').closest('.row');
        if (row) {
            const oldMsg = row.querySelector('.no-results-msg');
            if (oldMsg) oldMsg.remove();
            
            if (matchCount === 0) {
                const noRes = document.createElement('div');
                noRes.className = 'col-12 text-center my-5 no-results-msg';
                noRes.innerHTML = `<h3>No properties found matching your criteria.</h3><a href="/properties_all.html" class="btn btn-primary mt-3">Clear Search</a>`;
                row.appendChild(noRes);
            } else if (fallbackLevel > 0) {
                const msg = document.createElement('div');
                msg.className = 'col-12 text-center my-3 no-results-msg';
                let reason = fallbackLevel === 1 ? "price range" : "exact category";
                msg.innerHTML = `<h5 class="text-warning">We couldn't find an exact match for your ${reason}, but here are some great properties in your location!</h5>`;
                row.prepend(msg);
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
        
    print("Patched properties_all.html with gracefull fallback script")

if __name__ == "__main__":
    patch_script_v2()
