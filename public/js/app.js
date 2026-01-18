const API_URL = 'http://localhost:3000/api';

/* LOGIKA HIDE ON SCROLL 
   ---------------------- */
let lastScrollTop = 0;
const navbar = document.getElementById('main-nav');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (Math.abs(lastScrollTop - scrollTop) <= 10) return;

    if (scrollTop > lastScrollTop && scrollTop > 50) {
        navbar.classList.add('nav-hidden');
    } else {
        navbar.classList.remove('nav-hidden');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
}, { passive: true });

/* INDEX 
   ---------------------- */
//tidak ada

/* STORY 
   ---------------------- */
const addBtn = document.getElementById('add-story-btn');
const formOverlay = document.getElementById('form-overlay');
const closeBtn = document.getElementById('close-btn');

/* --- INTEGRASI BACKEND STORY --- */

// 1. Load Data dari Server
async function loadStories() {
    try {
        const res = await fetch(`${API_URL}/confess`);
        const data = await res.json();
        const container = document.getElementById('stories-container');
        
        if(container) {
            container.innerHTML = ''; // Reset container
            const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-3'];
            
            data.forEach(item => {
                const randomRot = rotations[Math.floor(Math.random() * rotations.length)];
                const bgColor = item.color || '#FFF9C4'; 

                // inject html
                const html = `
                    <div class="memo p-6 shadow-md rounded-sm transition-transform hover:scale-105 ${randomRot} flex flex-col justify-between min-h-[200px]" style="background-color: ${bgColor};">
                        <div>
                            <small class="block text-black/40 font-bold mb-2 uppercase border-b border-black/10 pb-1">To: ${item.recipient}</small>
                            <p class="text-gray-800 font-serif text-lg">"${item.pesan}"</p>
                        </div>
                        <div class="text-right mt-4">
                            <span class="text-xs font-bold text-gray-500">- ${item.sender}</span>
                        </div>
                    </div>
                `;
                container.innerHTML += html;
            });
        }
    } catch (err) { console.error("Gagal load story:", err); }
}

// 2. Submit Story Baru
const storyForm = document.getElementById('story-form');
if(storyForm) {
    storyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Ambil data
        const sender = document.getElementById('inputSender').value;
        const recipient = document.getElementById('inputRecipient').value;
        const message = document.getElementById('inputMessage').value;
        const color = document.querySelector('input[name="color"]:checked')?.value || '#FFF9C4';

        await fetch(`${API_URL}/confess`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pesan: message, sender, recipient, color })
        });

        alert("Berhasil curhat!");
        e.target.reset();
        document.getElementById('form-overlay').classList.add('hidden'); // Tutup modal pakai ID temanmu
        loadStories(); // Refresh data
    });
}

loadStories();

if (addBtn && formOverlay) {
    addBtn.addEventListener('click', () => {
        formOverlay.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
        formOverlay.classList.add('hidden');
    });

    formOverlay.addEventListener('click', (e) => {
        if (e.target === formOverlay) formOverlay.classList.add('hidden');
    });
}

/* LOST & FOUND
   ---------------------- */
   //Filter
