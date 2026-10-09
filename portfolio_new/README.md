# Piyush Jadhav — portfolio

    site/
      index.html            home (hero, work, about, contact)
      case-studies/         culinarr.html · dwp.html · autodesk.html
      css/site.css          tokens, navbar, buttons, home sections, accessibility panel
      css/case-study.css    case-study components (cards, stepper, tables, galleries)
      css/tailwind.css      compiled utilities used by the case-study markup
      js/site.js            navbar, menu, reveal, accessibility panel
      js/case-study.js      side stepper + reveal on case-study pages
      images/               case-study images (currently placeholders)

Theme: light/dark via `html[data-theme]`. First visit follows the OS setting; the sun/moon button in the navbar overrides it and is remembered (`pj-theme` in localStorage). Dark tokens live at the end of `css/site.css` and next to the `--c-*` triples in `css/case-study.css`; Tailwind `dark:` variants follow the same attribute.

Case studies share one article language (Culinarr is the reference): single column, `[ bracket ]` labels (`.eyebrow--case`) above headings, `<hr>` dividers, `.case-lede`, `.case-meta-pill`, `.case-pullquote`.

Fonts: Fraunces (display), Plus Jakarta Sans (body, labels, buttons). Caveat stays for hand annotations.
Buttons: primary = black, orange on hover; secondary = orange outline, darker-beige fill on hover.

Still to add: `assets/Resume.pdf` and `assets/img/main-profile.jpeg`.

If you add or change Tailwind classes in a case study, rebuild css/tailwind.css:
`npx tailwindcss@3 -c tailwind.config.js -i input.css -o site/css/tailwind.css --minify`
(`tailwind.config.js` and `input.css` are in this folder).
