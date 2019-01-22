module.exports = {
  year: new Date().getFullYear(),
  navigation: [
    {
      label: 'About',
      url: '#about',
      skipLink: true,
      inline: true
    },
    {
      label: 'Projects',
      url: '#work',
      skipLink: true,
      inline: true
    },
    {
      label: 'Contact',
      url: '#contact',
      skipLink: true,
      inline: true
    },
    {
      label: 'CV',
      url: '/assets/reece-lucas-cv.pdf',
      inline: true
    },
    {
      label: 'Hire me',
      url: '#contact',
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
