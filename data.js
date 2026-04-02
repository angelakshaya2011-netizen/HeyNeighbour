const placesData = [
    {
        id: 1,
        name: 'Café Icarus',
        category: 'Restaurants',
        description: 'Ideal place to have breakfast and brunch with your friends.They are known for their cold brew coffe.',
        rating: 4.7,
        speaksEnglish: false,
        imageUrl: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=600&q=80',
        mapsUrl: 'https://goo.gl/google.com/maps?rlz=1C1CHBF_esMX1069MX1069&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIICAEQABgWGB4yCAgCEAAYFhgeMggIAxAAGBYYHjIICAQQABgWGB4yCAgFEAAYFhgeMggIBhAAGBYYHjIICAcQABgWGB4yCAgIEAAYFhgeMggICRAAGBYYHtIBBzYwMWowajeoAgCwAgA&um=1&ie=UTF-8&fb=1&gl=mx&sa=X&geocode=KeH-3solryiEMQ1jEA7nu8R0&daddr=Av.+Rubén+Darío+1253,+Providencia+4a.+Secc,+44639+Guadalajara,+Jal./example1'
    },
    {
        id: 2,
        name: 'Gaspar',
        category: 'Restaurants',
        description: 'Top-rated spots for gourmet burgers and a great bar selection',
        rating: 4.6,
        speaksEnglish: true,
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
        mapsUrl: 'google.com/maps?s=web&rlz=1C1CHBF_esMX1069MX1069&sca_esv=80e2d234b7bb7b01&lqi=ChJnYXNwYXIgcmVzdGF1cmFudGVIsZmxkoWvgIAIWh4QABABGAAiEmdhc3BhciByZXN0YXVyYW50ZTICZXOSAQpyZXN0YXVyYW50mgFEQ2k5RFFVbFJRVU52WkVOb2RIbGpSamx2VDIxU2FHVkZlRzFoV0U1TldURm9lVTVGYUc5UFV6RXhUak5TZUdGdVl4QUL6AQQIRxBD&phdesc=PuB6dqbUqCM&vet=12ahUKEwjJqsefzs-TAxXhLkQIHS49FucQ1YkKegQIJBAB..i&cs=1&um=1&ie=UTF-8&fb=1&gl=mx&sa=X&geocode=KVc8Yfg5ryiEMWryVdq_-pRU&daddr=Colonia+Providencia+-+Punto+Sao+Paulo,+2334+-+Local+E2+-+Providencia,+São+Paulo+-+SP,+44630,+Brazil'
    },
    {
        id: 3,
        name: 'Cantalú',
        category: 'Restaurants',
        description: 'A cozy health-focused café specializing in baguettes, chapatas, and "Vaketos" (unique keto-friendly desserts).',
        speaksEnglish: true,
        imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80',
        mapsUrl: 'google.com/maps?s=web&rlz=1C1CHBF_esMX1069MX1069&lqi=CgdjYW50YWx1SLqwsoqesICACFoREAAYACIHY2FudGFsdTICZXOSAQxlc3ByZXNzb19iYXI&phdesc=_7x0ZO0Ry9c&vet=12ahUKEwjhnvr82s-TAxVOlGoFHYSrEdkQ1YkKegQIGxAB..i&cs=1&um=1&ie=UTF-8&fb=1&gl=mx&sa=X&geocode=KUMOQ7rgryiEMdJAQCppyAn8&daddr=Av+Adolfo+López+Mateos+Nte+95,+Italia+Providencia,+44648+Guadalajara,+Jal.'
    },
    {
        id: 4,
        name: 'Caserol',
        category: 'Restaurants',
        description: 'A charming, "cabin-style" restaurant in Midtown known for its breakfast, high-quality bread, and creative presentation.',
        speaksEnglish: false,
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
        mapsUrl: 'google.com/maps?s=web&rlz=1C1CHBF_esMX1069MX1069&sca_esv=80e2d234b7bb7b01&lqi=ChRjYXNzZXJvbGUgcmVzdGF1cmFudEio5pybkLaAgAhaGhAAEAEiFGNhc3Nlcm9sZSByZXN0YXVyYW50kgEKcmVzdGF1cmFudJoBJENoZERTVWhOTUc5blMwVkpRMEZuU1VOQ1h6UlROekpCUlJBQvoBBAgAECk&phdesc=hDH_xqAQqRU&vet=12ahUKEwituI2g28-TAxULl2oFHe8EPDoQ1YkKegQIHhAO..i&cs=1&um=1&ie=UTF-8&fb=1&gl=mx&sa=X&geocode=KaPg0SparyiEMdVsrPFO2ING&daddr=Av+Terranova+657,+Prados+Providencia,+44630+Guadalajara,+Jal.'
    },
    {
        id: 5,
        name: 'Campomar',
        category: 'Restaurants',
        description: 'Excellent contemporary Nayarit-style seafood restaurant, perfect for a high-end lunch.',
        rating: 4.9,
        speaksEnglish: true,
        imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
        mapsUrl: 'https://www.google.com/maps/dir//Campomar+Andares,+Blvrd+Puerta+de+Hierro+%234965.+UP+13-10,+Puerta+de+Hierro,+45116+Guadalajara,+Jal./@20.7241425,-103.3399697,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x8428af8f2ad61263:0xbe95cf026ce36e56!2m2!1d-103.4132324!2d20.7094293?entry=ttu&g_ep=EgoyMDI2MDMzMS4wIKXMDSoASAFQAw%3D%3D'
    },
    {
        id: 6,
        name: 'Kaneishi',
        category: 'Restaurants',
        vegetarianOptions: true,
        description: 'Reliable options for sushi and Japanese-inspired bowls.',
        rating: 3.9,
        speaksEnglish: true,
        imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
        mapsUrl: 'google.com/maps?newwindow=1&sca_esv=9506f15c4682863e&rlz=1C1CHBF_esMX1069MX1069&biw=1280&bih=551&uact=5&gs_lp=Egxnd3Mtd2l6LXNlcnAiEmthbmVzaGkgcmVzdGF1cmFudDIGEAAYDRgeMggQABgWGAoYHjIIEAAYBRgNGB4yCBAAGAgYDRgeMggQABgIGA0YHjIIEAAYCBgNGB4yCxAAGIAEGIYDGIoFMggQABiABBiiBDIFEAAY7wUyCBAAGIAEGKIESPhiUHJYh2FwBHgBkAEAmAGOAaABng-qAQQwLjE2uAEDyAEA-AEBmAIUoAKSEcICChAAGLADGNYEGEfCAg0QABiABBiwAxhDGIoFwgIOEAAYsAMY5AIY1gTYAQHCAhMQLhiABBiwAxhDGMgDGIoF2AEBwgIKEC4YgAQYQxiKBcICChAAGIAEGEMYigXCAgUQABiABMICCxAuGIAEGMcBGK8BwgIZEC4YgAQYQxiKBRiXBRjcBBjeBBjgBNgBAcICCRAAGIAEGAoYC8ICDxAuGIAEGMcBGAoYCxivAcICBxAuGIAEGArCAgcQABiABBgKwgIHEC4YgAQYDcICBxAAGIAEGA3CAg0QLhiABBjHARgNGK8BwgIWEC4YgAQYDRiXBRjcBBjeBBjgBNgBAcICBhAAGBYYHpgDAIgGAZAGE7oGBggBEAEYCZIHBDQuMTagB9_YAbIHBDAuMTa4B94QwgcGMi03LjEzyAfAAYAIAA&um=1&ie=UTF-8&fb=1&gl=mx&sa=X&geocode=Kbtt877_ryiEMfc2VRMRzyVp&daddr=Av+Adolfo+López+Mateos+Nte+2405-local+MG+17,+Italia+Providencia,+44648+Guadalajara,+Jal.'
    },
    {
        id: 7,
        name: 'Tacos Providencia',
        vegetarianOptions: false,
        category: 'Restaurants',
        description: 'A local institution. They are famous for their tacos de labio, lengua, and adobada, served with a legendary green salsa.',
        rating: 4.5,
        speaksEnglish: false,
        imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
        mapsUrl: 'https://www.google.com/maps/dir//Tacos+Providencia,+Av.+Rub%C3%A9n+Dar%C3%ADo+534,+Lomas+de+Guevara,+44657+Guadalajara,+Jal./@20.7241425,-103.3399697,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x8428ae6a63561a07:0x5c4c9362fe658cb!2m2!1d-103.3850836!2d20.6853032?entry=ttu&g_ep=EgoyMDI2MDMzMS4wIKXMDSoASAFQAw%3D%3D'
    },
    {
        id: 8,
        name: 'Tortas Toño',
        category: 'Restaurants',
        vegetarianOptions: false,
        description: 'One of the most famous chains for Tortas Ahogadas (pork sandwiches drowned in tomato and chili sauce).',
        rating: 4.5,
        speaksEnglish: false,
        imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
        mapsUrl: 'google.com/maps?s=web&rlz=1C1CHBF_esMX1069MX1069&lqi=Cg90b3J0YXMgdG9ubyBnZGxIoNbG1uWAgIAIWh8QABABGAAYARgCIg90b3J0YXMgdG9ubyBnZGwyAmVzkgEYbWV4aWNhbl90b3J0YV9yZXN0YXVyYW50&phdesc=7jRjdiMBEbM&vet=12ahUKEwiHtbLy-M-TAxXkMUQIHUcNMagQ1YkKegQIHRAB..i&cs=1&um=1&ie=UTF-8&fb=1&gl=mx&sa=X&geocode=KT3Mjp1FriiEMRYOXDFlYema&daddr=C.+Tierra+de+Fuego+3160-2,+Providencia,+44630+Guadalajara,+Jal.'
    },
    {
        id: 9,
        name: 'Porfirios',
        category: 'Restaurants',
        vegetarianOptions: false,
        description: 'A contemporary Mexican restaurant that reinterprets traditional street food into high-end dishes with a vibrant, festive atmosphere',
        rating: 4.4,
        speaksEnglish: true,
        imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
        mapsUrl: 'google.com/maps?rlz=1C1CHBF_esMX1069MX1069&gs_lcrp=EgZjaHJvbWUqBwgCEAAYgAQyBggAEEUYOTIQCAEQLhivARjHARiABBiOBTIHCAIQABiABDINCAMQLhivARjHARiABDIHCAQQABiABDIHCAUQABiABDINCAYQLhivARjHARiABDIHCAcQABiABDIHCAgQABiABNIBCDQ2NTVqMGo3qAIAsAIA&um=1&ie=UTF-8&fb=1&gl=mx&sa=X&geocode=KfvyFbc-ryiEMTRSM4-Y54YS&daddr=Punto,+São+Paulo+2334+A,+Providencia,+44630+Guadalajara,+Jal.'
    },
    {
        id: 10,
        name: 'Nikolaza',
        category: 'Restaurants',
        vegetarianOptions: true,
        description: 'A contemporary Mexican restaurant that reinterprets traditional street food into high-end dishes with a vibrant, festive atmosphere',
        rating: 4.4,
        speaksEnglish: true,
        imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
        mapsUrl: 'https://www.google.com/maps?rlz=1C1CHBF_esMX1069MX1069&gs_lcrp=EgZjaHJvbWUqEAgBEC4YrwEYxwEYgAQYjgUyBggAEEUYOzIQCAEQLhivARjHARiABBiOBTILCAIQLhgKGAsYgAQyCwgDEC4YChgLGIAEMgsIBBAAGAoYCxiABDILCAUQLhgKGAsYgAQyCwgGEAAYChgLGIAEMgsIBxAuGAoYCxiABDILCAgQABgKGAsYgATSAQg0MDA4ajBqOagCBrACAfEFukb9XYz2rKE&um=1&ie=UTF-8&fb=1&gl=mx&sa=X&geocode=KfU4n5dvryiEMRNcKG-3dl5b&daddr=C.+Colomos+2218,+Ayuntamiento,+44620+Guadalajara,+Jal.'
    }
];

