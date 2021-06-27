# Design Pad ( `Demo` )

This project is a design site like Microsoft Powerpoint.

## What's included

- Angular 10+ & Typescript
- Bootstrap 4+ & SCSS
- Firebase
- API and node modules
  - [Pdfcrowd API](https://pdfcrowd.com/)
  - [Selecto](https://www.npmjs.com/package/selecto)
  - [Moveable](https://www.npmjs.com/package/moveable)
  - [SimpleUndo](https://www.npmjs.com/package/simple-undo)
  - [Quill](https://quilljs.com/docs/quickstart/)

## Demo

[Live Demo](https://design-pad-a3fe7.web.app/)
| <img src="https://firebasestorage.googleapis.com/v0/b/design-pad-a3fe7.appspot.com/o/readme%2FScreenshot_2.jpg?alt=media&token=e3306440-6624-45f7-a860-c9c9896e3ff1"/>| <img src="https://firebasestorage.googleapis.com/v0/b/design-pad-a3fe7.appspot.com/o/readme%2FScreenshot_3.jpg?alt=media&token=9fe1c934-b37a-4dae-addc-c0beb9d087ad"/> |
| --- | --- |
| Home | Image |

| <img src="https://firebasestorage.googleapis.com/v0/b/design-pad-a3fe7.appspot.com/o/readme%2FScreenshot_1.jpg?alt=media&token=4560be8c-0552-40bd-bfc3-9f1aeb0b711f"/> | <img src="https://firebasestorage.googleapis.com/v0/b/design-pad-a3fe7.appspot.com/o/readme%2FScreenshot_4.jpg?alt=media&token=22742a23-4b53-47a2-887c-442dcfa9fdc9"/> |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Element                                                                                                                                                                | Text                                                                                                                                                                   |

## Getting Started

- Install dependancies

```
npm install
```

- Run the application

```
ng serve
```

- Build the application

```
ng build --prod
```

## Firebase setup

- Project and billing

Create a project and enable these things

```
- firebase authentication (email, google, facebook)
- firestore
- hosting
- storage
```

- environment.ts

Your angular environment.ts file has firebase setup. Replace that config with yours.

## Documentation

### Components Directory

- views (_src\app\views_)
  - admin : admin page
  - app
    - design-panel : the page include toolbar and design panel
    - page
      - edit-item, text-item
        - edit-item : Quill.js is used for text clip.
          There are two elements to show quill text and curve text.
        - text-item : area to select the text
      - element
        - svgelement : To show the svg image
        - svgselector : To select the svg
      - image
        - image-element: To show the image
        - image-selector: To select the image
  - sidebar : To add item on design pad
    - elements : To show uploaded svg images on sidebar
    - photos : To show uploaded images on sidebar
    - templates : To show saved admin and user templates on sidebar
    - text : To show styled text on sidebar
    - user-uploads : User can upload files from devices
  - toolbar : To handle the style of the clips. It is shown when clip is put on pad
  - toolpanel : This is shown on sidebar
    - filter: To filter images. This is on image toolbar.
    - preset : To show filtered image
    - font-list: To select google fonts
    - text-effects : Add effect to text
  - topnav : user setting drop menu
- home : home page
- user : auth page

### Functionality of the product

- Templates : Save admin and user templates (_src\app\views\app\design-panel\design-panel.component.ts_)
  - UploadTemplate( ) : Save the thumbnail and the data to firestore.
    > The data (_src\app\services\design.service.ts : theDesign_) is the info of the design pad.
  - Elements : Get color of SVG image is loaded. (_src\app\views\app\page\element\svgelement\svgelement.component.ts_)
    > getSVGColorCollection( ) : This is called when SVG image is loaded.
  - Text : google fonts (_src\app\views\app\app.component.ts_)
    > ngOnInit() : When first page is loaded, google fonts is imported
  - design.service.ts (_src\app\services\design.service.ts_)
    - theDesign : the info of the design pad
      - theDesign.category.size
        > The width and height of the design pad.
      - theDesign.pages
        > There are all pages that is created.
      - theDesign.pages[ index of the pages ].items
        > There are all items that is put on this page.
    - addItemToCurrentPage(_item_)
      > This item is added to selected page.
    - onKeyEvent( )
      - MouseEvent
      - Undo and Redo
      - Drag item using arrow button
      - Copy and Paste item
  - moveable.service.ts (_src\app\services\moveable.service.ts_)
    - initSelecto()
      > Create new selecto
    - onSelectTarget(_targets_)
      > This targets are items that is selected.
      > Add moveable to items { makeMoveableImage(_thePageId, targets[0]_) }
    - resizeObserver()
      > Detect changed of the text area
    - curveTextObserver()
      > Detect changed of the curved text area
  - download.service.ts (_src\app\services\download.service.ts_)
    - downloadAsPdf()
      > Download all pages as pdf.
    - downloadAsImg()
      > Download all pages as image
  - toolbar.service.ts (_src\app\services\toolbar.service.ts_)
    - createTextEditor()
      > Create quill editor
  - authentication (_src\app\shared\auth.service.ts_)
  - auth guard (_src\app\shared\auth.guard.ts_)
