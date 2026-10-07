// Vector redraw of the Hashbrown Studios logo blob (viewBox -2 -2 104 104).
export const BLOB =
  "M58 0C72 0 80 5 86 10C94 17 99 28 100 40C101 52 98 62 93 70C87 80 80 90 70 95C62 99 56 100 48 100C36 100 24 95 15 86C6 77 1 64 0 50C-1 36 5 22 14 14C24 5 40 0 58 0Z";

export const BLOB_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='-2 -2 104 104'><path d='${BLOB}'/></svg>`,
)}")`;

export const CONTACT = {
  email: "hashbrownstudios1@gmail.com",
  phoneDisplay: "+92 364 4915188",
  phoneHref: "tel:+923644915188",
  whatsapp: "923644915188",
  instagram: "https://www.instagram.com/hashbrownstudios/",
  instagramHandle: "@hashbrownstudios",
  address: "G-11 Markaz, Islamabad, Pakistan",
  mapsLink: "https://www.google.com/maps/search/?api=1&query=33.66877%2C72.99891",
  directions: "https://www.google.com/maps/dir/?api=1&destination=33.66877%2C72.99891",
  // Styled view is centred with no Google marker so the branded pin sits on the spot; the explore view adds Google's marker.
  mapsEmbed: "https://maps.google.com/maps?ll=33.66877,72.99891&z=16&hl=en&output=embed",
  mapsEmbedExplore: "https://maps.google.com/maps?q=33.66877,72.99891&z=16&hl=en&output=embed",
};

export const GEO = { lat: 33.66877, lng: 72.99891 };

export const FOUNDER = {
  name: "Talal Tasawar",
  role: "Founder, designer and developer",
  bio: "Talal founded Hashbrown Studios and leads design and development on every project, from the first call to launch day. Recent launches include Tapvate, Classic Detailers, Revamp Detailing, AutoPub Detailing and Rehan Car Wraps.",
};