function filterItems(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    
    buttons.forEach(btn => {
        const btnText = btn.innerText.toLowerCase();

        if (btn.getAttribute('onclick').includes(`'${category}'`)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const cards = document.querySelectorAll('.item-card');
    cards.forEach(card => {
        const itemStatus = card.getAttribute('data-status'); 
        if (category === 'all') {
            card.style.display = 'flex';
        } else {
            if (itemStatus === category) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

//whatsapp
function formatWhatsApp(number) {
    if (!number) return '';
    let cleaned = number.toString().replace(/\D/g, '');
    if (cleaned.startsWith('0')) cleaned = '62' + cleaned.slice(1);
    return cleaned;
}

//Detail frontend
const detailModal = document.getElementById('detail-modal');
const closeDetail = document.getElementById('close-detail');

if (closeDetail) {
    closeDetail.addEventListener('click', () => detailModal.classList.add('hidden'));
}

detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) detailModal.classList.add('hidden');
});

/* --- SUBMIT FORM LOST & FOUND --- */
const itemForm = document.getElementById('item-form'); 

if(itemForm) {
    itemForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Siapkan FormData (karena ada upload foto)
        const formData = new FormData(itemForm);

        const typeTitle = document.getElementById('modal-form-title').innerText;
        // Map "Lost" -> "HILANG", "Found" -> "DITEMUKAN"
        const statusValue = (typeTitle === 'Lost') ? 'HILANG' : 'DITEMUKAN';
        
        formData.append('status', statusValue); 

        try {
            await fetch(`${API_URL}/items`, {
                method: 'POST',
                body: formData
            });

            alert("Postingan berhasil!");
            closeForm(); // Panggil fungsi tutup modal temanmu
            itemForm.reset(); // Kosongkan form
            loadItems(); // Refresh grid barang
        } catch (err) {
            console.error(err);
            alert("Gagal posting");
        }
    });
}

//Search
const searchInput = document.getElementById('search-input');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.item-card');

        cards.forEach(card => {
            const itemName = card.querySelector('p').innerText.toLowerCase();
            
            // Jika nama barang cocok dengan kata kunci, tampilkan. Jika tidak, sembunyikan.
            if (itemName.includes(keyword)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
}


//ADD button
const mainBtn = document.getElementById('fab-main-btn');
const fabMenu = document.getElementById('fab-menu');
const fabOverlay = document.getElementById('fab-overlay');
const fabIcon = document.getElementById('fab-icon');
const inputModal = document.getElementById('input-modal');
const mainNav = document.getElementById('main-nav');

function closeFab() {
    fabMenu.classList.remove('menu-visible');
    fabOverlay.classList.remove('overlay-visible');
    fabIcon.style.transform = 'rotate(0deg)';

    mainNav.style.filter = 'none'; 
}

mainBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = fabMenu.classList.contains('menu-visible');
    if (!isOpen) {
        fabMenu.classList.add('menu-visible');
        fabOverlay.classList.add('overlay-visible');
        fabIcon.style.transform = 'rotate(45deg)';

        mainNav.style.filter = 'blur(5px)'; 
    } else {
        closeFab();
    }
});

// Buka form 
function openForm(type) {
    mainNav.style.filter = 'none'; 

    closeFab(); 
    const title = document.getElementById('modal-form-title');
    const btn = document.getElementById('submit-btn');
    title.innerText = type;
    btn.style.backgroundColor = (type === 'Lost') ? '#f87171' : '#66BB6A';
    inputModal.classList.remove('hidden');
}

function closeForm() {
    inputModal.classList.add('hidden');
    mainNav.style.filter = 'none';
}

inputModal.addEventListener('click', (e) => {
    if (e.target === inputModal) closeForm();
});

fabOverlay?.addEventListener('click', closeFab);

/* --- INTEGRASI BACKEND LOST & FOUND --- */

/* --- INTEGRASI: LOAD BARANG DARI SERVER --- */
async function loadItems() {
    try {
        const res = await fetch(`${API_URL}/items`);
        const data = await res.json();
        const container = document.getElementById('items-grid'); 

        

        if(container) {
            container.innerHTML = ''; // Hapus data lama/dummy

            data.forEach(item => {
                const categoryClass = item.status === 'HILANG' ? 'lost' : 'found';
                const statusColor = item.status === 'HILANG' ? 'bg-red-400' : 'bg-green-400';
                const imgUrl = item.foto ? `http://localhost:3000${item.foto}` : 'https://via.placeholder.com/150';

                // Cegah error null/undefined
                const lokasi = item.lokasi || '-';
                const deskripsi = item.deskripsi || 'Tidak ada deskripsi.';
                const kontak = item.kontak || '';

                // HTML kartu
                const html = `
                    <div class="item-card ${categoryClass} bg-white flex flex-col p-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                         onclick="openDetailBackend(this)"
                         data-id="${item.id}"
                         data-name="${item.nama}"
                         data-status="${item.status}"
                         data-contact="${kontak}"
                         data-location="${lokasi}"
                         data-desc="${deskripsi}"
                         data-img="${imgUrl}"
                         data-date="${item.tanggal}">
                        
                        <div class="relative h-40 w-full overflow-hidden rounded-lg mb-3">
                            <img src="${imgUrl}" class="w-full h-full object-cover">
                            <span class="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${statusColor} text-white">
                                ${item.status}
                            </span>
                        </div>
                        
                        <div class="flex-grow">
                            <p class="font-bold text-lg text-gray-800 line-clamp-1">${item.nama}</p>
                            <span class="text-sm text-gray-500">📍 ${lokasi}</span>
                        </div>

                        <div class="mt-2 pt-2 border-t border-dashed border-gray-100">
                            <span class="text-[10px] text-gray-400 font-mono italic">🕒 ${item.tanggal}</span>
                        </div>
                    </div>
                `;
                container.innerHTML += html;
            });
        }
    } catch (err) { console.error("Gagal load items:", err); }
}

// open detail up backend

function openDetailBackend(card) {
    const modal = document.getElementById('detail-modal');

    const id = card.getAttribute('data-id'); 
    const name = card.getAttribute('data-name');
    const status = card.getAttribute('data-status');
    const contact = card.getAttribute('data-contact');
    const img = card.getAttribute('data-img');
    const date = card.getAttribute('data-date');

    document.getElementById('detail-name').innerText = name;
    
    // Set Status Badge
    const statusElem = document.getElementById('detail-status');
    statusElem.innerText = status;
    statusElem.className = status === 'HILANG' 
        ? 'status-tag bg-red-400 text-white px-4 py-1 rounded-full text-sm font-bold uppercase' 
        : 'status-tag bg-green-400 text-white px-4 py-1 rounded-full text-sm font-bold uppercase';
    
    document.getElementById('detail-img').src = img;
    
    // Set Lokasi & Waktu
    const locElem = document.getElementById('detail-location');
    if(locElem) locElem.querySelector('span').innerText = card.getAttribute('data-location') || '-';

    const timeElem = document.getElementById('detail-time');
    if(timeElem) timeElem.querySelector('span').innerText = date;

    const descText = status === 'HILANG' 
        ? `Barang ini hilang pada tanggal ${date}. Jika menemukan, tolong hubungi:` 
        : `Barang ini ditemukan pada tanggal ${date}. Pemilik bisa menghubungi:`;
    
    // Format WA
    let waLink = "#";
    if(contact) {
        let cleanNum = contact.toString().replace(/\D/g, '');
        if (cleanNum.startsWith('0')) cleanNum = '62' + cleanNum.slice(1);
        waLink = `https://wa.me/${cleanNum}`;
    }

    // tombol hapus
    document.getElementById('detail-desc').innerHTML = `
        <div class="flex flex-col gap-3">
            <p class="italic text-gray-600 text-lg leading-relaxed">"${card.getAttribute('data-desc')}"</p>
            
            <p class="text-sm text-gray-500 font-medium border-l-4 border-[#A890A6] pl-3 py-1 my-2 bg-gray-50 rounded-r-lg">
                ${descText}
            </p>
            
            <a href="${waLink}" target="_blank" class="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-sans font-bold py-3 px-6 rounded-full shadow-lg w-full no-underline transition-transform hover:-translate-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/>
                </svg>
                <span class="whitespace-nowrap">Hubungi via WhatsApp</span>
            </a>
            
            <p class="text-[10px] text-gray-400 text-center font-mono -mt-1">Nomor: ${contact}</p>

            <div class="border-t border-dashed border-gray-200 my-1"></div>
            
            <button onclick="deleteItem('${id}')" class="group w-full inline-flex items-center justify-center gap-2 bg-white border-2 border-red-100 hover:border-red-400 hover:bg-red-50 text-red-400 font-bold font-sans py-2.5 px-6 rounded-full transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                <span>Hapus Postingan</span>
            </button>
        </div>
    `;

    modal.classList.remove('hidden');
}

loadItems();

/* --- INTEGRASI: POSTING BARANG --- */
const postForm = document.getElementById('lf-post-form');

if (postForm) {
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(postForm);

        const typeTitle = document.getElementById('modal-form-title').innerText;
        const statusValue = (typeTitle === 'Lost') ? 'HILANG' : 'DITEMUKAN';
        formData.append('status', statusValue); 

        // ============================================================
        // Kode ini mencetak isi paket data ke Console Browser (cctv)
        console.log("=== SEDANG MENGIRIM DATA ===");
        let isDataEmpty = true;
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]); 
            if (pair[0] === 'nama' && pair[1].trim() !== '') isDataEmpty = false;
        }
        
        if (isDataEmpty) {
            alert("⚠️ BAHAYA: Browser mendeteksi Nama Barang kosong! Cek HTML kamu.");
            // Kita biarkan tetap kirim supaya bisa lihat error di server juga
        }
        // ============================================================

        try {
            const response = await fetch(`${API_URL}/items`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert("Berhasil memposting barang! 🎉");
                closeForm();
                postForm.reset();
                loadItems();
            } else {
                alert("Gagal posting, cek koneksi server.");
            }

        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan sistem.");
        }
    });
}

/* --- LOGIKA HAPUS BARANG --- */
async function deleteItem(id) {
    const password = prompt("Masukkan password yang kamu buat saat memposting barang ini:");

    if (!password) return;

    try {
        const res = await fetch(`${API_URL}/items/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: password })
        });

        const result = await res.json();

        if (res.ok) {
            alert("✅ " + result.message);
            document.getElementById('detail-modal').classList.add('hidden');
            loadItems();
        } else {
            alert("❌ Gagal: " + result.message);
        }

    } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan koneksi.");
    }
}