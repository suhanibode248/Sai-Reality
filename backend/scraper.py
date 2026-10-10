import requests
from bs4 import BeautifulSoup, SoupStrainer
import json
import os
import re
import threading
import time
from concurrent.futures import Future, ThreadPoolExecutor

class DjangoLiveScraper:
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.s = requests.Session()
        self.base_url = 'https://certifiedproperties.in'
        self.login_lock = threading.Lock()
        self.login()

    def login(self):
        login_url = f'{self.base_url}/dashboard/user-login/?next=/dashboard/leads/all/'
        r = self.s.get(login_url)
        soup = BeautifulSoup(r.text, 'html.parser')
        csrf_input = soup.find('input', {'name': 'csrfmiddlewaretoken'})
        if not csrf_input:
            raise Exception("Could not find CSRF token on login page")
        csrf = csrf_input['value']

        payload = {
            'csrfmiddlewaretoken': csrf,
            'username': self.username,
            'password': self.password,
            'next': '/dashboard/leads/all/'
        }
        r_post = self.s.post(f'{self.base_url}/dashboard/user-login/', data=payload, headers={'Referer': login_url})
        if 'Sign In to continue' in r_post.text:
            raise Exception("Login failed!")

    # Leads tab slugs used by the live site (/dashboard/leads/<slug>/)
    LEAD_TABS = {
        'all': 'all',
        'new': 'new-leads',
        'followups': 'in-followup',
        'siteVisits': 'site-visit',
        'svCompleted': 'sv-completed',
        'bookingInprogress': 'bookings-inprogrss',
        'bookings': 'bookings',
        'pending': 'pending',
        'todayPending': 'pending',
        'dead': 'dead-leads',
        'duplicate': 'duplicate',
    }

    # Tab label on the live site -> key used by the frontend
    TAB_LABELS = {
        'All Leads': 'all', 'New': 'new', 'In Followups': 'followups',
        'Sites Visits': 'siteVisits', 'SV Completed': 'svCompleted',
        'Booking Inprogress': 'bookingInprogress', "Bookings/ EOI's": 'bookings',
        'Pending Leads': 'pending', 'Today Pending Leads': 'todayPending',
        'Dead Leads': 'dead', 'Duplicate': 'duplicate',
    }

    # Velzon theme colours for the badge classes the live site uses
    BADGE_COLORS = {
        'btn-primary': '#405189', 'btn-secondary': '#3577f1', 'btn-success': '#0ab39c',
        'btn-info': '#299cdb', 'btn-warning': '#f7b84b', 'btn-danger': '#f06548',
        'btn-dark': '#212529', 'btn-light': '#f3f6f9',
    }

    def _is_login_page(self, r):
        return 'user-login' in r.url or 'Sign In to continue' in r.text

    def _request(self, method, url, **kwargs):
        # Log in again if the live session has expired, then retry once
        r = self.s.request(method, url, **kwargs)
        if self._is_login_page(r):
            with self.login_lock:
                self.login()
            r = self.s.request(method, url, **kwargs)
        return r

    def _csrf(self):
        if not self.s.cookies.get('csrftoken'):
            self._request('GET', f'{self.base_url}/dashboard/leads/all/')
        return self.s.cookies.get('csrftoken', '')

    def _parse_rows(self, rows):
        leads_list = []
        for row in rows:
            tds = row.find_all('td')
            if len(tds) < 10: continue
            try:
                id_str = tds[0].get_text(strip=True)
                a_tag = tds[0].find('a')
                detail_url = self.base_url + a_tag['href'] if a_tag else None

                name_cell = tds[1]
                name_a = name_cell.find('strong')
                name = name_a.get_text(strip=True) if name_a else name_cell.get_text(strip=True).split('\n')[0]

                date_span = name_cell.find('span', class_='text-muted')
                created_date = date_span.get_text(strip=True).replace('Created Date:', '').strip() if date_span else ''

                phone_cell = tds[2]
                phone_a = phone_cell.find('a', href=re.compile(r'tel:'))
                phone = phone_a['href'].replace('tel:', '') if phone_a else phone_cell.get_text(strip=True)

                status_cell = tds[3]
                status_span = status_cell.find('span', class_='badge')
                status = status_span.get_text(strip=True) if status_span else 'NEW LEAD'
                status_color = self.BADGE_COLORS['btn-info']
                if status_span:
                    bg = re.search(r'background-color:\s*([^;]+)', status_span.get('style', ''))
                    if bg:
                        status_color = bg.group(1).strip()
                    else:
                        for cls in status_span.get('class', []):
                            if cls in self.BADGE_COLORS:
                                status_color = self.BADGE_COLORS[cls]
                sdate_span = status_cell.find('span', class_='text-muted')
                sdate_full = ' '.join(sdate_span.get_text().split()) if sdate_span else ''
                label_match = re.match(r'(.*?)\s*Date:\s*(.*)', sdate_full)
                status_label = label_match.group(1) if label_match else ''
                sdate = label_match.group(2) if label_match else sdate_full

                budget = tds[4].get_text(strip=True)
                intent = tds[5].get_text(strip=True)

                note_cell = tds[6]
                read_more = note_cell.find('a', attrs={'data-bs-content': True})
                full_note = ' '.join(read_more['data-bs-content'].split()) if read_more else ''
                for a in note_cell.find_all('a'): a.decompose()
                note = note_cell.get_text(strip=True)

                lookingFor = tds[7].get_text(strip=True)
                source = tds[8].get_text(strip=True)

                # The live "Assigned To" select lists the users on this lead; the first one is shown
                assigned_select = tds[9].find('select')
                assigned_options = [o.get_text(strip=True) for o in assigned_select.find_all('option')] if assigned_select else []
                assigned_options = [o for o in assigned_options if o]
                assigned = assigned_options[0].split('_')[0] if assigned_options else 'Admin'

                # "See Followups" dropdown entries, e.g. "londheharsh074_9 -> Oct. 13, 2024, 6:07 p.m."
                followups = [' '.join(a.get_text().split()) for a in tds[10].find_all('a')] if len(tds) > 10 else []

                pk_match = re.search(r'/lead-details/(\d+)/', detail_url or '')

                leads_list.append({
                    'id': id_str, 'pk': pk_match.group(1) if pk_match else id_str,
                    'name': name, 'createdDate': created_date, 'phone': phone,
                    'status': status.upper(), 'statusLabel': status_label, 'statusColor': status_color,
                    'statusDate': sdate, 'budget': budget,
                    'intent': intent.upper(), 'note': note, 'fullNote': full_note or note,
                    'lookingFor': lookingFor, 'source': source,
                    'assignedTo': assigned, 'assignedOptions': assigned_options,
                    'followups': followups,
                    'detail_url': detail_url
                })
            except Exception as e:
                pass
        return leads_list

    def get_leads(self, page=1, tab='all'):
        slug = self.LEAD_TABS.get(tab, 'all')
        r = self._request('GET', f'{self.base_url}/dashboard/leads/{slug}/', params={'page': page})
        soup = BeautifulSoup(r.text, 'html.parser')

        tbody = soup.find('tbody', class_='list form-check-all')
        leads_list = self._parse_rows(tbody.find_all('tr')) if tbody else []

        # Tab counts, e.g. "All Leads 14863"
        counts = {}
        for a in soup.select('a.nav-link'):
            href = a.get('href') or ''
            if not href.startswith('/dashboard/leads/'): continue
            badge = a.find('span')
            num = badge.get_text(strip=True) if badge else ''
            label = a.get_text(' ', strip=True)
            if num: label = label[:label.rfind(num)].strip()
            key = self.TAB_LABELS.get(label)
            if key and num.isdigit():
                counts[key] = int(num)

        total = self._available_leads(soup)
        last_page = max(1, -(-total // 20)) if total else max(1, page)

        return {
            'leads': leads_list, 'counts': counts, 'total': total,
            'lastPage': last_page, **self._page_extras(soup),
        }

    def _available_leads(self, soup):
        # "Available Leads 14863"
        avail = soup.find(string=re.compile(r'Available Leads'))
        m = re.search(r'(\d+)', avail) if avail else None
        return int(m.group(1)) if m else 0

    def _page_extras(self, soup):
        # Follow-up reminder line under the page title, e.g. "15349 2"
        followup_info = ''
        ids_h4 = soup.find('h4', string=re.compile('this is ids section'))
        if ids_h4 and ids_h4.next_sibling and isinstance(ids_h4.next_sibling, str):
            followup_info = ' '.join(ids_h4.next_sibling.split())

        # Count on the notification bell
        bell_count = 0
        bell = soup.find('a', class_='notification')
        bell_badge = bell.find('span', class_='badge') if bell else None
        if bell_badge and bell_badge.get_text(strip=True).isdigit():
            bell_count = int(bell_badge.get_text(strip=True))

        # Follow-up reminder popup the live site opens on page load
        followup_popup = None
        modal = soup.find(id='followupModal')
        if modal:
            titles = [' '.join(h.get_text().split()) for h in modal.select('.modal-header h5')]
            def after(prefix):
                for t in titles:
                    if prefix in t: return t.split(prefix, 1)[1].strip()
                return ''
            fields = {}
            for strong in modal.select('.modal-body strong'):
                label = strong.get_text(strip=True).rstrip(':')
                value = ' '.join(strong.parent.get_text().split())
                fields[label] = value[len(strong.get_text(strip=True)):].strip()
            call_btn = modal.find(id='callButton')
            count = after('Count:')
            followup_popup = {
                'id': after('ID:'), 'followupBy': after('FollowupBy:'),
                'count': int(count) if count.isdigit() else 0,
                'name': fields.get('Name', ''), 'lookingFor': fields.get('Looking For', ''),
                'nextFollowup': fields.get('Next Follow-Up Date', ''),
                'comment': fields.get('Comment', ''), 'status': fields.get('Status', ''),
                'intent': fields.get('Intent', ''),
                'phone': call_btn.get('data-phone', '') if call_btn else '',
            }
            if not followup_popup['id'] or followup_popup['count'] <= 0:
                followup_popup = None

        return {'followupInfo': followup_info, 'bellCount': bell_count, 'followupPopup': followup_popup}

    def search_leads(self, query):
        # The live search box posts to /dashboard/search_lead/ and gets table rows back
        r = self._request(
            'POST', f'{self.base_url}/dashboard/search_lead/',
            data={'search_query': query},
            headers={'X-CSRFToken': self._csrf(), 'HX-Request': 'true',
                     'Referer': f'{self.base_url}/dashboard/leads/all/'},
        )
        soup = BeautifulSoup(f'<table><tbody>{r.text}</tbody></table>', 'lxml')
        return self._parse_rows(soup.find_all('tr'))

    def apply_filter(self, form_items):
        # Same form as the live "Apply Leads Filter" panel; the live site returns every match on one page
        r = self._request(
            'POST', f'{self.base_url}/dashboard/apply-leads-filter/',
            data=[('csrfmiddlewaretoken', self._csrf())] + list(form_items),
            headers={'Referer': f'{self.base_url}/dashboard/leads/all/'},
        )
        # Filter pages can be 10+ MB, so only parse the leads table, with the faster lxml parser
        table_only = SoupStrainer('tbody', class_='list form-check-all')
        soup = BeautifulSoup(r.text, 'lxml', parse_only=table_only)
        leads_list = self._parse_rows(soup.find_all('tr'))
        m = re.search(r'Available Leads\s*(\d+)', r.text)
        return {'leads': leads_list, 'total': int(m.group(1)) if m else len(leads_list)}

    def download_csv(self, form_items):
        # Same form as the live "Filter Leads Report" panel; returns the CSV the live site generates
        r = self._request(
            'POST', f'{self.base_url}/dashboard/get-leads-csv/',
            data=[('csrfmiddlewaretoken', self._csrf())] + list(form_items),
            headers={'Referer': f'{self.base_url}/dashboard/leads/all/'},
        )
        if 'text/csv' not in r.headers.get('Content-Type', ''):
            raise Exception(f'Live CRM did not return a CSV file (HTTP {r.status_code})')
        m = re.search(r'filename="?([^";]+)', r.headers.get('Content-Disposition', ''))
        return r.content, (m.group(1) if m else 'leads-data.csv')

    def get_notifications(self, period='', staff='', from_date='', to_date=''):
        url = f'{self.base_url}/dashboard/notification_details/'
        if period:
            r = self._request('POST', url, data={
                'csrfmiddlewaretoken': self._csrf(), 'period': period, 'staff': staff,
                'fromDate': from_date, 'toDate': to_date,
            }, headers={'Referer': url})
        else:
            r = self._request('GET', url)
        if r.status_code != 200:
            raise Exception(f'Live CRM returned an error for this notification filter (HTTP {r.status_code})')
        soup = BeautifulSoup(r.text, 'html.parser')
        rows = []
        table = soup.find('table')
        if table:
            headers = [th.get_text(strip=True) for th in table.find_all('th')]
            for tr in table.find_all('tr'):
                cells = [' '.join(td.get_text().split()) for td in tr.find_all('td')]
                if cells: rows.append(dict(zip(headers, cells)))
        form = soup.find('form', action='/dashboard/notification_details/')
        def options(name):
            sel = form.find('select', attrs={'name': name}) if form else None
            return [{'value': o.get('value', ''), 'label': o.get_text(strip=True)} for o in sel.find_all('option')] if sel else []
        return {'rows': rows, 'periodOptions': options('period'), 'staffOptions': options('staff')}

    def _media_url(self, src):
        # The live site uses "/media/" for properties without a photo
        if not src or src.rstrip('/') == '/media':
            return ''
        return src if src.startswith('http') else self.base_url + src

    def get_properties(self):
        # The live Properties page lists every property as a card on a single page
        r = self._request('GET', f'{self.base_url}/dashboard/properties/')
        soup = BeautifulSoup(r.text, 'lxml')

        properties = []
        for card in soup.find_all('div', class_='project-card'):
            link = card.find('a', href=re.compile(r'/dashboard/property-details/\d+/'))
            if not link: continue
            pid = re.search(r'/property-details/(\d+)/', link['href']).group(1)
            ribbon = card.find(class_='ribbon-two')
            img = card.find('img')
            views = card.find('i', class_='mdi-eye')
            title_h5 = link.find_parent('h5')
            address_p = title_h5.find_next_sibling('p') if title_h5 else None
            address = ' '.join(address_p.get_text().split()) if address_p else ''
            parts = [x.strip() for x in address.split(',')]

            # "Price", "Avl From" and "Created" are <p> labels followed by an <h5> value
            stats = {}
            for p in card.find_all('p', class_='text-muted'):
                h5 = p.find_next_sibling('h5')
                if h5: stats[p.get_text(strip=True)] = ' '.join(h5.get_text().split())
            def stat(label):
                return next((v for k, v in stats.items() if k.startswith(label)), '')

            price = stat('Price')
            price_num = re.sub(r'[^\d.]', '', price.split('/')[0])
            phone = card.find('a', href=re.compile(r'^tel:'))
            footer_right = card.find('div', class_='flex-shrink-0')
            badge = footer_right.find(class_='badge') if footer_right else None
            properties.append({
                'id': pid,
                'title': ' '.join(link.get_text().split()),
                'type': ' '.join(ribbon.get_text().split()) if ribbon else '',
                'image': self._media_url(img.get('src') if img else ''),
                'views': ' '.join(views.parent.get_text().split()) if views else '',
                'address': address,
                'location': parts[-3] if len(parts) >= 3 else '',
                'city': parts[-2] if len(parts) >= 2 else '',
                'price': price,
                'priceValue': float(price_num) if price_num else None,
                'availableFrom': stat('Avl From'),
                'created': stat('Created'),
                'phone': phone['href'][4:] if phone else '',
                'status': ' '.join(badge.get_text().split()) if badge else '',
            })

        # Options of the live search form (Property Type, Category, City, Location, Bedroom)
        filter_options = {}
        for name in ['propertyType', 'category', 'city', 'location', 'bedroom']:
            sel = soup.find('select', attrs={'name': name})
            if sel:
                filter_options[name] = [o.get('value', '').strip() for o in sel.find_all('option') if o.get('value', '').strip()]
        return {'properties': properties, 'filterOptions': filter_options}

    def get_property_details(self, pid):
        r = self._request('GET', f'{self.base_url}/dashboard/property-details/{pid}/x/?redirectUrl=/dashboard/properties/')
        soup = BeautifulSoup(r.text, 'lxml')
        content = soup.find(class_='page-content') or soup
        main = content.find(class_='col-xl-8') or content

        def text(el):
            return ' '.join(el.get_text().split()) if el else ''

        def labelled(label):
            # "<p>Price :</p><h5>₹ 27000</h5>"
            p = next((x for x in main.find_all('p') if text(x).startswith(label)), None)
            return text(p.find_next_sibling('h5')) if p else ''

        def section(heading):
            h5 = next((x for x in main.find_all('h5') if text(x).startswith(heading)), None)
            return h5

        def span_after(label):
            div = next((x for x in main.find_all('div') if text(x).startswith(label) and x.find('span')), None)
            return text(div.find('span')) if div else ''

        category_type = text(main.find('a', href='#'))
        category, _, ptype = category_type.partition(' - ')
        address_icon = main.find('span', class_='mdi-google-maps')
        address_div = address_icon.find_parent('div').find_next_sibling('div') if address_icon else None

        desc_h5 = section('Description')
        features = {}
        features_h5 = section('Features')
        if features_h5 and features_h5.find_next_sibling('ul'):
            for li in features_h5.find_next_sibling('ul').find_all('li'):
                key, _, value = text(li).partition(':')
                features[key.strip()] = value.strip()
        amenities_h5 = section('Amenities')
        amenities = [text(li) for li in amenities_h5.find_next_sibling('ul').find_all('li')] if amenities_h5 and amenities_h5.find_next_sibling('ul') else []

        seller_info = {}
        for tr in main.select('#nav-speci tr'):
            th, td = tr.find('th'), tr.find('td')
            if th: seller_info[text(th)] = text(td)
        meta = {}
        meta_tab = main.find(id='nav-detail')
        if meta_tab:
            for h5 in meta_tab.find_all('h5'):
                value = text(h5.find_next_sibling('p'))
                meta[text(h5)] = '' if value == '-' else value

        gallery = content.find(class_='col-xl-4') or content
        images = []
        for img in gallery.find_all('img'):
            url = self._media_url(img.get('src'))
            if url and url not in images:
                images.append(url)

        bedroom = labelled('Bedroom')
        return {
            'id': str(pid),
            'title': text(main.find('h4')),
            'category': category.strip(),
            'type': ptype.strip(),
            'seller': span_after('Seller'),
            'published': span_after('Published'),
            'address': text(address_div),
            'price': labelled('Price'),
            'area': labelled('Area'),
            'bedroom': bedroom,
            'bedroomKey': f'{bedroom}BHK' if bedroom.isdigit() else '',
            'bathroom': labelled('Bathroom'),
            'description': text(desc_h5.find_next_sibling('p')) if desc_h5 else '',
            'features': features,
            'amenities': amenities,
            'sellerInfo': seller_info,
            'meta': meta,
            'images': images,
        }

    # Live links that change data just by being opened; the local dashboard never follows them
    WRITE_PATH = re.compile(r'/(delete|remove|change-|update|toggle|approve|reject|user-logout|logout|send-|save_|users_access)', re.I)
    # Live links that download a file (CSV exports, documents)
    FILE_PATH = re.compile(r'/(get-[\w-]*csv|download-)', re.I)
    # Inline scripts / handlers that would talk to the live server are not run locally
    UNSAFE_SCRIPT = re.compile(r'ajax|fetch\(|XMLHttpRequest|\.submit\(|location\.|document\.write|htmx|\$\.(post|get)|topFunction', re.I)

    def get_page(self, path):
        """Fetch any live dashboard page (read-only) and return its main content for the local dashboard."""
        if self.WRITE_PATH.search(path) or self.FILE_PATH.search(path):
            raise Exception('This live link changes data or downloads a file, so it is not opened here')
        return self._render_page(self._request('GET', self.base_url + path), path)

    def _render_page(self, r, path):
        final_path = r.url[len(self.base_url):] if r.url.startswith(self.base_url) else path
        soup = BeautifulSoup(r.text, 'lxml')
        content = soup.find(class_='page-content') or soup.find(class_='main-content') or soup.body or soup
        # The local dashboard has its own sidebar, top bar and footer
        for chrome in content.select('#page-topbar, .app-menu, .navbar-menu, .vertical-overlay, footer, .customizer-setting, #back-to-top'):
            chrome.decompose()
        # Page helper scripts (charts, date pickers, quick search) that only work in the browser
        scripts = [x.get_text() for x in soup.find_all('script', src=False)
                   if x.get_text().strip() and not self.UNSAFE_SCRIPT.search(x.get_text()) and 'gtag(' not in x.get_text()]
        # Modals / offcanvas panels that live outside the page content
        extras = [m for m in soup.select('.modal, .offcanvas') if not m.find_parent(class_='page-content')]
        parts = [content] + extras
        for part in parts:
            for tag in part.find_all(['script', 'noscript']):
                tag.decompose()
            for tag in part.find_all(True):
                for attr in list(tag.attrs):
                    if attr.lower().startswith('on') and self.UNSAFE_SCRIPT.search(str(tag[attr])):
                        del tag[attr]
                    elif attr.lower().startswith('hx-'):
                        del tag[attr]
                # Counters are animated up to data-target by a live-site script; show the final number
                if 'counter-value' in (tag.get('class') or []) and tag.get('data-target') is not None:
                    tag.string = tag['data-target']
                for attr in ('src', 'href', 'poster', 'data-src'):
                    value = tag.get(attr)
                    if isinstance(value, str) and value.startswith(('/media/', '/static/')):
                        tag[attr] = self.base_url + value
        return {
            'html': ''.join(str(part) for part in parts),
            'scripts': scripts,
            'title': ' '.join(soup.title.get_text().split()) if soup.title else '',
            'path': final_path,
        }

    def submit_form(self, path, data, files):
        """Submit a live dashboard form (approved by the user: saves go to the live CRM). Returns the resulting page."""
        form = [(k, v) for k, v in data if k != 'csrfmiddlewaretoken'] + [('csrfmiddlewaretoken', self._csrf())]
        r = self._request('POST', self.base_url + path, data=form, files=files or None,
                          headers={'Referer': self.base_url + path})
        if r.status_code >= 400 or 'text/html' not in r.headers.get('Content-Type', ''):
            return {'status': r.status_code}
        # Show whatever page the live CRM answers with (filter results, or the page it redirects to)
        return {'status': r.status_code, **self._render_page(r, path)}

    def get_file(self, path):
        """Download a live export (CSV, document) that the live dashboard links to."""
        if not self.FILE_PATH.search(path):
            raise Exception('Not a download link')
        r = self._request('GET', self.base_url + path)
        if 'text/html' in r.headers.get('Content-Type', ''):
            raise Exception('The live CRM did not return a file')
        return r.content, r.headers.get('Content-Type', 'application/octet-stream'), r.headers.get('Content-Disposition', 'attachment')

    def get_lead_details(self, lead_id):
        detail_url = f'{self.base_url}/dashboard/lead-details/{lead_id}/?redirectUrl=/dashboard/leads/all/'
        r = self._request('GET', detail_url)
        s_det = BeautifulSoup(r.text, 'html.parser')
        
        email = '-'
        alt_phone = '-'
        location = '-'
        
        customer_details = {
            'purpose': '-', 'propertyType': '-', 'configurationsType': '-',
            'area': '-', 'fundingSource': '-', 'employmentType': '-',
            'facing': '-', 'age': '-', 'referredBy': '-',
            'gender': '-', 'annualIncome': '-'
        }
        text_details = s_det.find('div', id='textDetails')
        if text_details:
            for block in text_details.find_all('div', class_='flex-grow-1'):
                p = block.find('p')
                h6 = block.find('h6')
                if p and h6:
                    label = p.get_text(strip=True).replace(':', '').strip().lower()
                    val = h6.get_text(strip=True)
                    if val == '': val = '-'
                    if 'purpose' in label: customer_details['purpose'] = val
                    elif 'property type' in label: customer_details['propertyType'] = val
                    elif 'configrations' in label or 'configurations' in label: customer_details['configurationsType'] = val
                    elif 'area' in label: customer_details['area'] = val
                    elif 'funding' in label: customer_details['fundingSource'] = val
                    elif 'employment' in label: customer_details['employmentType'] = val
                    elif 'facing' in label: customer_details['facing'] = val
                    elif 'age' in label: customer_details['age'] = val
                    elif 'referred' in label: customer_details['referredBy'] = val
                    elif 'gender' in label: customer_details['gender'] = val
                    elif 'annual' in label or 'income' in label: customer_details['annualIncome'] = val
        
        activities = []
        timeline_div = s_det.find('div', class_='profile-timeline')
        if timeline_div:
            for acc in timeline_div.find_all('div', class_='accordion-item'):
                title_div = acc.find('h5')
                title = title_div.get_text(strip=True) if title_div else 'Activity'
                small_text = acc.find('p', class_='text-muted')
                subtitle = small_text.get_text(strip=True) if small_text else ''
                
                body = acc.find('div', class_='accordion-body')
                desc = ''
                if body:
                    desc_ps = body.find_all('p')
                    desc = ' | '.join([p.get_text(" ", strip=True) for p in desc_ps])
                
                activities.append({
                    'title': title,
                    'subtitle': subtitle,
                    'desc': desc
                })
        
        return {
            'customerDetails': customer_details,
            'activities': activities
        }

scraper_instance = None
def get_scraper():
    global scraper_instance
    if scraper_instance is None:
        scraper_instance = DjangoLiveScraper('admin@email.com', 'Cap%65h@3412^')
    return scraper_instance

# Create the shared scraper only once, even when several requests arrive together
_scraper_lock = threading.Lock()
_create_scraper = get_scraper
def get_scraper():
    with _scraper_lock:
        return _create_scraper()


class LiveCache:
    """Keeps recently fetched live pages so the dashboard doesn't wait on the live site every time."""
    FRESH_SECONDS = 60    # served as-is
    STALE_SECONDS = 600   # served instantly, then refreshed in the background

    def __init__(self, loader):
        self.loader = loader  # key -> result
        self.lock = threading.Lock()
        self.entries = {}   # key -> (fetched_at, result)
        self.inflight = {}  # key -> Future shared by everyone waiting on that key
        self.background = ThreadPoolExecutor(max_workers=2)

    def _load(self, key, fut):
        try:
            result = self.loader(key)
            with self.lock:
                self.entries[key] = (time.time(), result)
            fut.set_result(result)
        except Exception as e:
            fut.set_exception(e)
        finally:
            with self.lock:
                self.inflight.pop(key, None)

    def _start(self, key, in_background):
        # Returns the Future for this key and whether the caller has to run the fetch itself
        with self.lock:
            fut = self.inflight.get(key)
            if fut is not None:
                return fut, False
            fut = Future()
            self.inflight[key] = fut
        if in_background:
            self.background.submit(self._load, key, fut)
            return fut, False
        return fut, True

    def _cached(self, key):
        with self.lock:
            entry = self.entries.get(key)
        return (time.time() - entry[0], entry[1]) if entry else (None, None)

    def get(self, key, force=False):
        age, result = self._cached(key)
        if result is not None and not force and age < self.STALE_SECONDS:
            if age > self.FRESH_SECONDS:
                self._start(key, in_background=True)
            return result
        fut, run_here = self._start(key, in_background=False)
        if run_here:
            self._load(key, fut)
        return fut.result()

    def prefetch(self, key):
        age, _ = self._cached(key)
        if age is None or age > self.FRESH_SECONDS:
            self._start(key, in_background=True)


class LeadsCache(LiveCache):
    TABS = ['all', 'new', 'followups', 'siteVisits', 'svCompleted', 'bookingInprogress',
            'bookings', 'pending', 'dead', 'duplicate']

    def __init__(self):
        # Several tabs can share one live page (e.g. both "pending" tabs), so pages are keyed by slug
        self.tab_for_slug = {DjangoLiveScraper.LEAD_TABS[t]: t for t in self.TABS}
        super().__init__(lambda key: get_scraper().get_leads(page=key[1], tab=self.tab_for_slug[key[0]]))

    def _key(self, tab, page):
        return (DjangoLiveScraper.LEAD_TABS.get(tab, 'all'), page)

    def get_page(self, tab, page, force=False):
        result = self.get(self._key(tab, page), force=force)
        # Warm the next page so "Next" opens instantly
        if page < result['lastPage']:
            self.prefetch(self._key(tab, page + 1))
        return result

    def warm(self):
        # Load page 1 of every tab (and page 2 of All Leads) so the first clicks are instant
        for tab in self.TABS:
            self.prefetch(self._key(tab, 1))
        self.prefetch(self._key('all', 2))


class PropertyDetailsStore:
    """Keeps every property's detail page so the list can be filtered by category, bedrooms, etc.

    The live list page doesn't show those fields, so they are read from each property's detail page
    in the background and saved to disk, so a backend restart doesn't have to read them all again.
    """
    REFRESH_SECONDS = 6 * 3600

    def __init__(self, path):
        self.path = path
        self.lock = threading.Lock()
        self.save_lock = threading.Lock()
        self.details = {}   # property id -> {'fetchedAt': ..., 'data': {...}}
        self.queued = set()
        self.background = ThreadPoolExecutor(max_workers=3)
        try:
            with open(path, encoding='utf-8') as f:
                self.details = json.load(f)
        except (OSError, ValueError):
            pass

    def _save(self):
        with self.save_lock:
            with self.lock:
                snapshot = json.dumps(self.details, ensure_ascii=False)
            os.makedirs(os.path.dirname(self.path), exist_ok=True)
            tmp = self.path + '.tmp'
            with open(tmp, 'w', encoding='utf-8') as f:
                f.write(snapshot)
            os.replace(tmp, self.path)

    def _fetch(self, pid):
        data = get_scraper().get_property_details(pid)
        with self.lock:
            self.details[pid] = {'fetchedAt': time.time(), 'data': data}
            self.queued.discard(pid)
            pending = len(self.queued)
        # Save every 25 properties and when the queue is empty
        if pending % 25 == 0:
            self._save()
        return data

    def _fetch_quietly(self, pid):
        try:
            self._fetch(pid)
        except Exception:
            with self.lock:
                self.queued.discard(pid)

    def get(self, pid, force=False):
        with self.lock:
            entry = self.details.get(pid)
        if entry and not force:
            return entry['data']
        return self._fetch(pid)

    def known(self, pid):
        with self.lock:
            entry = self.details.get(pid)
        return entry['data'] if entry else None

    def ensure(self, pids):
        # Queue missing (or old) detail pages; returns how many are already known
        now = time.time()
        known = 0
        with self.lock:
            for pid in pids:
                entry = self.details.get(pid)
                if entry: known += 1
                if (not entry or now - entry['fetchedAt'] > self.REFRESH_SECONDS) and pid not in self.queued:
                    self.queued.add(pid)
                    self.background.submit(self._fetch_quietly, pid)
        return known


leads_cache = LeadsCache()
properties_cache = LiveCache(lambda key: get_scraper().get_properties())
pages_cache = LiveCache(lambda path: get_scraper().get_page(path))

# Live dashboard pages shown as-is inside the local dashboard (pre-loaded on startup)
LIVE_PAGES = [
    '/dashboard/', '/dashboard/projects/', '/dashboard/daily-report/', '/dashboard/finance-overview/',
    '/dashboard/transaction/all/', '/dashboard/transaction/income/', '/dashboard/transaction/expenses/',
    '/dashboard/my-account', '/dashboard/users', '/dashboard/user-attendance', '/dashboard/jobs', '/dashboard/job-applications',
    '/dashboard/media-gallery', '/dashboard/website-slider', '/dashboard/website-offer', '/dashboard/reviews',
    '/dashboard/contact', '/dashboard/users-sequence', '/dashboard/gcode', '/dashboard/faq',
]
property_details = PropertyDetailsStore(os.path.join(os.path.dirname(os.path.abspath(__file__)), '.cache', 'property_details.json'))


def warm_live_data():
    # Called on backend startup: pre-load leads pages, the properties list and every property's details
    leads_cache.warm()
    for path in LIVE_PAGES:
        pages_cache.prefetch(path)

    def warm_properties():
        try:
            result = properties_cache.get('all')
            property_details.ensure([p['id'] for p in result['properties']])
        except Exception:
            pass
    threading.Thread(target=warm_properties, daemon=True).start()
