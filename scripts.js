const search = document.getElementById('search');
const gallery = document.getElementById('gallery');

const images = [
    {
        imageUrl: "https://i.pinimg.com/236x/5a/22/20/5a2220e063090344d0b1264ab87aa75e.jpg",
        annotation: "Katy Perry yeux fermé bizarre"
    },
    {
        imageUrl: "https://www.madmoizelle.com/wp-content/uploads/2017/02/meme-fevrier-2017.jpg",
        annotation: "noir réfléchie doigt"
    },
    {
        imageUrl: "https://i.giphy.com/media/bSRLdmjuzH3JEk9l5P/giphy.webp",
        annotation: "ooooooo"
    },
    {
        imageUrl: "https://i.giphy.com/media/r1fDuPIcs18d2/giphy.webp",
        annotation: "Snoop Dogg yeah"
    },
    {
        imageUrl: "https://i.giphy.com/media/nFjDu1LjEADh6/giphy.webp",
        annotation: "Keiran Lee Reaction"
    },
    {
        imageUrl: "https://media0.giphy.com/media/dmzGl9ROAC2sG7C9Jr/giphy.gif?cid=ecf05e4751a1b8ff13b126dc2fd4f9a683788a24abb89eb4&rid=giphy.gif&ct=g",
        annotation: "College Hoops Basketball GIF By NCAA March Madness"
    },
    {
        imageUrl: "https://media1.giphy.com/media/UW7r8NpzD5HifriseG/giphy.gif?cid=ecf05e47182fa345a353c257878c5bfd63879b5928375354&rid=giphy.gif&ct=g",
        annotation: "Se retourne et croise les bras"
    },
    {
        imageUrl: "https://i.giphy.com/media/nVXzt7FSJlX7W/giphy.webp",
        annotation: "Toy Story Aliens"
    },
    {
        imageUrl: "https://media3.giphy.com/media/R6gvnAxj2ISzJdbA63/giphy.gif?cid=ecf05e47n71ep9xvrw8ek4d5tjjweha5aiqp6jexeij4b58n&rid=giphy.gif&ct=g",
        annotation: ["I love you", "Je t'aime", "coeur sur toi"]
    }
    
    
    // Ajoutez d'autres objets image ici
];

function reformatString(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

search.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase().trim();

    const filteredImages = images
        .map((image) => {
            if (Array.isArray(image.annotation)) {
                
                let score = 0;
                let ann = image.annotation[0];

                image.annotation.forEach(it => {
                    const sc = stringSimilarity.compareTwoStrings(reformatString(keyword), reformatString(it))
                    if (sc > score) {
                        score = sc;
                        ann = it
                    }
                })

                return [image, score]

            } else {
                return [image, stringSimilarity.compareTwoStrings(reformatString(keyword), reformatString(image.annotation))]
            }
        })
        .filter((it) => {
            return it[1] > 0
        })

    filteredImages.sort((a, b) => {
        return a[1] - b[1];
    });

    filteredImages.reverse()

    if (filteredImages.length > 0) {
        displayImages(filteredImages.map(it => it[0]));
    } else {
        displayImages(images)
    }

    
});

function displayImages(images) {
    gallery.innerHTML = '';

    images.forEach((image) => {
        const imgElement = document.createElement('img');
        imgElement.src = image.imageUrl;
        imgElement.alt = image.annotation;
        imgElement.addEventListener('click', () => showImageModal(image));
        gallery.appendChild(imgElement);
    });
}

// Afficher la boîte modale avec l'image et l'annotation
function showImageModal(image) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    const caption = document.getElementById('caption');

    modal.style.display = 'flex';
    modalImage.src = image.imageUrl;
    if (Array.isArray(image.annotation)) {
        modalImage.alt = image.annotation.join(" | ");
        caption.textContent = image.annotation.join(" | ");
    } else {
        modalImage.alt = image.annotation;
        caption.textContent = image.annotation;
    }

    const close = document.querySelector('.close');
    close.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}


// Afficher toutes les images au chargement de la page
displayImages(images);