const eventsData = [
    {
        id: 1,
        title: 'Festival Internacional de Cine en Guadalajara',
        culture: 'Mexican / International',
        date: 'April 17–25, 2026',
        location: 'Cineteca FICG',
        description: 'One of the most important film festivals in Latin America bringing together filmmakers, actors, and cinema enthusiasts for screenings and networking.',
        imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80',
        mapsUrl: 'https://goo.gl/maps/b9nQv2o9rPxXhL1v5'
    },
    {
        id: 2,
        title: 'Diwali Festival de las Luces',
        culture: 'Indian',
        date: 'November 2026',
        location: 'Expo Guadalajara',
        description: 'Celebrate the Indian Festival of Lights with traditional food, dance performances, henna art, and spectacular lighting displays presented by the Indian expat community.',
        imageUrl: 'https://images.unsplash.com/photo-1514222134-b57eaf8ce22e?w=600&q=80',
        mapsUrl: 'https://goo.gl/maps/P5LgZ1j8uT8Tj6hWA'
    },
    {
        id: 3,
        title: 'Fiestas de Octubre',
        culture: 'Mexican',
        date: 'October – November 2026',
        location: 'Auditorio Benito Juárez',
        description: 'A massive month-long city-wide celebration showcasing Mexican culture with concerts, regional dances, art exhibits, and a large traditional fair.',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
        mapsUrl: 'https://goo.gl/maps/hPqE1pWz6kH2x7gM8'
    },
    {
        id: 4,
        title: 'Oktoberfest Guadalajara',
        culture: 'German',
        date: 'Mid-October 2026',
        location: 'Club Alemán de Occidente',
        description: 'Authentic Bavarian beer, pretzels, bratwurst, and traditional German folk music in a huge festive tent hosted by the local German club.',
        imageUrl: 'https://images.unsplash.com/photo-1538356111053-748a48e1acb8?w=600&q=80',
        mapsUrl: 'https://goo.gl/maps/8JtXz2pMv5QZQzVf7'
    },
    {
        id: 5,
        title: 'Romería de la Virgen de Zapopan',
        culture: 'Mexican',
        date: 'October 12, 2026',
        location: 'Guadalajara Cathedral to Basilica of Zapopan',
        description: 'A deeply significant UNESCO recognized cultural procession involving millions of people accompanying the image of the Virgin of Zapopan on an 8km pilgrimage.',
        imageUrl: 'https://images.unsplash.com/photo-1549488344-c7821eb57d9b?w=600&q=80',
        mapsUrl: 'https://goo.gl/maps/Z9zXrXoX5vXZqG5H8'
    },
    {
        id: 6,
        title: 'Matsuri Japones',
        culture: 'Japanese',
        date: 'May 2026',
        location: 'Jardín Japonés, Bosque los Colomos',
        description: 'Experience Japanese culture through an authentic Matsuri with matcha tasting, taiko drumming, and traditional garments within the beautiful Japanese garden.',
        imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80',
        mapsUrl: 'https://goo.gl/maps/F5PzvG7d5H7Hj8Rj7'
    }
];
