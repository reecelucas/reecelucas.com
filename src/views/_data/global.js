module.exports = {
  year: new Date().getFullYear(),
  navigation: [
    {
      label: 'About',
      href: '#about',
      skipLink: true,
      inline: true
    },
    {
      label: 'Projects',
      href: '#work',
      skipLink: true,
      inline: true
    },
    {
      label: 'Contact',
      href: '#contact',
      skipLink: true,
      inline: true
    },
    {
      label: 'CV',
      href: '/assets/reece-lucas-cv.pdf',
      inline: true
    },
    {
      label: 'Hire me',
      href: '#contact',
      skipLink: true
    }
  ],
  fonts: [
    {
      name: 'EB Garamond',
      weight: 400,
      path: '/assets/fonts/eb-garamond-regular.woff2'
    }
  ]
};
