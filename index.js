document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.querySelector(".search form");
    const cardContainer = document.querySelector(".section .row");

    searchForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const searchInput = document.querySelector(".search input").value.trim();
        if (!searchInput) {
            alert("Lütfen bir kelime girin!");
            return;
        }

        // API'yi çağır
        const response = await fetch("https://imageback-3unq.onrender.com/scrape", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                search_term: searchInput,
                num_images: 10,
                folder_name: searchInput.replace(/\s+/g, "_")
            })
        });

        const data = await response.json();
        if (!response.ok) {
            alert("Kazıma sırasında hata oluştu.");
            return;
        }

        alert(`Kazıma tamamlandı! Görseller yükleniyor...`);

        // Resimleri klasörden çekme
        await loadImagesFromFolder(searchInput.replace(/\s+/g, "_"));
    });

    async function loadImagesFromFolder(folderName) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/images/${folderName}`);
            const images = await response.json();

            if (!response.ok || images.length === 0) {
                alert("Resimler yüklenirken hata oluştu.");
                return;
            }

            cardContainer.innerHTML = "";

            images.forEach((imgSrc) => {
                const cardHTML = `
                    <div class="col">
                        <div class="card h-100">
                            <img src="${imgSrc}" class="card-img-top" alt="Scraped Image">
                        </div>
                    </div>`;
                cardContainer.innerHTML += cardHTML;
            });

        } catch (error) {
            console.error("Resimleri yüklerken hata:", error);
            alert("Resimleri yüklerken hata oluştu.");
        }
    }
});
