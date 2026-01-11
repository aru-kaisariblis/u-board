/* INDEX */


/* STORY */
const addBtn = document.getElementById('add-story-btn');
const formOverlay = document.getElementById('form-overlay');
const closeBtn = document.getElementById('close-btn');

// Buka Modal
if (addBtn && formOverlay) {
    addBtn.addEventListener('click', () => {
        formOverlay.classList.remove('hidden');
    });

// Tutup Modal
    closeBtn.addEventListener('click', () => {
        formOverlay.classList.add('hidden');
    });

// Tutup Modal jika klik area hitam di luar form
    formOverlay.addEventListener('click', (e) => {
        if (e.target === formOverlay) formOverlay.classList.add('hidden');
    });
}

/* LOST & FOUND */
function filterItems(category) {
    const cards = document.querySelectorAll('.item-card');
    const buttons = document.querySelectorAll('.filter-btn');

    // Update tampilan tombol aktif
    buttons.forEach(btn => {
        if (btn.innerText.toLowerCase() === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Logika Filter
    cards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'flex';
        } else {
            if (card.classList.contains(category)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

/*detail post*/
const detailModal = document.getElementById('detail-modal');
const closeDetail = document.getElementById('close-detail');

// Fungsi untuk membuka detail
function openDetail(card) {
    const name = card.querySelector('p').innerText;
    // Mengambil lokasi
    const location = card.querySelector('span.text-sm').innerText;
    // MENGAMBIL WAKTU (Cari span yang ada di dalam div bawah)
    const time = card.querySelector('.font-mono')?.innerText || "Waktu tidak tersedia";
    
    const status = card.classList.contains('found') ? 'Found' : 'Lost';
    const statusBg = card.classList.contains('found') ? '#4ade80' : '#f87171';
    
    // Sinkronisasi Data ke Modal
    document.getElementById('detail-name').innerText = name;
    document.getElementById('detail-location').querySelector('span').innerText = location;
    
    // MASUKKAN WAKTU KE MODAL
    document.getElementById('detail-time').querySelector('span').innerText = time;
    
    document.getElementById('detail-status').innerText = status;
    document.getElementById('detail-status').style.backgroundColor = statusBg;
    
    document.getElementById('detail-desc').innerText = "Kontak & Detail: Silakan cek informasi yang tertera di sini. " + (status === 'Lost' ? "Bagi yang menemukan hubungi nomor di atas." : "Bagi pemilik sah silakan hubungi nomor di atas.");
    
    document.getElementById('detail-img').src = "https://via.placeholder.com/400"; 

    detailModal.classList.remove('hidden');
}

// Tambahkan event listener ke semua kartu yang ada
document.addEventListener('click', (e) => {
    const card = e.target.closest('.item-card');
    if (card) {
        openDetail(card);
    }
});

// Tutup modal
if (closeDetail) {
    closeDetail.addEventListener('click', () => detailModal.classList.add('hidden'));
}

detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) detailModal.classList.add('hidden');
});

/*searching logic*/
const searchInput = document.getElementById('search-input');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase(); // Ambil teks input
        const cards = document.querySelectorAll('.item-card'); // Ambil semua kartu mading

        cards.forEach(card => {
            const itemName = card.querySelector('p').innerText.toLowerCase(); // Ambil nama barang di kartu
            
            // Jika nama barang cocok dengan kata kunci, tampilkan. Jika tidak, sembunyikan.
            if (itemName.includes(keyword)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
}
/*+add button logic*/
/* --- FAB & INPUT MODAL LOGIC --- */
const mainBtn = document.getElementById('fab-main-btn');
const fabMenu = document.getElementById('fab-menu');
const fabOverlay = document.getElementById('fab-overlay');
const fabIcon = document.getElementById('fab-icon');
const inputModal = document.getElementById('input-modal');

// Fungsi menutup FAB
function closeFab() {
    fabMenu.classList.remove('menu-visible');
    fabOverlay.classList.remove('overlay-visible');
    fabIcon.style.transform = 'rotate(0deg)';
}

// Klik tombol +
mainBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = fabMenu.classList.contains('menu-visible');
    if (!isOpen) {
        fabMenu.classList.add('menu-visible');
        fabOverlay.classList.add('overlay-visible');
        fabIcon.style.transform = 'rotate(45deg)';
    } else {
        closeFab();
    }
});

// Fungsi Membuka Form (Dipanggil dari atribut onclick di HTML)
function openForm(type) {
    closeFab(); // Tutup menu FAB dulu
    
    const title = document.getElementById('modal-form-title');
    const btn = document.getElementById('submit-btn');
    
    title.innerText = type;
    // Set warna tombol Posting sesuai tipe
    btn.style.backgroundColor = (type === 'Lost') ? '#f87171' : '#66BB6A';
    
    inputModal.classList.remove('hidden');
}

// Fungsi Menutup Form
function closeForm() {
    inputModal.classList.add('hidden');
}

// Tutup modal jika klik di area blur (luar form)
inputModal.addEventListener('click', (e) => {
    if (e.target === inputModal) closeForm();
});

// Pastikan overlay FAB juga bisa menutup FAB
fabOverlay?.addEventListener('click', closeFab);

/*waktu post
/* --- LOGIKA POSTING & TIMESTAMP --- */
const lfPostForm = document.getElementById('lf-post-form');

lfPostForm?.addEventListener('submit', (e) => {
    e.preventDefault(); 

    // Ambil input berdasarkan ID yang baru kita tambahkan di HTML
    const itemName = document.getElementById('input-item-name').value;
    const itemLocation = document.getElementById('input-item-location').value;
    const itemType = document.getElementById('modal-form-title').innerText; 
    
    // Buat waktu sekarang
    const now = new Date();
    const timeString = now.toLocaleDateString('id-ID', { 
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
    });

    const grid = document.getElementById('items-grid');
    const newCard = document.createElement('div');
    
    const statusColor = itemType === 'Lost' ? 'bg-red-400' : 'bg-green-400';
    const randomRotation = Math.floor(Math.random() * 5) - 2; 

    newCard.className = `item-card bg-white ${itemType.toLowerCase()} flex flex-col`;
    newCard.style.transform = `rotate(${randomRotation}deg)`;

    // Template kartu yang memiliki Timestamp
    newCard.innerHTML = `
        <div class="status-tag ${statusColor} text-white">${itemType}</div>
        <p class="text-xl font-semibold">${itemName}</p>
        <span class="text-sm text-gray-500">Lokasi: ${itemLocation}</span>
        <div class="mt-auto pt-2 border-t border-dashed border-gray-100">
            <span class="text-[10px] text-gray-400 font-mono italic">🕒 ${timeString}</span>
        </div>
    `;

    grid.prepend(newCard); // Tambahkan ke mading
    closeForm();           // Tutup modal
    lfPostForm.reset();    // Kosongkan form
});