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
      label: 'Work',
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
      name: 'HKGrotesk',
      weight: 400,
      path: '/assets/fonts/HKGrotesk-Regular.woff2'
    },
    {
      name: 'HKGrotesk',
      weight: 700,
      path: '/assets/fonts/HKGrotesk-Bold.woff2'
    }
  ]
};
