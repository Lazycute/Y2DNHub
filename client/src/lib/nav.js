export const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`;

export const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
